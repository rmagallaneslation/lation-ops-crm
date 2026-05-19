import type {
  ProspectStatus,
  ClientStatus,
  CandidateStatus,
  InterviewStatus,
  Recommendation,
  InterviewType,
  SeniorityLevel,
} from '../../types'

type BadgeVariant =
  | 'slate'
  | 'blue'
  | 'sky'
  | 'indigo'
  | 'purple'
  | 'amber'
  | 'orange'
  | 'emerald'
  | 'red'
  | 'teal'

const variantClasses: Record<BadgeVariant, string> = {
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  purple: 'bg-purple-50 text-purple-700 ring-purple-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  orange: 'bg-orange-50 text-orange-700 ring-orange-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  teal: 'bg-teal-50 text-teal-700 ring-teal-200',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'slate', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const prospectStatusMap: Record<ProspectStatus, { label: string; variant: BadgeVariant }> = {
  new: { label: 'New', variant: 'slate' },
  contacted: { label: 'Contacted', variant: 'blue' },
  qualified: { label: 'Qualified', variant: 'sky' },
  proposal: { label: 'Proposal', variant: 'indigo' },
  negotiation: { label: 'Negotiation', variant: 'amber' },
  won: { label: 'Won', variant: 'emerald' },
  lost: { label: 'Lost', variant: 'red' },
}

export function ProspectStatusBadge({ status }: { status: ProspectStatus }) {
  const { label, variant } = prospectStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

const candidateStatusMap: Record<CandidateStatus, { label: string; variant: BadgeVariant }> = {
  screening: { label: 'Screening', variant: 'slate' },
  technical: { label: 'Technical', variant: 'blue' },
  'system-design': { label: 'System Design', variant: 'indigo' },
  final: { label: 'Final', variant: 'purple' },
  offer: { label: 'Offer', variant: 'amber' },
  hired: { label: 'Hired', variant: 'emerald' },
  rejected: { label: 'Rejected', variant: 'red' },
  withdrawn: { label: 'Withdrawn', variant: 'slate' },
}

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  const { label, variant } = candidateStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

const clientStatusMap: Record<ClientStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: 'Active', variant: 'emerald' },
  paused: { label: 'Paused', variant: 'amber' },
  churned: { label: 'Churned', variant: 'red' },
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const { label, variant } = clientStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

const interviewStatusMap: Record<InterviewStatus, { label: string; variant: BadgeVariant }> = {
  scheduled: { label: 'Scheduled', variant: 'blue' },
  completed: { label: 'Completed', variant: 'emerald' },
  cancelled: { label: 'Cancelled', variant: 'slate' },
  'no-show': { label: 'No Show', variant: 'red' },
}

export function InterviewStatusBadge({ status }: { status: InterviewStatus }) {
  const { label, variant } = interviewStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

const recommendationMap: Record<Recommendation, { label: string; variant: BadgeVariant }> = {
  'strong-hire': { label: 'Strong Hire', variant: 'emerald' },
  hire: { label: 'Hire', variant: 'teal' },
  'no-hire': { label: 'No Hire', variant: 'orange' },
  'strong-no-hire': { label: 'Strong No Hire', variant: 'red' },
}

export function RecommendationBadge({ rec }: { rec: Recommendation }) {
  const { label, variant } = recommendationMap[rec]
  return <Badge variant={variant}>{label}</Badge>
}

const interviewTypeMap: Record<InterviewType, { label: string; variant: BadgeVariant }> = {
  screening: { label: 'Screening', variant: 'slate' },
  technical: { label: 'Technical', variant: 'blue' },
  'system-design': { label: 'System Design', variant: 'indigo' },
  behavioral: { label: 'Behavioral', variant: 'purple' },
  final: { label: 'Final', variant: 'amber' },
}

export function InterviewTypeBadge({ type }: { type: InterviewType }) {
  const { label, variant } = interviewTypeMap[type]
  return <Badge variant={variant}>{label}</Badge>
}

const levelMap: Record<SeniorityLevel, { label: string; variant: BadgeVariant }> = {
  junior: { label: 'Junior', variant: 'slate' },
  mid: { label: 'Mid', variant: 'blue' },
  senior: { label: 'Senior', variant: 'indigo' },
  lead: { label: 'Lead', variant: 'purple' },
  principal: { label: 'Principal', variant: 'amber' },
}

export function LevelBadge({ level }: { level: SeniorityLevel }) {
  const { label, variant } = levelMap[level]
  return <Badge variant={variant}>{label}</Badge>
}
