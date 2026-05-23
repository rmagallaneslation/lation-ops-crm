export type TalentStatus = 'prospect' | 'available' | 'in_process' | 'placed' | 'inactive'
export type TalentLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'architect'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance'

export type Talent = {
  id: string
  full_name: string
  email: string
  phone?: string | null
  country: string
  timezone?: string | null
  tech_stack: string[]
  languages: string[]
  level: TalentLevel
  years_of_experience: number
  specialization: string
  cv_url?: string | null
  linkedin_url?: string | null
  available_from?: string | null
  employment_type: EmploymentType
  preferred_salary_min?: number | null
  preferred_salary_max?: number | null
  preferred_salary_currency: string
  status: TalentStatus
  created_by?: string | null
  created_at: string
  updated_at: string
}

export type EmployerStatus = 'active' | 'inactive' | 'prospect'
export type EmployerType = 'talent_source' | 'hiring_company' | 'both'

export type Employer = {
  id: string
  company_name: string
  industry: string
  country: string
  email: string
  phone?: string | null
  website?: string | null
  contact_name: string
  contact_email: string
  contact_phone?: string | null
  employer_type: EmployerType
  status: EmployerStatus
  created_at: string
  updated_at: string
}

export type PositionStatus = 'open' | 'in_progress' | 'filled' | 'closed'
export type WorkLocation = 'remote' | 'hybrid' | 'on_site'
export type ContractType = 'full_time' | 'part_time' | 'contract'

export type Position = {
  id: string
  employer_id: string
  title: string
  description?: string | null
  level: TalentLevel
  specialization: string
  required_skills: string[]
  languages_required: string[]
  salary_min?: number | null
  salary_max?: number | null
  currency: string
  work_location: WorkLocation
  contract_type: ContractType
  status: PositionStatus
  posted_date: string
  deadline?: string | null
  created_at: string
  updated_at: string
}

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'reviewed'
  | 'offer_sent'
  | 'accepted'
  | 'rejected'

export type Application = {
  id: string
  talent_id: string
  position_id: string
  status: ApplicationStatus
  applied_at: string
  interview_scheduled_at?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export type PlacementStatus = 'placed' | 'completed' | 'extended'
export type CommissionType = 'percentage' | 'fixed_fee' | 'subscription' | 'hybrid'

export type Placement = {
  id: string
  talent_id: string
  position_id: string
  employer_id: string
  application_id?: string | null
  start_date: string
  end_date?: string | null
  final_salary: number
  commission_type: CommissionType
  commission_percentage: number
  commission_fixed_fee: number
  commission_amount: number
  currency: string
  status: PlacementStatus
  notes?: string | null
  created_at: string
  updated_at: string
}
