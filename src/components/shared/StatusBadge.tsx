import { Badge } from '../ui/badge'
import {
  COMPANY_STATUS_LABELS,
  COMPANY_STATUS_COLORS,
  CANDIDATE_STATUS_LABELS,
  CANDIDATE_STATUS_COLORS,
  INTERVIEW_STATUS_LABELS,
  INTERVIEW_STATUS_COLORS,
  HIRING_NEED_STATUS_LABELS,
  HIRING_NEED_STATUS_COLORS,
  RECOMMENDATION_LABELS,
  RECOMMENDATION_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  INTERVIEW_TYPE_LABELS,
  ACTIVITY_TYPE_LABELS,
} from '../../lib/status'
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
} from '../../types'

export const CompanyStatusBadge = ({ status }: { status: CompanyStatus }) => (
  <Badge label={COMPANY_STATUS_LABELS[status]} className={COMPANY_STATUS_COLORS[status]} />
)

export const CandidateStatusBadge = ({ status }: { status: CandidateStatus }) => (
  <Badge label={CANDIDATE_STATUS_LABELS[status]} className={CANDIDATE_STATUS_COLORS[status]} />
)

export const InterviewStatusBadge = ({ status }: { status: InterviewStatus }) => (
  <Badge label={INTERVIEW_STATUS_LABELS[status]} className={INTERVIEW_STATUS_COLORS[status]} />
)

export const HiringNeedStatusBadge = ({ status }: { status: HiringNeedStatus }) => (
  <Badge label={HIRING_NEED_STATUS_LABELS[status]} className={HIRING_NEED_STATUS_COLORS[status]} />
)

export const RecommendationBadge = ({ rec }: { rec: FinalRecommendation }) => (
  <Badge label={RECOMMENDATION_LABELS[rec]} className={RECOMMENDATION_COLORS[rec]} />
)

export const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <Badge label={PRIORITY_LABELS[priority]} className={PRIORITY_COLORS[priority]} />
)

export const UrgencyBadge = ({ urgency }: { urgency: Urgency }) => (
  <Badge label={URGENCY_LABELS[urgency]} className={URGENCY_COLORS[urgency]} />
)

export const InterviewTypeBadge = ({ type }: { type: InterviewType }) => (
  <Badge label={INTERVIEW_TYPE_LABELS[type]} className="bg-slate-100 text-slate-700" />
)

export const ActivityTypeBadge = ({ type }: { type: ActivityType }) => (
  <Badge label={ACTIVITY_TYPE_LABELS[type]} className="bg-slate-100 text-slate-700" />
)
