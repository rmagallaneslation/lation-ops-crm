import type { Talent, Employer, Position, Application, Placement } from '../types/lation'

export const mockTalents: Talent[] = [
  {
    id: 't1', full_name: 'Carlos Herrera', email: 'carlos.h@gmail.com', phone: '+52 81 1234 5678',
    country: 'Mexico', timezone: 'CST', tech_stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    languages: ['Spanish', 'English'], level: 'senior', years_of_experience: 6,
    specialization: 'Frontend', employment_type: 'full_time', preferred_salary_currency: 'USD', status: 'available',
    created_at: '2026-01-10T10:00:00Z', updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 't2', full_name: 'Valentina Rodríguez', email: 'vale.r@outlook.com',
    country: 'Colombia', timezone: 'COT', tech_stack: ['Python', 'Django', 'AWS', 'Docker'],
    languages: ['Spanish', 'English'], level: 'mid', years_of_experience: 3,
    specialization: 'Backend', employment_type: 'full_time', preferred_salary_currency: 'USD', status: 'available',
    created_at: '2026-01-12T09:00:00Z', updated_at: '2026-01-12T09:00:00Z',
  },
  {
    id: 't3', full_name: 'Mateus Oliveira', email: 'mateus.o@email.com',
    country: 'Brazil', timezone: 'BRT', tech_stack: ['Java', 'Spring Boot', 'Kubernetes', 'GCP'],
    languages: ['Portuguese', 'English'], level: 'senior', years_of_experience: 8,
    specialization: 'Backend', employment_type: 'contract', preferred_salary_currency: 'USD', status: 'placed',
    created_at: '2026-01-15T11:00:00Z', updated_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 't4', full_name: 'Sofía Martínez', email: 'sofia.m@mail.com',
    country: 'Argentina', timezone: 'ART', tech_stack: ['Vue.js', 'Nuxt', 'GraphQL', 'MongoDB'],
    languages: ['Spanish', 'English', 'Italian'], level: 'mid', years_of_experience: 4,
    specialization: 'Frontend', employment_type: 'full_time', preferred_salary_currency: 'USD', status: 'placed',
    created_at: '2026-01-18T08:00:00Z', updated_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 't5', full_name: 'Andriy Kovalenko', email: 'andriy.k@gmail.com',
    country: 'Ukraine', timezone: 'EET', tech_stack: ['React', 'Next.js', 'Rust', 'Redis'],
    languages: ['Ukrainian', 'English', 'Russian'], level: 'senior', years_of_experience: 7,
    specialization: 'Full Stack', employment_type: 'freelance', preferred_salary_currency: 'USD', status: 'available',
    created_at: '2026-01-20T14:00:00Z', updated_at: '2026-01-20T14:00:00Z',
  },
  {
    id: 't6', full_name: 'Elena García', email: 'elena.g@proton.me',
    country: 'Spain', timezone: 'CET', tech_stack: ['Angular', 'TypeScript', '.NET', 'Azure'],
    languages: ['Spanish', 'English', 'French'], level: 'lead', years_of_experience: 10,
    specialization: 'Full Stack', employment_type: 'full_time', preferred_salary_currency: 'USD', status: 'in_process',
    created_at: '2026-01-22T10:00:00Z', updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 't7', full_name: 'Lucas Bianchi', email: 'lucas.b@gmail.com',
    country: 'Italy', timezone: 'CET', tech_stack: ['React Native', 'Swift', 'Kotlin', 'Firebase'],
    languages: ['Italian', 'English'], level: 'mid', years_of_experience: 3,
    specialization: 'Mobile', employment_type: 'contract', preferred_salary_currency: 'USD', status: 'available',
    created_at: '2026-01-25T09:00:00Z', updated_at: '2026-01-25T09:00:00Z',
  },
]

export const mockEmployers: Employer[] = [
  {
    id: 'e1', company_name: 'Accenture', industry: 'Consulting', country: 'USA',
    email: 'talent@accenture.com', phone: '+1 312 693 0161', website: 'https://accenture.com',
    contact_name: 'Patricia Walsh', contact_email: 'p.walsh@accenture.com',
    contact_phone: '+1 312 693 0162', employer_type: 'hiring_company', status: 'active',
    created_at: '2026-01-05T10:00:00Z', updated_at: '2026-01-05T10:00:00Z',
  },
  {
    id: 'e2', company_name: 'SoftTk', industry: 'Software Development', country: 'Mexico',
    email: 'hr@softtk.com', phone: '+52 55 1234 5678', website: 'https://softtk.com',
    contact_name: 'Jorge Mendez', contact_email: 'j.mendez@softtk.com', employer_type: 'hiring_company', status: 'active',
    created_at: '2026-01-08T10:00:00Z', updated_at: '2026-01-08T10:00:00Z',
  },
  {
    id: 'e3', company_name: 'Neoirs', industry: 'Fintech', country: 'Spain',
    email: 'people@neoirs.com', website: 'https://neoirs.com',
    contact_name: 'Alejandro Ruiz', contact_email: 'a.ruiz@neoirs.com',
    contact_phone: '+34 91 123 4567', employer_type: 'hiring_company', status: 'active',
    created_at: '2026-01-10T10:00:00Z', updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'e4', company_name: 'TechMilenio', industry: 'IT Services', country: 'Mexico',
    email: 'rh@techmilenio.mx', phone: '+52 81 9876 5432',
    contact_name: 'Claudia Vega', contact_email: 'c.vega@techmilenio.mx', employer_type: 'hiring_company', status: 'prospect',
    created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z',
  },
]

export const mockPositions: Position[] = [
  {
    id: 'p1', employer_id: 'e1', title: 'Senior React Developer', level: 'senior',
    specialization: 'Frontend', required_skills: ['React', 'TypeScript', 'Redux'],
    languages_required: ['English'], salary_min: 5000, salary_max: 7000, currency: 'USD',
    work_location: 'remote', contract_type: 'full_time', status: 'open',
    posted_date: '2026-01-15', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'p2', employer_id: 'e2', title: 'Backend Engineer (Python)', level: 'mid',
    specialization: 'Backend', required_skills: ['Python', 'Django', 'PostgreSQL'],
    languages_required: ['Spanish', 'English'], salary_min: 3000, salary_max: 4500, currency: 'USD',
    work_location: 'hybrid', contract_type: 'full_time', status: 'open',
    posted_date: '2026-01-20', created_at: '2026-01-20T10:00:00Z', updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: 'p3', employer_id: 'e3', title: 'Full Stack Lead', level: 'lead',
    specialization: 'Full Stack', required_skills: ['Node.js', 'React', 'AWS', 'TypeScript'],
    languages_required: ['English', 'Spanish'], salary_min: 6000, salary_max: 9000, currency: 'EUR',
    work_location: 'remote', contract_type: 'full_time', status: 'open',
    posted_date: '2026-01-22', created_at: '2026-01-22T10:00:00Z', updated_at: '2026-01-22T10:00:00Z',
  },
  {
    id: 'p4', employer_id: 'e1', title: 'Mobile Developer (React Native)', level: 'mid',
    specialization: 'Mobile', required_skills: ['React Native', 'TypeScript', 'Firebase'],
    languages_required: ['English'], salary_min: 4000, salary_max: 5500, currency: 'USD',
    work_location: 'remote', contract_type: 'contract', status: 'open',
    posted_date: '2026-02-01', created_at: '2026-02-01T10:00:00Z', updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'p5', employer_id: 'e2', title: 'Java Backend Engineer', level: 'senior',
    specialization: 'Backend', required_skills: ['Java', 'Spring Boot', 'Kubernetes'],
    languages_required: ['English'], salary_min: 5500, salary_max: 7500, currency: 'USD',
    work_location: 'remote', contract_type: 'full_time', status: 'filled',
    posted_date: '2025-12-01', created_at: '2025-12-01T10:00:00Z', updated_at: '2026-02-10T10:00:00Z',
  },
]

export const mockApplications: Application[] = [
  {
    id: 'a1', talent_id: 't1', position_id: 'p1', status: 'interview',
    applied_at: '2026-01-16T10:00:00Z', interview_scheduled_at: '2026-01-28T15:00:00Z',
    notes: 'Strong profile, great TypeScript skills',
    created_at: '2026-01-16T10:00:00Z', updated_at: '2026-01-16T10:00:00Z',
  },
  {
    id: 'a2', talent_id: 't2', position_id: 'p2', status: 'offer_sent',
    applied_at: '2026-01-21T09:00:00Z', notes: 'Excellent Django experience',
    created_at: '2026-01-21T09:00:00Z', updated_at: '2026-01-25T09:00:00Z',
  },
  {
    id: 'a3', talent_id: 't5', position_id: 'p1', status: 'screening',
    applied_at: '2026-01-18T14:00:00Z',
    created_at: '2026-01-18T14:00:00Z', updated_at: '2026-01-18T14:00:00Z',
  },
  {
    id: 'a4', talent_id: 't6', position_id: 'p3', status: 'reviewed',
    applied_at: '2026-01-23T10:00:00Z', interview_scheduled_at: '2026-01-30T10:00:00Z',
    notes: 'Impressive leadership skills, awaiting client feedback',
    created_at: '2026-01-23T10:00:00Z', updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'a5', talent_id: 't7', position_id: 'p4', status: 'applied',
    applied_at: '2026-02-02T09:00:00Z',
    created_at: '2026-02-02T09:00:00Z', updated_at: '2026-02-02T09:00:00Z',
  },
  {
    id: 'a6', talent_id: 't3', position_id: 'p5', status: 'accepted',
    applied_at: '2025-12-05T10:00:00Z', notes: 'Perfect match for Java backend role',
    created_at: '2025-12-05T10:00:00Z', updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'a7', talent_id: 't4', position_id: 'p2', status: 'rejected',
    applied_at: '2026-01-21T11:00:00Z', notes: 'Client preferred a more backend-focused profile',
    created_at: '2026-01-21T11:00:00Z', updated_at: '2026-01-27T11:00:00Z',
  },
]

export const mockPlacements: Placement[] = [
  {
    id: 'pl1', talent_id: 't3', position_id: 'p5', employer_id: 'e2', application_id: 'a6',
    start_date: '2026-02-01', final_salary: 6500,
    commission_type: 'percentage', commission_percentage: 15, commission_fixed_fee: 0,
    commission_amount: 975, currency: 'USD', status: 'placed',
    notes: 'Smooth onboarding, client very satisfied',
    created_at: '2026-01-20T10:00:00Z', updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'pl2', talent_id: 't4', position_id: 'p5', employer_id: 'e1', application_id: 'a2',
    start_date: '2025-09-01', end_date: '2026-01-31', final_salary: 4200,
    commission_type: 'percentage', commission_percentage: 15, commission_fixed_fee: 0,
    commission_amount: 630, currency: 'USD', status: 'completed',
    created_at: '2025-08-25T10:00:00Z', updated_at: '2026-02-01T10:00:00Z',
  },
]
