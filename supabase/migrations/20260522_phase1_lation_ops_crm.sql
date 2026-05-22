create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.talents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  country text not null default '',
  timezone text,
  tech_stack text[] not null default '{}',
  languages text[] not null default '{}',
  level text not null default 'mid' check (level in ('junior', 'mid', 'senior', 'lead', 'architect')),
  years_of_experience integer not null default 0 check (years_of_experience >= 0),
  specialization text not null default '',
  cv_url text,
  available_from date,
  employment_type text not null default 'full_time' check (employment_type in ('full_time', 'part_time', 'contract', 'freelance')),
  preferred_salary_min numeric,
  preferred_salary_max numeric,
  preferred_salary_currency text not null default 'USD',
  status text not null default 'active' check (status in ('active', 'placed', 'unavailable', 'reviewing')),
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint talents_preferred_salary_order check (
    preferred_salary_min is null
    or preferred_salary_max is null
    or preferred_salary_min <= preferred_salary_max
  )
);

create table if not exists public.employers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  industry text not null default '',
  country text not null default '',
  email text not null default '',
  phone text,
  website text,
  contact_name text not null default '',
  contact_email text not null default '',
  contact_phone text,
  employer_type text not null default 'hiring_company' check (employer_type in ('talent_source', 'hiring_company', 'both')),
  status text not null default 'active' check (status in ('active', 'inactive', 'prospect')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id),
  title text not null,
  description text,
  level text not null default 'mid' check (level in ('junior', 'mid', 'senior', 'lead', 'architect')),
  specialization text not null default '',
  required_skills text[] not null default '{}',
  languages_required text[] not null default '{}',
  salary_min numeric,
  salary_max numeric,
  currency text not null default 'USD',
  work_location text not null default 'remote' check (work_location in ('remote', 'hybrid', 'on_site')),
  contract_type text not null default 'full_time' check (contract_type in ('full_time', 'part_time', 'contract')),
  status text not null default 'open' check (status in ('open', 'paused', 'closed', 'filled')),
  posted_date date not null default current_date,
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint positions_salary_order check (salary_min is null or salary_max is null or salary_min <= salary_max)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  talent_id uuid not null references public.talents(id),
  position_id uuid not null references public.positions(id),
  status text not null default 'applied' check (
    status in ('applied', 'screening', 'interview_scheduled', 'interview_done', 'offer_sent', 'accepted', 'rejected', 'withdrawn')
  ),
  applied_at timestamptz not null default now(),
  interview_scheduled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.placements (
  id uuid primary key default gen_random_uuid(),
  talent_id uuid not null references public.talents(id),
  position_id uuid not null references public.positions(id),
  employer_id uuid not null references public.employers(id),
  application_id uuid not null references public.applications(id),
  start_date date not null,
  end_date date,
  final_salary numeric not null default 0 check (final_salary >= 0),
  commission_percentage numeric not null default 0 check (commission_percentage >= 0 and commission_percentage <= 100),
  commission_amount numeric not null default 0 check (commission_amount >= 0),
  status text not null default 'active' check (status in ('active', 'completed', 'terminated')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint placements_dates_order check (end_date is null or end_date >= start_date)
);

create trigger set_talents_updated_at
before update on public.talents
for each row execute function public.set_updated_at();

create trigger set_employers_updated_at
before update on public.employers
for each row execute function public.set_updated_at();

create trigger set_positions_updated_at
before update on public.positions
for each row execute function public.set_updated_at();

create trigger set_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create trigger set_placements_updated_at
before update on public.placements
for each row execute function public.set_updated_at();

alter table public.talents enable row level security;
alter table public.employers enable row level security;
alter table public.positions enable row level security;
alter table public.applications enable row level security;
alter table public.placements enable row level security;

comment on table public.talents is 'Lation Ops CRM Phase 1 table. Temporary anon CRUD RLS is enabled until authentication is added.';
comment on table public.employers is 'Lation Ops CRM Phase 1 table. Temporary anon CRUD RLS is enabled until authentication is added.';
comment on table public.positions is 'Lation Ops CRM Phase 1 table. Temporary anon CRUD RLS is enabled until authentication is added.';
comment on table public.applications is 'Lation Ops CRM Phase 1 table. Temporary anon CRUD RLS is enabled until authentication is added.';
comment on table public.placements is 'Lation Ops CRM Phase 1 table. Temporary anon CRUD RLS is enabled until authentication is added.';

create policy temporary_anon_select_talents on public.talents for select to anon using (true);
create policy temporary_anon_insert_talents on public.talents for insert to anon with check (true);
create policy temporary_anon_update_talents on public.talents for update to anon using (true) with check (true);
create policy temporary_anon_delete_talents on public.talents for delete to anon using (true);

create policy temporary_anon_select_employers on public.employers for select to anon using (true);
create policy temporary_anon_insert_employers on public.employers for insert to anon with check (true);
create policy temporary_anon_update_employers on public.employers for update to anon using (true) with check (true);
create policy temporary_anon_delete_employers on public.employers for delete to anon using (true);

create policy temporary_anon_select_positions on public.positions for select to anon using (true);
create policy temporary_anon_insert_positions on public.positions for insert to anon with check (true);
create policy temporary_anon_update_positions on public.positions for update to anon using (true) with check (true);
create policy temporary_anon_delete_positions on public.positions for delete to anon using (true);

create policy temporary_anon_select_applications on public.applications for select to anon using (true);
create policy temporary_anon_insert_applications on public.applications for insert to anon with check (true);
create policy temporary_anon_update_applications on public.applications for update to anon using (true) with check (true);
create policy temporary_anon_delete_applications on public.applications for delete to anon using (true);

create policy temporary_anon_select_placements on public.placements for select to anon using (true);
create policy temporary_anon_insert_placements on public.placements for insert to anon with check (true);
create policy temporary_anon_update_placements on public.placements for update to anon using (true) with check (true);
create policy temporary_anon_delete_placements on public.placements for delete to anon using (true);
