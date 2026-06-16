-- =====================================================================
-- Common Ground — optional demo seed
-- Inserts sample activities hosted by the FIRST existing profile, so you can
-- see the app populated. Run AFTER signing up at least one user (so a profile
-- exists). Safe to run more than once only if you clear activities first.
-- =====================================================================

do $$
declare
  host uuid;
begin
  select id into host from public.profiles order by created_at limit 1;
  if host is null then
    raise notice 'No profile found — sign up a user first, then re-run this seed.';
    return;
  end if;

  insert into public.activities (host_id, title, category, starts_at, place, area, location, capacity, description) values
    (host, 'Friendly Bridge Afternoon', 'cards',    now() + interval '2 days' + time '14:00', 'Maple Street Community Center', 'Oakdale',   'SRID=4326;POINT(-83.104 42.462)', 8,  'A relaxed game of bridge for all levels. Tea and biscuits provided.'),
    (host, 'Tuesday Dominoes Club',      'dominoes', now() + interval '1 day'  + time '10:30', 'Riverside Library, Room B',     'Riverside', 'SRID=4326;POINT(-83.162 42.411)', 12, 'Our weekly dominoes get-together. Bones and boards are all here.'),
    (host, 'Knitting Circle & Cozy Chat','crafts',   now() + interval '3 days' + time '13:00', 'The Yarn Corner Café',          'Oakdale',   'SRID=4326;POINT(-83.104 42.462)', 10, 'Bring a project or start something new. Beginners very welcome.'),
    (host, 'Morning Walk in the Park',   'walking',  now() + interval '1 day'  + time '09:00', 'Greenfield Park, Main Gate',    'Greenfield','SRID=4326;POINT(-83.118 42.383)', 15, 'A gentle 30–40 minute stroll on flat, paved paths.'),
    (host, 'Coffee & Conversation',      'coffee',   now() + interval '4 days' + time '11:00', 'Corner Bean Coffee House',      'Riverside', 'SRID=4326;POINT(-83.162 42.411)', 6,  'No agenda — just good coffee and friendly faces.'),
    (host, 'Scrabble & Board Games Night','games',   now() + interval '5 days' + time '18:00', 'Oakdale Senior Lounge',         'Oakdale',   'SRID=4326;POINT(-83.104 42.462)', 10, 'Scrabble, Rummikub, checkers and more.');
end $$;
