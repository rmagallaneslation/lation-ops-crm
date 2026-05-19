export type TeamMember = 'Roberto' | 'Reynaldo' | 'Santiago'

export type ProspectStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export interface Prospect {
  id: string
  companyName: string
  industry: string
  website?: string
  contactName: string
  contactTitle?: string
  contactEmail: string
  contactPhone?: string
  status: ProspectStatus
  estimatedValue?: number
  notes: string
  assignedTo: TeamMember
  createdAt: string
  updatedAt: string
}

export type ClientStatus = 'active' | 'paused' | 'churned'

export interface Client {
  id: string
  companyName: string
  industry: string
  contactName: string
  contactTitle?: string
  contactEmail: string
  contactPhone?: string
  status: ClientStatus
  startDate: string
  monthlyValue: number
  assignedTo: TeamMember
  notes: string
  createdAt: string
}

export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal'

export interface HiringRole {
  id: string
  clientId: string
  roleName: string
  technology: string[]
  level: SeniorityLevel
  openPositions: number
  filledPositions: number
  interviewStages: string[]
  scorecardId?: string
  createdAt: string
}

export type CandidateStatus =
  | 'screening'
  | 'technical'
  | 'system-design'
  | 'final'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn'

export interface Candidate {
  id: string
  clientId: string
  roleId: string
  name: string
  email: string
  phone?: string
  linkedIn?: string
  status: CandidateStatus
  notes: string
  appliedAt: string
  updatedAt: string
}

export type InterviewType =
  | 'screening'
  | 'technical'
  | 'system-design'
  | 'behavioral'
  | 'final'

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show'

export type Recommendation =
  | 'strong-hire'
  | 'hire'
  | 'no-hire'
  | 'strong-no-hire'

export interface Interview {
  id: string
  candidateId: string
  clientId: string
  roleId: string
  interviewerName: string
  scheduledAt: string
  duration: number
  type: InterviewType
  status: InterviewStatus
  recommendation?: Recommendation
  overallScore?: number
  notes?: string
  scorecardId?: string
}

export interface ScorecardCriteria {
  id: string
  label: string
  description?: string
  weight: number
}

export interface ScorecardSection {
  id: string
  title: string
  criteria: ScorecardCriteria[]
}

export interface Scorecard {
  id: string
  name: string
  role: string
  technology: string
  level: SeniorityLevel
  sections: ScorecardSection[]
  createdAt: string
}
