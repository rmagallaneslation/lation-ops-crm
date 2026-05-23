import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, Linkedin } from 'lucide-react'
import { useLationStore } from '../../store/useLationStore'
import { getInitials, colorHash } from '../../lib/utils'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

const STATUS_STYLES: Record<string, string> = {
  prospect:   'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  available:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  in_process: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  placed:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  inactive:   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

const APP_STATUS_COLORS: Record<string, string> = {
  applied:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  screening:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  interview:  'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  reviewed:   'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  offer_sent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  accepted:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected:   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
      <span className="text-xs text-slate-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-slate-900 dark:text-slate-100 font-medium">{value}</span>
    </div>
  )
}

export function TalentDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const talent = useLationStore((s) => s.talents.find((t) => t.id === id))
  const applications = useLationStore((s) => s.applications.filter((a) => a.talent_id === id))
  const positions = useLationStore((s) => s.positions)
  const employers = useLationStore((s) => s.employers)
  const placements = useLationStore((s) => s.placements.filter((p) => p.talent_id === id))

  if (!talent) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-slate-500">{t('talents.not_found', 'Talent not found.')}</p>
        <button onClick={() => navigate('/talents')} className="text-sm text-orange-600 hover:underline">
          {t('talents.back_to_talents', 'Back to Talents')}
        </button>
      </div>
    )
  }

  const avatarColor = colorHash(talent.full_name)

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
        <button
          onClick={() => navigate('/talents')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('talents.title')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* Profile Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start gap-5">
              <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white ${avatarColor}`}>
                {getInitials(talent.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{talent.full_name}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {talent.specialization} · {t(`level.${talent.level}`)} · {talent.years_of_experience} {t('talents.years_exp_short', 'yrs exp.')}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[talent.status]}`}>
                    {t(`status.${talent.status}`)}
                  </span>
                </div>

                {/* Tech Stack */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {talent.tech_stack.map((tech) => (
                    <span key={tech} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-3 flex items-center gap-3">
                  {talent.cv_url && (
                    <a href={talent.cv_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-500 hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" /> {t('talents.view_cv', 'View CV')}
                    </a>
                  )}
                  {talent.linkedin_url && (
                    <a href={talent.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                      <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info + Stats Row */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Contact & Details */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('talents.information', 'Information')}</h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                <InfoRow icon={Mail} label="Email" value={talent.email} />
                <InfoRow icon={Phone} label={t('talents.phone')} value={talent.phone} />
                <InfoRow icon={MapPin} label={t('talents.country')} value={talent.country} />
                <InfoRow icon={MapPin} label={t('talents.timezone')} value={talent.timezone} />
                <InfoRow icon={Briefcase} label={t('talents.employment_type')} value={t(`employment_type.${talent.employment_type}`)} />
                <InfoRow icon={Calendar} label={t('talents.available_from')} value={talent.available_from ? format(new Date(talent.available_from), 'dd MMM yyyy') : null} />
                <InfoRow icon={DollarSign} label={t('talents.preferred_salary')}
                  value={talent.preferred_salary_min && talent.preferred_salary_max
                    ? `${talent.preferred_salary_currency} ${talent.preferred_salary_min.toLocaleString()} – ${talent.preferred_salary_max.toLocaleString()}`
                    : null}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('talents.summary', 'Summary')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t('applications.title'), value: applications.length },
                  { label: t('placements.title'), value: placements.length },
                  { label: t('placements.active'), value: applications.filter((a) => !['rejected'].includes(a.status)).length },
                  { label: t('talents.languages'), value: talent.languages.join(', ') },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3">
                    <p className="text-xs text-slate-400">{s.label}</p>
                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Applications History */}
          {applications.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('talents.application_history', 'Application History')}
                  <span className="ml-2 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {applications.length}
                  </span>
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {applications.map((app) => {
                  const pos = positions.find((p) => p.id === app.position_id)
                  const emp = employers.find((e) => e.id === pos?.employer_id)
                  return (
                    <div key={app.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {pos?.title ?? '—'}
                        </p>
                        <p className="text-xs text-slate-400">{emp?.company_name ?? '—'} · {format(new Date(app.applied_at), 'dd MMM yyyy')}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${APP_STATUS_COLORS[app.status] ?? ''}`}>
                        {t(`status.${app.status}`)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Placements */}
          {placements.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('placements.title')}</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {placements.map((pl) => {
                  const pos = positions.find((p) => p.id === pl.position_id)
                  const emp = employers.find((e) => e.id === pl.employer_id)
                  return (
                    <div key={pl.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{pos?.title ?? '—'}</p>
                        <p className="text-xs text-slate-400">
                          {emp?.company_name ?? '—'} · {t('common.start')}: {format(new Date(pl.start_date), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {pl.currency} {pl.final_salary.toLocaleString()}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {t('common.commission')}: ${pl.commission_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
