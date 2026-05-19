export type TeamMember = 'Roberto' | 'Reynaldo' | 'Santiago'

export type CompanyStatus =
  | 'new_lead'
  | 'researching'
  | 'contacted'
  | 'responded'
  | 'discovery_scheduled'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'
  | 'nurturing'

export type Priority = 'high' | 'medium' | 'low'

export type Company = {
  id: string
  name: string
  industry: string
  website?: string
  linkedin?: string
  country: string
  city?: string
  companySize?: string
  status: CompanyStatus
  priority: Priority
  contactName?: string
  contactRole?: string
  contactEmail?: string
  contactPhone?: string
  source?: string
  painPoints?: string
  hiringNeeds?: string
  estimatedDealValue?: number
  closeProbability?: number
  notes?: string
  nextFollowUpDate?: string
  owner: TeamMember
  createdAt: string
  updatedAt: string
}

export type Seniority = 'junior' | 'mid' | 'senior' | 'lead' | 'architect'
export type EnglishLevel = 'basic' | 'intermediate' | 'advanced' | 'fluent'
export type Urgency = 'low' | 'medium' | 'high' | 'critical'
export type HiringNeedStatus = 'draft' | 'active' | 'paused' | 'closed'

export type HiringNeed = {
  id: string
  companyId: string
  roleTitle: string
  seniority: Seniority
  stack: string[]
  englishLevel?: EnglishLevel
  urgency: Urgency
  candidateVolume?: number
  jobDescription?: string
  mustHaveSkills: string[]
  niceToHaveSkills: string[]
  dealBreakers?: string[]
  status: HiringNeedStatus
  createdAt: string
  updatedAt: string
}

export type CandidateStatus =
  | 'received'
  | 'pending_review'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'recommended'
  | 'not_recommended'
  | 'on_hold'
  | 'sent_to_client'

export type Candidate = {
  id: string
  companyId: string
  hiringNeedId: string
  name: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  location?: string
  englishLevel?: EnglishLevel
  seniority?: Seniority
  mainStack: string[]
  status: CandidateStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type Interviewer = TeamMember | 'External'
export type InterviewType =
  | 'technical_screening'
  | 'live_coding'
  | 'system_design'
  | 'qa_evaluation'
  | 'salesforce_evaluation'
  | 'english_technical'

export type InterviewStatus =
  | 'to_schedule'
  | 'scheduled'
  | 'completed'
  | 'no_show'
  | 'cancelled'
  | 'pending_scorecard'
  | 'scorecard_completed'
  | 'report_sent'

export type Interview = {
  id: string
  companyId: string
  candidateId: string
  hiringNeedId: string
  interviewer: Interviewer
  interviewType: InterviewType
  scheduledAt?: string
  meetingLink?: string
  status: InterviewStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type RoleType =
  | 'general'
  | 'frontend'
  | 'backend'
  | 'qa_manual'
  | 'qa_automation'
  | 'salesforce'
  | 'devops'
  | 'data'
  | 'tech_lead'

export type FinalRecommendation =
  | 'strong_hire'
  | 'hire'
  | 'consider'
  | 'weak_consider'
  | 'no_hire'

export type ScorecardStatus = 'draft' | 'completed' | 'approved'

export type Scorecard = {
  id: string
  interviewId: string
  candidateId: string
  companyId: string
  roleType: RoleType
  technicalKnowledge: number
  problemSolving: number
  communication: number
  seniorityAlignment: number
  roleFit: number
  clientReadiness: number
  strengths: string
  concerns: string
  finalRecommendation: FinalRecommendation
  summary: string
  status: ScorecardStatus
  createdAt: string
  updatedAt: string
}

export type ActivityType =
  | 'call'
  | 'email'
  | 'linkedin'
  | 'whatsapp'
  | 'meeting'
  | 'proposal'
  | 'note'
  | 'follow_up'

export type Activity = {
  id: string
  companyId: string
  type: ActivityType
  owner: TeamMember
  date: string
  summary: string
  nextStep?: string
  createdAt: string
}
