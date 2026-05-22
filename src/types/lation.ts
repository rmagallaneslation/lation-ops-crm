export type TalentStatus = 'active' | 'placed' | 'unavailable' | 'reviewing'
export type TalentLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'architect'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance'

export type Talent = {
  id: string
  full_name: string
  email: string
  phone?: string
  country: string
  timezone?: string
  tech_stack: string[]
  languages: string[]
  level: TalentLevel
  years_of_experience: number
  specialization: string
  cv_url?: string
  available_from?: string
  employment_type: EmploymentType
  status: TalentStatus
  created_by?: string
  created_at: string
  updated_at: string
}

export type EmployerStatus = 'active' | 'inactive' | 'prospect'

export type Employer = {
  id: string
  company_name: string
  industry: string
  country: string
  email: string
  phone?: string
  website?: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  status: EmployerStatus
  created_at: string
  updated_at: string
}

export type PositionStatus = 'open' | 'paused' | 'closed' | 'filled'
export type WorkLocation = 'remote' | 'hybrid' | 'on_site'
export type ContractType = 'full_time' | 'part_time' | 'contract'

export type Position = {
  id: string
  employer_id: string
  title: string
  description?: string
  level: TalentLevel
  specialization: string
  required_skills: string[]
  languages_required: string[]
  salary_min?: number
  salary_max?: number
  currency: string
  work_location: WorkLocation
  contract_type: ContractType
  status: PositionStatus
  posted_date: string
  deadline?: string
  created_at: string
  updated_at: string
}

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview_scheduled'
  | 'interview_done'
  | 'offer_sent'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

export type Application = {
  id: string
  talent_id: string
  position_id: string
  status: ApplicationStatus
  applied_at: string
  interview_scheduled_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type PlacementStatus = 'active' | 'completed' | 'terminated'

export type Placement = {
  id: string
  talent_id: string
  position_id: string
  employer_id: string
  application_id: string
  start_date: string
  end_date?: string
  final_salary: number
  commission_percentage: number
  commission_amount: number
  status: PlacementStatus
  notes?: string
  created_at: string
  updated_at: string
}
