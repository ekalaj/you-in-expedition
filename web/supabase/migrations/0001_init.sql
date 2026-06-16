-- =====================================================================
-- Common Ground — initial schema
-- Postgres + PostGIS. Designed to run on Supabase.
-- Neighborhood-level location only (never an exact home address).
-- =====================================================================

create extension if not exists postgis;
create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------- categories (lookup) ----------
create table public.categories (
  id   text primary key,
  name text not null,
  icon text not null,
  sort int  not null default 0
);

insert into public.categories (id, name, icon, sort) values
  ('cards',    'Playing Cards',     '🂡', 1),
  ('dominoes', 'Dominoes',          '🁫', 2),
  ('crafts',   'Knitting & Crafts', '🧶', 3),
  ('walking',  'Walking Group',     '🚶', 4),
  ('coffee',   'Coffee & Chat',     '☕', 5),
  ('games',    'Board Games',       '🎲', 6),
  ('garden',   'Gardening',         '🌷', 7),
  ('books',    'Book Club',         '📚', 8),
  ('music',    'Music & Singing',   '🎵', 9),
  ('meal',     'Shared Meal',       '🍲', 10);

-- ---------- profiles (1:1 with auth.users) ----------
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  name                text not null default '',
  email               text,
  area                text,                       -- neighborhood name shown in UI
  home                geography(point, 4326),     -- approximate point for distance
  interests           text[] not null default '{}',
  time_pref           text not null default 'any'
                        check (time_pref in ('morning','afternoon','evening','any')),
  -- billing / trial
  trial_ends_at       timestamptz not null default (now() + interval '30 days'),
  subscription_status text not null default 'trialing'
                        check (subscription_status in ('trialing','active','past_due','canceled')),
  stripe_customer_id  text,
  created_at          timestamptz not null default now()
);

-- ---------- activities ----------
create table public.activities (
  id          uuid primary key default gen_random_uuid(),
  host_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  category    text not null references public.categories(id),
  starts_at   timestamptz not null,
  place       text not null,
  area        text not null,
  location    geography(point, 4326),
  capacity    int  not null default 8 check (capacity between 2 and 100),
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index activities_starts_at_idx on public.activities (starts_at);
create index activities_category_idx  on public.activities (category);
create index activities_location_gix  on public.activities using gist (location);
create index profiles_home_gix        on public.profiles using gist (home);

-- ---------- attendees (RSVPs) ----------
create table public.attendees (
  activity_id uuid not null references public.activities(id) on delete cascade,
  profile_id  uuid not null references public.profiles(id)  on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (activity_id, profile_id)
);

create index attendees_profile_idx on public.attendees (profile_id);

-- The host is always the first attendee.
create or replace function public.add_host_as_attendee()
returns trigger language plpgsql as $$
begin
  insert into public.attendees (activity_id, profile_id)
  values (new.id, new.host_id)
  on conflict do nothing;
  return new;
end $$;

create trigger trg_add_host_as_attendee
  after insert on public.activities
  for each row execute function public.add_host_as_attendee();

-- Create a profile row automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles   enable row level security;
alter table public.activities enable row level security;
alter table public.attendees  enable row level security;
alter table public.categories enable row level security;

-- categories: readable by everyone
create policy "categories are public"
  on public.categories for select using (true);

-- profiles: any signed-in member can read profiles (to show host/attendee
-- names); you may only modify your own.
create policy "profiles readable by authenticated"
  on public.profiles for select to authenticated using (true);
create policy "update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- activities: readable by signed-in members; only the host can write.
create policy "activities readable by authenticated"
  on public.activities for select to authenticated using (true);
create policy "host can insert activity"
  on public.activities for insert to authenticated
  with check (host_id = auth.uid());
create policy "host can update activity"
  on public.activities for update to authenticated
  using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy "host can delete activity"
  on public.activities for delete to authenticated
  using (host_id = auth.uid());

-- attendees: readable by signed-in members; you manage only your own RSVP.
create policy "attendees readable by authenticated"
  on public.attendees for select to authenticated using (true);
create policy "join as self"
  on public.attendees for insert to authenticated
  with check (profile_id = auth.uid());
create policy "leave as self"
  on public.attendees for delete to authenticated
  using (profile_id = auth.uid());
