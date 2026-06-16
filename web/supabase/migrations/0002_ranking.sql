-- =====================================================================
-- Common Ground — ranking / matching algorithm (SQL port)
-- Mirrors common-ground/js/recommend.js and ALGORITHM.md exactly:
-- the same six weighted signals, hard filters, and human-readable reasons.
-- Diversity re-rank is applied in the app layer on top of this ordering.
-- =====================================================================

create or replace function public.recommend_activities(
  p_profile_id uuid,
  p_limit int default 12
)
returns table (
  id             uuid,
  title          text,
  category       text,
  starts_at      timestamptz,
  place          text,
  area           text,
  capacity       int,
  host_name      text,
  attendee_count int,
  joined         boolean,
  distance_km    double precision,
  score          double precision,
  reasons        text[]
)
language sql
stable
as $$
  with me as (
    select id, interests, time_pref, home
    from public.profiles
    where id = p_profile_id
  ),
  -- people the member has shared an activity with (basis for the social signal)
  met as (
    select distinct a2.profile_id
    from public.attendees a1
    join public.attendees a2 on a2.activity_id = a1.activity_id
    where a1.profile_id = p_profile_id
      and a2.profile_id <> p_profile_id
  ),
  -- hard filter: upcoming only, then attach counts / distance
  cand as (
    select
      act.id, act.title, act.category, act.starts_at, act.place, act.area,
      act.capacity, act.location,
      p.name as host_name,
      (select count(*) from public.attendees at where at.activity_id = act.id) as attendee_count,
      exists(
        select 1 from public.attendees at
        where at.activity_id = act.id and at.profile_id = p_profile_id
      ) as joined,
      case
        when me.home is not null and act.location is not null
        then ST_Distance(me.home, act.location) / 1000.0
      end as distance_km,
      me.interests as my_interests,
      me.time_pref as my_time_pref
    from public.activities act
    join public.profiles p on p.id = act.host_id
    cross join me
    where act.starts_at >= now()
  ),
  -- second hard filter: drop full activities the member is not already in
  open_cand as (
    select * from cand
    where (capacity - attendee_count) > 0 or joined
  ),
  scored as (
    select
      c.*,
      (case when c.category = any(c.my_interests) then 1.0 else 0.15 end)::double precision as f_interest,
      (case when c.distance_km is null then 0.5 else exp(-c.distance_km / 3.0) end)::double precision as f_distance,
      (case
         when c.my_time_pref = 'any' then 0.8
         when c.my_time_pref = (
           case
             when extract(hour from c.starts_at) < 12 then 'morning'
             when extract(hour from c.starts_at) < 17 then 'afternoon'
             else 'evening'
           end) then 1.0
         else 0.4
       end)::double precision as f_time,
      least(1.0, (
        select count(*) from public.attendees at
        join met on met.profile_id = at.profile_id
        where at.activity_id = c.id
      )::numeric / 2.0)::double precision as f_social,
      (case
         when (c.capacity - c.attendee_count) <= 0 then 0.0
         when (c.capacity - c.attendee_count) <= 2 then 0.6
         else 1.0
       end)::double precision as f_avail,
      (case
         when c.starts_at <= now() + interval '3 days' then 1.0
         when c.starts_at <= now() + interval '7 days' then 0.7
         else 0.4
       end)::double precision as f_fresh
    from open_cand c
  )
  select
    id, title, category, starts_at, place, area, capacity, host_name,
    attendee_count, joined, distance_km,
    ( 0.35 * f_interest
    + 0.30 * f_distance
    + 0.15 * f_time
    + 0.10 * f_social
    + 0.05 * f_avail
    + 0.05 * f_fresh ) as score,
    array_remove(array[
      case when f_interest = 1.0 then 'Matches your interests' end,
      case
        when distance_km is not null and distance_km < 0.5 then 'Right nearby'
        when distance_km is not null then round((distance_km * 0.621)::numeric, 1)::text || ' mi away'
      end,
      case when f_time = 1.0 then 'Fits your preferred time' end,
      case when f_social > 0 then 'People you''ve met are going' end
    ], null) as reasons
  from scored
  order by score desc
  limit p_limit;
$$;

-- Allow signed-in members to call it.
grant execute on function public.recommend_activities(uuid, int) to authenticated;
