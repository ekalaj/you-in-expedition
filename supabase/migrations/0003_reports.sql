-- =====================================================================
-- Common Ground — reports (trust & safety)
-- Lets a member flag an activity (and implicitly its host) for review.
-- Operators read these via the Supabase dashboard / service role.
-- =====================================================================

create table public.reports (
  id                  uuid primary key default gen_random_uuid(),
  reporter_id         uuid references public.profiles(id)  on delete set null,
  activity_id         uuid references public.activities(id) on delete set null,
  reported_profile_id uuid references public.profiles(id)  on delete set null,
  reason              text not null,
  details             text not null default '',
  status              text not null default 'open'
                        check (status in ('open','reviewing','resolved','dismissed')),
  created_at          timestamptz not null default now()
);

create index reports_status_idx on public.reports (status);

alter table public.reports enable row level security;

-- A signed-in member can file a report as themselves.
create policy "file own report"
  on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());

-- Members can see only their own reports; operators use the service role.
create policy "see own reports"
  on public.reports for select to authenticated
  using (reporter_id = auth.uid());
