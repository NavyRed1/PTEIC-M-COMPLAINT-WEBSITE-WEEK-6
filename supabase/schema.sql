-- ITS Campus Problem Reporting App — Supabase schema
-- Run this in the Supabase SQL editor.

-- 1. Enum types ----------------------------------------------------------
create type report_category as enum (
  'broken_furniture',
  'broken_lighting',
  'cleanliness',
  'damaged_facilities',
  'plumbing',
  'other'
);

create type report_status as enum ('pending', 'in_progress', 'completed');

-- 2. Staff table (controls who may change report status) ----------------
-- Add a row per authorized staff member's auth.users id.
create table if not exists public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 3. Reports table --------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) > 0),
  category report_category not null default 'other',
  location text not null check (char_length(location) > 0),
  photo_url text,
  status report_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_user_id_idx on public.reports (user_id);
create index if not exists reports_status_idx on public.reports (status);
create index if not exists reports_category_idx on public.reports (category);
create index if not exists reports_created_at_idx on public.reports (created_at desc);

-- Keep updated_at current on every update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

-- 4. Row Level Security ----------------------------------------------------
alter table public.reports enable row level security;
alter table public.staff enable row level security;

-- Any authenticated student can view all reports (dashboard needs this).
create policy "Authenticated users can view reports"
  on public.reports for select
  to authenticated
  using (true);

-- Students can create their own reports.
create policy "Users can insert their own reports"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Only the reporting student may edit the content of their own report,
-- and only while it is still pending (prevents editing after staff act on it).
create policy "Owners can update their own pending reports"
  on public.reports for update
  to authenticated
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);

-- Only authorized staff (present in public.staff) may change status on any report.
create policy "Staff can update any report"
  on public.reports for update
  to authenticated
  using (exists (select 1 from public.staff s where s.user_id = auth.uid()))
  with check (exists (select 1 from public.staff s where s.user_id = auth.uid()));

-- Staff table is only readable by staff themselves (no public listing).
create policy "Staff can read their own staff row"
  on public.staff for select
  to authenticated
  using (auth.uid() = user_id);

-- 5. Storage bucket for photos --------------------------------------------
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

-- Anyone authenticated can upload into their own folder: <uid>/filename
create policy "Users can upload their own report photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'report-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read access for photos (bucket is public; policy is a backstop)
create policy "Anyone can view report photos"
  on storage.objects for select
  to public
  using (bucket_id = 'report-photos');
