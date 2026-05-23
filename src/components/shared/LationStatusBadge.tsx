import type { TalentStatus, EmployerStatus, ApplicationStatus, PlacementStatus } from '../../types/lation'

export function TalentStatusBadge({ status }: { status: TalentStatus }) {
  const map: Record<TalentStatus, { color: string; label: string }> = {
    prospect:   { color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', label: 'Prospecto' },
    available:  { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Disponible' },
    in_process: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'En Proceso' },
    placed:     { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Colocado' },
    inactive:   { color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', label: 'Inactivo' },
  }
  const { color, label } = map[status] ?? map.inactive
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{label}</span>
}

export function EmployerStatusBadge({ status }: { status: EmployerStatus }) {
  const map: Record<EmployerStatus, { color: string; label: string }> = {
    active:   { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Activo' },
    inactive: { color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', label: 'Inactivo' },
    prospect: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', label: 'Prospecto' },
  }
  const { color, label } = map[status] ?? map.inactive
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{label}</span>
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const map: Record<ApplicationStatus, { color: string; label: string }> = {
    applied:    { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Applied' },
    screening:  { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Screening' },
    interview:  { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400', label: 'Interview' },
    reviewed:   { color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', label: 'Reviewed' },
    offer_sent: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Offer Sent' },
    accepted:   { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Accepted' },
    rejected:   { color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected' },
  }
  const { color, label } = map[status] ?? map.reviewed
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{label}</span>
}

export function PlacementStatusBadge({ status }: { status: PlacementStatus }) {
  const map: Record<PlacementStatus, { color: string; label: string }> = {
    placed:    { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Placed' },
    completed: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Completed' },
    extended:  { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400', label: 'Extended' },
  }
  const { color, label } = map[status] ?? map.placed
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{label}</span>
}
