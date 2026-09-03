-- Logs every error report, used for basic rate-limiting (max 30/day/user) and
-- as a simple audit trail. No RLS policies on purpose: only the Edge Function
-- (using the service role key, which bypasses RLS entirely) ever touches this.
create table public.error_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  word_id integer not null,
  sv text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.error_reports enable row level security;
