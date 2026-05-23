alter table public.talents
add column if not exists linkedin_url text;

alter table public.talents
drop constraint if exists talents_status_check;

update public.talents
set status = case status
  when 'active' then 'available'
  when 'reviewing' then 'in_process'
  when 'unavailable' then 'inactive'
  else status
end
where status in ('active', 'reviewing', 'unavailable');

alter table public.talents
add constraint talents_status_check
check (status in ('prospect', 'available', 'in_process', 'placed', 'inactive'));

alter table public.applications
drop constraint if exists applications_status_check;

update public.applications
set status = case status
  when 'interview_scheduled' then 'interview'
  when 'interview_done' then 'reviewed'
  when 'withdrawn' then 'rejected'
  else status
end
where status in ('interview_scheduled', 'interview_done', 'withdrawn');

alter table public.applications
add constraint applications_status_check
check (status in ('applied', 'screening', 'interview', 'reviewed', 'offer_sent', 'accepted', 'rejected'));

alter table public.positions
drop constraint if exists positions_status_check;

update public.positions
set status = 'in_progress'
where status = 'paused';

alter table public.positions
add constraint positions_status_check
check (status in ('open', 'in_progress', 'filled', 'closed'));

alter table public.placements
add column if not exists commission_type text not null default 'percentage',
add column if not exists commission_fixed_fee numeric not null default 0,
add column if not exists currency text not null default 'USD';

alter table public.placements
drop constraint if exists placements_status_check;

update public.placements
set status = case status
  when 'active' then 'placed'
  when 'terminated' then 'completed'
  else status
end
where status in ('active', 'terminated');

alter table public.placements
add constraint placements_status_check
check (status in ('placed', 'completed', 'extended'));

alter table public.placements
drop constraint if exists placements_commission_type_check;

alter table public.placements
add constraint placements_commission_type_check
check (commission_type in ('percentage', 'fixed_fee', 'subscription', 'hybrid'));

notify pgrst, 'reload schema';
