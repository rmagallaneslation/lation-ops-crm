insert into public.talents (
  id, full_name, email, phone, country, timezone, tech_stack, languages, level,
  years_of_experience, specialization, cv_url, available_from, employment_type,
  preferred_salary_min, preferred_salary_max, preferred_salary_currency, status,
  created_by, created_at, updated_at
) values
  ('00000000-0000-4000-8000-000000000001', 'Carlos Herrera', 'carlos.h@gmail.com', '+52 81 1234 5678', 'Mexico', 'CST', array['React','TypeScript','Node.js','PostgreSQL'], array['Spanish','English'], 'senior', 6, 'Frontend', null, null, 'full_time', 5000, 7000, 'USD', 'active', null, '2026-01-10T10:00:00Z', '2026-01-10T10:00:00Z'),
  ('00000000-0000-4000-8000-000000000002', 'Valentina Rodriguez', 'vale.r@outlook.com', null, 'Colombia', 'COT', array['Python','Django','AWS','Docker'], array['Spanish','English'], 'mid', 3, 'Backend', null, null, 'full_time', 3000, 4500, 'USD', 'active', null, '2026-01-12T09:00:00Z', '2026-01-12T09:00:00Z'),
  ('00000000-0000-4000-8000-000000000003', 'Mateus Oliveira', 'mateus.o@email.com', null, 'Brazil', 'BRT', array['Java','Spring Boot','Kubernetes','GCP'], array['Portuguese','English'], 'senior', 8, 'Backend', null, null, 'contract', 5500, 7500, 'USD', 'active', null, '2026-01-15T11:00:00Z', '2026-01-15T11:00:00Z'),
  ('00000000-0000-4000-8000-000000000004', 'Sofia Martinez', 'sofia.m@mail.com', null, 'Argentina', 'ART', array['Vue.js','Nuxt','GraphQL','MongoDB'], array['Spanish','English','Italian'], 'mid', 4, 'Frontend', null, null, 'full_time', 4000, 5500, 'USD', 'placed', null, '2026-01-18T08:00:00Z', '2026-02-01T08:00:00Z'),
  ('00000000-0000-4000-8000-000000000005', 'Andriy Kovalenko', 'andriy.k@gmail.com', null, 'Ukraine', 'EET', array['React','Next.js','Rust','Redis'], array['Ukrainian','English','Russian'], 'senior', 7, 'Full Stack', null, null, 'freelance', 6000, 8500, 'USD', 'active', null, '2026-01-20T14:00:00Z', '2026-01-20T14:00:00Z'),
  ('00000000-0000-4000-8000-000000000006', 'Elena Garcia', 'elena.g@proton.me', null, 'Spain', 'CET', array['Angular','TypeScript','.NET','Azure'], array['Spanish','English','French'], 'lead', 10, 'Full Stack', null, null, 'full_time', 7000, 9500, 'EUR', 'reviewing', null, '2026-01-22T10:00:00Z', '2026-01-22T10:00:00Z'),
  ('00000000-0000-4000-8000-000000000007', 'Lucas Bianchi', 'lucas.b@gmail.com', null, 'Italy', 'CET', array['React Native','Swift','Kotlin','Firebase'], array['Italian','English'], 'mid', 3, 'Mobile', null, null, 'contract', 4000, 5500, 'EUR', 'active', null, '2026-01-25T09:00:00Z', '2026-01-25T09:00:00Z')
on conflict (id) do update set
  full_name = excluded.full_name, email = excluded.email, phone = excluded.phone,
  country = excluded.country, timezone = excluded.timezone, tech_stack = excluded.tech_stack,
  languages = excluded.languages, level = excluded.level, years_of_experience = excluded.years_of_experience,
  specialization = excluded.specialization, cv_url = excluded.cv_url, available_from = excluded.available_from,
  employment_type = excluded.employment_type, preferred_salary_min = excluded.preferred_salary_min,
  preferred_salary_max = excluded.preferred_salary_max, preferred_salary_currency = excluded.preferred_salary_currency,
  status = excluded.status, created_by = excluded.created_by;

insert into public.employers (
  id, company_name, industry, country, email, phone, website, contact_name,
  contact_email, contact_phone, employer_type, status, created_at, updated_at
) values
  ('10000000-0000-4000-8000-000000000001', 'Accenture', 'Consulting', 'USA', 'talent@accenture.com', '+1 312 693 0161', 'https://accenture.com', 'Patricia Walsh', 'p.walsh@accenture.com', '+1 312 693 0162', 'hiring_company', 'active', '2026-01-05T10:00:00Z', '2026-01-05T10:00:00Z'),
  ('10000000-0000-4000-8000-000000000002', 'SoftTk', 'Software Development', 'Mexico', 'hr@softtk.com', '+52 55 1234 5678', 'https://softtk.com', 'Jorge Mendez', 'j.mendez@softtk.com', null, 'hiring_company', 'active', '2026-01-08T10:00:00Z', '2026-01-08T10:00:00Z'),
  ('10000000-0000-4000-8000-000000000003', 'Neoirs', 'Fintech', 'Spain', 'people@neoirs.com', null, 'https://neoirs.com', 'Alejandro Ruiz', 'a.ruiz@neoirs.com', '+34 91 123 4567', 'hiring_company', 'active', '2026-01-10T10:00:00Z', '2026-01-10T10:00:00Z'),
  ('10000000-0000-4000-8000-000000000004', 'TechMilenio', 'IT Services', 'Mexico', 'rh@techmilenio.mx', '+52 81 9876 5432', null, 'Claudia Vega', 'c.vega@techmilenio.mx', null, 'both', 'prospect', '2026-01-15T10:00:00Z', '2026-01-15T10:00:00Z')
on conflict (id) do update set
  company_name = excluded.company_name, industry = excluded.industry, country = excluded.country,
  email = excluded.email, phone = excluded.phone, website = excluded.website,
  contact_name = excluded.contact_name, contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone, employer_type = excluded.employer_type, status = excluded.status;

insert into public.positions (
  id, employer_id, title, description, level, specialization, required_skills,
  languages_required, salary_min, salary_max, currency, work_location,
  contract_type, status, posted_date, deadline, created_at, updated_at
) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Senior React Developer', null, 'senior', 'Frontend', array['React','TypeScript','Redux'], array['English'], 5000, 7000, 'USD', 'remote', 'full_time', 'open', '2026-01-15', null, '2026-01-15T10:00:00Z', '2026-01-15T10:00:00Z'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Backend Engineer (Python)', null, 'mid', 'Backend', array['Python','Django','PostgreSQL'], array['Spanish','English'], 3000, 4500, 'USD', 'hybrid', 'full_time', 'open', '2026-01-20', null, '2026-01-20T10:00:00Z', '2026-01-20T10:00:00Z'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Full Stack Lead', null, 'lead', 'Full Stack', array['Node.js','React','AWS','TypeScript'], array['English','Spanish'], 6000, 9000, 'EUR', 'remote', 'full_time', 'open', '2026-01-22', null, '2026-01-22T10:00:00Z', '2026-01-22T10:00:00Z'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'Mobile Developer (React Native)', null, 'mid', 'Mobile', array['React Native','TypeScript','Firebase'], array['English'], 4000, 5500, 'USD', 'remote', 'contract', 'open', '2026-02-01', null, '2026-02-01T10:00:00Z', '2026-02-01T10:00:00Z'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'Java Backend Engineer', null, 'senior', 'Backend', array['Java','Spring Boot','Kubernetes'], array['English'], 5500, 7500, 'USD', 'remote', 'full_time', 'filled', '2025-12-01', null, '2025-12-01T10:00:00Z', '2026-02-10T10:00:00Z')
on conflict (id) do update set
  employer_id = excluded.employer_id, title = excluded.title, description = excluded.description,
  level = excluded.level, specialization = excluded.specialization, required_skills = excluded.required_skills,
  languages_required = excluded.languages_required, salary_min = excluded.salary_min, salary_max = excluded.salary_max,
  currency = excluded.currency, work_location = excluded.work_location, contract_type = excluded.contract_type,
  status = excluded.status, posted_date = excluded.posted_date, deadline = excluded.deadline;

insert into public.applications (
  id, talent_id, position_id, status, applied_at, interview_scheduled_at,
  notes, created_at, updated_at
) values
  ('30000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'interview_scheduled', '2026-01-16T10:00:00Z', '2026-01-28T15:00:00Z', 'Strong profile, great TypeScript skills', '2026-01-16T10:00:00Z', '2026-01-16T10:00:00Z'),
  ('30000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'offer_sent', '2026-01-21T09:00:00Z', null, 'Excellent Django experience', '2026-01-21T09:00:00Z', '2026-01-25T09:00:00Z'),
  ('30000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', 'screening', '2026-01-18T14:00:00Z', null, null, '2026-01-18T14:00:00Z', '2026-01-18T14:00:00Z'),
  ('30000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 'interview_done', '2026-01-23T10:00:00Z', '2026-01-30T10:00:00Z', 'Impressive leadership skills, awaiting client feedback', '2026-01-23T10:00:00Z', '2026-02-01T10:00:00Z'),
  ('30000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000004', 'applied', '2026-02-02T09:00:00Z', null, null, '2026-02-02T09:00:00Z', '2026-02-02T09:00:00Z'),
  ('30000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000005', 'accepted', '2025-12-05T10:00:00Z', null, 'Perfect match for Java backend role', '2025-12-05T10:00:00Z', '2026-01-15T10:00:00Z'),
  ('30000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000002', 'rejected', '2026-01-21T11:00:00Z', null, 'Client preferred a more backend-focused profile', '2026-01-21T11:00:00Z', '2026-01-27T11:00:00Z')
on conflict (id) do update set
  talent_id = excluded.talent_id, position_id = excluded.position_id, status = excluded.status,
  applied_at = excluded.applied_at, interview_scheduled_at = excluded.interview_scheduled_at,
  notes = excluded.notes;

insert into public.placements (
  id, talent_id, position_id, employer_id, application_id, start_date, end_date,
  final_salary, commission_percentage, commission_amount, status, notes,
  created_at, updated_at
) values
  ('40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000006', '2026-02-01', null, 6500, 15, 975, 'active', 'Smooth onboarding, client very satisfied', '2026-01-20T10:00:00Z', '2026-02-01T10:00:00Z'),
  ('40000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '2025-09-01', '2026-01-31', 4200, 15, 630, 'completed', 'Completed engagement from the Python backend pipeline', '2025-08-25T10:00:00Z', '2026-02-01T10:00:00Z')
on conflict (id) do update set
  talent_id = excluded.talent_id, position_id = excluded.position_id, employer_id = excluded.employer_id,
  application_id = excluded.application_id, start_date = excluded.start_date, end_date = excluded.end_date,
  final_salary = excluded.final_salary, commission_percentage = excluded.commission_percentage,
  commission_amount = excluded.commission_amount, status = excluded.status, notes = excluded.notes;
