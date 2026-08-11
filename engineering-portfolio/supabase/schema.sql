-- Contact form storage for the engineering portfolio.
-- Run this in the Supabase SQL editor for your project (Dashboard > SQL Editor > New query).

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  project_details text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- The site's anon key may only INSERT rows — it can never read, update, or
-- delete existing submissions. Read the table from the Supabase dashboard,
-- which uses your service role and bypasses RLS.
create policy "Allow public inserts" on public.contact_submissions
  for insert
  to anon
  with check (true);
