import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=')
      return [line.slice(0, index), line.slice(index + 1)]
    })
)

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

const talents = [
  { id: '00000000-0000-4000-8000-000000000001', full_name: 'Carlos Herrera', email: 'carlos.h@gmail.com', phone: '+52 81 1234 5678', country: 'Mexico', timezone: 'CST', tech_stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], languages: ['Spanish', 'English'], level: 'senior', years_of_experience: 6, specialization: 'Frontend', employment_type: 'full_time', preferred_salary_min: 5000, preferred_salary_max: 7000, preferred_salary_currency: 'USD', status: 'active', created_at: '2026-01-10T10:00:00Z', updated_at: '2026-01-10T10:00:00Z' },
  { id: '00000000-0000-4000-8000-000000000002', full_name: 'Valentina Rodriguez', email: 'vale.r@outlook.com', country: 'Colombia', timezone: 'COT', tech_stack: ['Python', 'Django', 'AWS', 'Docker'], languages: ['Spanish', 'English'], level: 'mid', years_of_experience: 3, specialization: 'Backend', employment_type: 'full_time', preferred_salary_min: 3000, preferred_salary_max: 4500, preferred_salary_currency: 'USD', status: 'active', created_at: '2026-01-12T09:00:00Z', updated_at: '2026-01-12T09:00:00Z' },
  { id: '00000000-0000-4000-8000-000000000003', full_name: 'Mateus Oliveira', email: 'mateus.o@email.com', country: 'Brazil', timezone: 'BRT', tech_stack: ['Java', 'Spring Boot', 'Kubernetes', 'GCP'], languages: ['Portuguese', 'English'], level: 'senior', years_of_experience: 8, specialization: 'Backend', employment_type: 'contract', preferred_salary_min: 5500, preferred_salary_max: 7500, preferred_salary_currency: 'USD', status: 'active', created_at: '2026-01-15T11:00:00Z', updated_at: '2026-01-15T11:00:00Z' },
  { id: '00000000-0000-4000-8000-000000000004', full_name: 'Sofia Martinez', email: 'sofia.m@mail.com', country: 'Argentina', timezone: 'ART', tech_stack: ['Vue.js', 'Nuxt', 'GraphQL', 'MongoDB'], languages: ['Spanish', 'English', 'Italian'], level: 'mid', years_of_experience: 4, specialization: 'Frontend', employment_type: 'full_time', preferred_salary_min: 4000, preferred_salary_max: 5500, preferred_salary_currency: 'USD', status: 'placed', created_at: '2026-01-18T08:00:00Z', updated_at: '2026-02-01T08:00:00Z' },
  { id: '00000000-0000-4000-8000-000000000005', full_name: 'Andriy Kovalenko', email: 'andriy.k@gmail.com', country: 'Ukraine', timezone: 'EET', tech_stack: ['React', 'Next.js', 'Rust', 'Redis'], languages: ['Ukrainian', 'English', 'Russian'], level: 'senior', years_of_experience: 7, specialization: 'Full Stack', employment_type: 'freelance', preferred_salary_min: 6000, preferred_salary_max: 8500, preferred_salary_currency: 'USD', status: 'active', created_at: '2026-01-20T14:00:00Z', updated_at: '2026-01-20T14:00:00Z' },
  { id: '00000000-0000-4000-8000-000000000006', full_name: 'Elena Garcia', email: 'elena.g@proton.me', country: 'Spain', timezone: 'CET', tech_stack: ['Angular', 'TypeScript', '.NET', 'Azure'], languages: ['Spanish', 'English', 'French'], level: 'lead', years_of_experience: 10, specialization: 'Full Stack', employment_type: 'full_time', preferred_salary_min: 7000, preferred_salary_max: 9500, preferred_salary_currency: 'EUR', status: 'reviewing', created_at: '2026-01-22T10:00:00Z', updated_at: '2026-01-22T10:00:00Z' },
  { id: '00000000-0000-4000-8000-000000000007', full_name: 'Lucas Bianchi', email: 'lucas.b@gmail.com', country: 'Italy', timezone: 'CET', tech_stack: ['React Native', 'Swift', 'Kotlin', 'Firebase'], languages: ['Italian', 'English'], level: 'mid', years_of_experience: 3, specialization: 'Mobile', employment_type: 'contract', preferred_salary_min: 4000, preferred_salary_max: 5500, preferred_salary_currency: 'EUR', status: 'active', created_at: '2026-01-25T09:00:00Z', updated_at: '2026-01-25T09:00:00Z' },
]

const employers = [
  { id: '10000000-0000-4000-8000-000000000001', company_name: 'Accenture', industry: 'Consulting', country: 'USA', email: 'talent@accenture.com', phone: '+1 312 693 0161', website: 'https://accenture.com', contact_name: 'Patricia Walsh', contact_email: 'p.walsh@accenture.com', contact_phone: '+1 312 693 0162', employer_type: 'hiring_company', status: 'active', created_at: '2026-01-05T10:00:00Z', updated_at: '2026-01-05T10:00:00Z' },
  { id: '10000000-0000-4000-8000-000000000002', company_name: 'SoftTk', industry: 'Software Development', country: 'Mexico', email: 'hr@softtk.com', phone: '+52 55 1234 5678', website: 'https://softtk.com', contact_name: 'Jorge Mendez', contact_email: 'j.mendez@softtk.com', employer_type: 'hiring_company', status: 'active', created_at: '2026-01-08T10:00:00Z', updated_at: '2026-01-08T10:00:00Z' },
  { id: '10000000-0000-4000-8000-000000000003', company_name: 'Neoirs', industry: 'Fintech', country: 'Spain', email: 'people@neoirs.com', website: 'https://neoirs.com', contact_name: 'Alejandro Ruiz', contact_email: 'a.ruiz@neoirs.com', contact_phone: '+34 91 123 4567', employer_type: 'hiring_company', status: 'active', created_at: '2026-01-10T10:00:00Z', updated_at: '2026-01-10T10:00:00Z' },
  { id: '10000000-0000-4000-8000-000000000004', company_name: 'TechMilenio', industry: 'IT Services', country: 'Mexico', email: 'rh@techmilenio.mx', phone: '+52 81 9876 5432', contact_name: 'Claudia Vega', contact_email: 'c.vega@techmilenio.mx', employer_type: 'both', status: 'prospect', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z' },
]

const positions = [
  { id: '20000000-0000-4000-8000-000000000001', employer_id: '10000000-0000-4000-8000-000000000001', title: 'Senior React Developer', level: 'senior', specialization: 'Frontend', required_skills: ['React', 'TypeScript', 'Redux'], languages_required: ['English'], salary_min: 5000, salary_max: 7000, currency: 'USD', work_location: 'remote', contract_type: 'full_time', status: 'open', posted_date: '2026-01-15', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z' },
  { id: '20000000-0000-4000-8000-000000000002', employer_id: '10000000-0000-4000-8000-000000000002', title: 'Backend Engineer (Python)', level: 'mid', specialization: 'Backend', required_skills: ['Python', 'Django', 'PostgreSQL'], languages_required: ['Spanish', 'English'], salary_min: 3000, salary_max: 4500, currency: 'USD', work_location: 'hybrid', contract_type: 'full_time', status: 'open', posted_date: '2026-01-20', created_at: '2026-01-20T10:00:00Z', updated_at: '2026-01-20T10:00:00Z' },
  { id: '20000000-0000-4000-8000-000000000003', employer_id: '10000000-0000-4000-8000-000000000003', title: 'Full Stack Lead', level: 'lead', specialization: 'Full Stack', required_skills: ['Node.js', 'React', 'AWS', 'TypeScript'], languages_required: ['English', 'Spanish'], salary_min: 6000, salary_max: 9000, currency: 'EUR', work_location: 'remote', contract_type: 'full_time', status: 'open', posted_date: '2026-01-22', created_at: '2026-01-22T10:00:00Z', updated_at: '2026-01-22T10:00:00Z' },
  { id: '20000000-0000-4000-8000-000000000004', employer_id: '10000000-0000-4000-8000-000000000001', title: 'Mobile Developer (React Native)', level: 'mid', specialization: 'Mobile', required_skills: ['React Native', 'TypeScript', 'Firebase'], languages_required: ['English'], salary_min: 4000, salary_max: 5500, currency: 'USD', work_location: 'remote', contract_type: 'contract', status: 'open', posted_date: '2026-02-01', created_at: '2026-02-01T10:00:00Z', updated_at: '2026-02-01T10:00:00Z' },
  { id: '20000000-0000-4000-8000-000000000005', employer_id: '10000000-0000-4000-8000-000000000002', title: 'Java Backend Engineer', level: 'senior', specialization: 'Backend', required_skills: ['Java', 'Spring Boot', 'Kubernetes'], languages_required: ['English'], salary_min: 5500, salary_max: 7500, currency: 'USD', work_location: 'remote', contract_type: 'full_time', status: 'filled', posted_date: '2025-12-01', created_at: '2025-12-01T10:00:00Z', updated_at: '2026-02-10T10:00:00Z' },
]

const applications = [
  { id: '30000000-0000-4000-8000-000000000001', talent_id: '00000000-0000-4000-8000-000000000001', position_id: '20000000-0000-4000-8000-000000000001', status: 'interview_scheduled', applied_at: '2026-01-16T10:00:00Z', interview_scheduled_at: '2026-01-28T15:00:00Z', notes: 'Strong profile, great TypeScript skills', created_at: '2026-01-16T10:00:00Z', updated_at: '2026-01-16T10:00:00Z' },
  { id: '30000000-0000-4000-8000-000000000002', talent_id: '00000000-0000-4000-8000-000000000002', position_id: '20000000-0000-4000-8000-000000000002', status: 'offer_sent', applied_at: '2026-01-21T09:00:00Z', notes: 'Excellent Django experience', created_at: '2026-01-21T09:00:00Z', updated_at: '2026-01-25T09:00:00Z' },
  { id: '30000000-0000-4000-8000-000000000003', talent_id: '00000000-0000-4000-8000-000000000005', position_id: '20000000-0000-4000-8000-000000000001', status: 'screening', applied_at: '2026-01-18T14:00:00Z', created_at: '2026-01-18T14:00:00Z', updated_at: '2026-01-18T14:00:00Z' },
  { id: '30000000-0000-4000-8000-000000000004', talent_id: '00000000-0000-4000-8000-000000000006', position_id: '20000000-0000-4000-8000-000000000003', status: 'interview_done', applied_at: '2026-01-23T10:00:00Z', interview_scheduled_at: '2026-01-30T10:00:00Z', notes: 'Impressive leadership skills, awaiting client feedback', created_at: '2026-01-23T10:00:00Z', updated_at: '2026-02-01T10:00:00Z' },
  { id: '30000000-0000-4000-8000-000000000005', talent_id: '00000000-0000-4000-8000-000000000007', position_id: '20000000-0000-4000-8000-000000000004', status: 'applied', applied_at: '2026-02-02T09:00:00Z', created_at: '2026-02-02T09:00:00Z', updated_at: '2026-02-02T09:00:00Z' },
  { id: '30000000-0000-4000-8000-000000000006', talent_id: '00000000-0000-4000-8000-000000000003', position_id: '20000000-0000-4000-8000-000000000005', status: 'accepted', applied_at: '2025-12-05T10:00:00Z', notes: 'Perfect match for Java backend role', created_at: '2025-12-05T10:00:00Z', updated_at: '2026-01-15T10:00:00Z' },
  { id: '30000000-0000-4000-8000-000000000007', talent_id: '00000000-0000-4000-8000-000000000004', position_id: '20000000-0000-4000-8000-000000000002', status: 'rejected', applied_at: '2026-01-21T11:00:00Z', notes: 'Client preferred a more backend-focused profile', created_at: '2026-01-21T11:00:00Z', updated_at: '2026-01-27T11:00:00Z' },
]

const placements = [
  { id: '40000000-0000-4000-8000-000000000001', talent_id: '00000000-0000-4000-8000-000000000003', position_id: '20000000-0000-4000-8000-000000000005', employer_id: '10000000-0000-4000-8000-000000000002', application_id: '30000000-0000-4000-8000-000000000006', start_date: '2026-02-01', final_salary: 6500, commission_percentage: 15, commission_amount: 975, status: 'active', notes: 'Smooth onboarding, client very satisfied', created_at: '2026-01-20T10:00:00Z', updated_at: '2026-02-01T10:00:00Z' },
  { id: '40000000-0000-4000-8000-000000000002', talent_id: '00000000-0000-4000-8000-000000000002', position_id: '20000000-0000-4000-8000-000000000002', employer_id: '10000000-0000-4000-8000-000000000002', application_id: '30000000-0000-4000-8000-000000000002', start_date: '2025-09-01', end_date: '2026-01-31', final_salary: 4200, commission_percentage: 15, commission_amount: 630, status: 'completed', notes: 'Completed engagement from the Python backend pipeline', created_at: '2025-08-25T10:00:00Z', updated_at: '2026-02-01T10:00:00Z' },
]

async function upsert(table, rows) {
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const normalizedRows = rows.map((row) => Object.fromEntries(keys.map((key) => [key, row[key] ?? null])))

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(normalizedRows),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${table}: ${response.status} ${body}`)
  }

  console.log(`${table}: ${rows.length} rows seeded`)
}

await upsert('talents', talents)
await upsert('employers', employers)
await upsert('positions', positions)
await upsert('applications', applications)
await upsert('placements', placements)
