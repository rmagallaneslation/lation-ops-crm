import type {
  CompanyStatus,
  CandidateStatus,
  InterviewStatus,
  HiringNeedStatus,
  FinalRecommendation,
  Priority,
  Urgency,
  InterviewType,
  ActivityType,
} from '../types'

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  new_lead: 'New Lead',
  researching: 'Researching',
  contacted: 'Contacted',
  responded: 'Responded',
  discovery_scheduled: 'Discovery Scheduled',
  proposal_sent: 'Proposal Sent',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
  nurturing: 'Nurturing',
}

export const COMPANY_STATUS_COLORS: Record<CompanyStatus, string> = {
  new_lead: 'bg-slate-100 text-slate-700',
  researching: 'bg-blue-100 text-blue-700',
  contacted: 'bg-violet-100 text-violet-700',
  responded: 'bg-cyan-100 text-cyan-700',
  discovery_scheduled: 'bg-indigo-100 text-indigo-700',
  proposal_sent: 'bg-amber-100 text-amber-700',
  negotiation: 'bg-orange-100 text-orange-700',
  closed_won: 'bg-emerald-100 text-emerald-700',
  closed_lost: 'bg-red-100 text-red-700',
  nurturing: 'bg-pink-100 text-pink-700',
}

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  received: 'Received',
  pending_review: 'Pending Review',
  interview_scheduled: 'Interview Scheduled',
  interview_completed: 'Interview Completed',
  recommended: 'Recommended',
  not_recommended: 'Not Recommended',
  on_hold: 'On Hold',
  sent_to_client: 'Sent to Client',
}

export const CANDIDATE_STATUS_COLORS: Record<CandidateStatus, string> = {
  received: 'bg-slate-100 text-slate-700',
  pending_review: 'bg-amber-100 text-amber-700',
  interview_scheduled: 'bg-blue-100 text-blue-700',
  interview_completed: 'bg-indigo-100 text-indigo-700',
  recommended: 'bg-emerald-100 text-emerald-700',
  not_recommended: 'bg-red-100 text-red-700',
  on_hold: 'bg-orange-100 text-orange-700',
  sent_to_client: 'bg-violet-100 text-violet-700',
}

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  to_schedule: 'To Schedule',
  scheduled: 'Scheduled',
  completed: 'Completed',
  no_show: 'No Show',
  cancelled: 'Cancelled',
  pending_scorecard: 'Pending Scorecard',
  scorecard_completed: 'Scorecard Completed',
  report_sent: 'Report Sent',
}

export const INTERVIEW_STATUS_COLORS: Record<InterviewStatus, string> = {
  to_schedule: 'bg-slate-100 text-slate-700',
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  no_show: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  pending_scorecard: 'bg-amber-100 text-amber-700',
  scorecard_completed: 'bg-indigo-100 text-indigo-700',
  report_sent: 'bg-violet-100 text-violet-700',
}

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  technical_screening: 'Technical Screening',
  live_coding: 'Live Coding',
  system_design: 'System Design',
  qa_evaluation: 'QA Evaluation',
  salesforce_evaluation: 'Salesforce Evaluation',
  english_technical: 'English / Technical',
}

export const HIRING_NEED_STATUS_LABELS: Record<HiringNeedStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  closed: 'Closed',
}

export const HIRING_NEED_STATUS_COLORS: Record<HiringNeedStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  closed: 'bg-red-100 text-red-700',
}

export const RECOMMENDATION_LABELS: Record<FinalRecommendation, string> = {
  strong_hire: 'Strong Hire',
  hire: 'Hire',
  consider: 'Consider',
  weak_consider: 'Weak Consider',
  no_hire: 'No Hire',
}

export const RECOMMENDATION_COLORS: Record<FinalRecommendation, string> = {
  strong_hire: 'bg-emerald-100 text-emerald-800',
  hire: 'bg-green-100 text-green-800',
  consider: 'bg-amber-100 text-amber-800',
  weak_consider: 'bg-orange-100 text-orange-800',
  no_hire: 'bg-red-100 text-red-800',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
}

export const URGENCY_LABELS: Record<Urgency, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const URGENCY_COLORS: Record<Urgency, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: 'Call',
  email: 'Email',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  meeting: 'Meeting',
  proposal: 'Proposal',
  note: 'Note',
  follow_up: 'Follow-up',
}

export const PIPELINE_STAGES: CompanyStatus[] = [
  'new_lead',
  'researching',
  'contacted',
  'responded',
  'discovery_scheduled',
  'proposal_sent',
  'negotiation',
  'closed_won',
  'closed_lost',
]
