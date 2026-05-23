import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Mail, Phone, MapPin, Briefcase, Users, ExternalLink } from 'lucide-react'
import { useLationStore } from '../../store/useLationStore'
import { getInitials, colorHash } from '../../lib/utils'
import { format } from 'date-fns'

const EMPLOYER_STATUS: Record<string, string> = {
  active:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  prospect: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  inactive: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

const POSITION_STATUS: Record<string, string> = {
  open:        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  filled:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  closed:      'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

function InfoRow({ icon: Icon, label, value, href }: {
  icon: React.ElementType; label: string; value?: string | null; href?: string
}) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
      <span className="text-xs text-slate-500 w-24 flex-shrink-0">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline flex items-center gap-1">
          {value} <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{value}</span>
      )}
    </div>
  )
}

export function EmployerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const employer = useLationStore((s) => s.employers.find((e) => e.id === id))
  const allPositions = useLationStore((s) => s.positions.filter((p) => p.employer_id === id))
  const placements = useLationStore((s) => s.placements.filter((p) => p.employer_id === id))
  const talents = useLationStore((s) => s.talents)

  if (!employer) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-slate-500">Empresa no encontrada.</p>
        <button onClick={() => navigate('/employers')} className="text-sm text-orange-600 hover:underline">
          Volver a Empresas
        </button>
      </div>
    )
  }

  const openPositions = allPositions.filter((p) => p.status === 'open')
  const avatarColor = colorHash(employer.company_name)
  const totalCommission = placements.reduce((s, p) => s + p.commission_amount, 0)

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
        <button
          onClick={() => navigate('/employers')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Empresas
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* Company Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start gap-5">
              <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white ${avatarColor}`}>
                {employer.company_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{employer.company_name}</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{employer.industry} · {employer.country}</p>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${EMPLOYER_STATUS[employer.status]}`}>
                    {employer.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Posiciones totales', value: allPositions.length, icon: Briefcase },
              { label: 'Posiciones abiertas', value: openPositions.length, icon: Briefcase },
              { label: 'Talentos colocados', value: placements.length, icon: Users },
              { label: 'Comisión total', value: `$${totalCommission.toLocaleString()}`, icon: Users },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Info + Contact */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Empresa</h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                <InfoRow icon={Mail} label="Email" value={employer.email} href={`mailto:${employer.email}`} />
                <InfoRow icon={Phone} label="Teléfono" value={employer.phone} />
                <InfoRow icon={Globe} label="Website" value={employer.website} href={employer.website ?? undefined} />
                <InfoRow icon={MapPin} label="País" value={employer.country} />
                <InfoRow icon={Briefcase} label="Tipo" value={employer.employer_type.replace(/_/g, ' ')} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Contacto</h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                <InfoRow icon={Users} label="Nombre" value={employer.contact_name} />
                <InfoRow icon={Mail} label="Email" value={employer.contact_email} href={`mailto:${employer.contact_email}`} />
                <InfoRow icon={Phone} label="Teléfono" value={employer.contact_phone} />
              </div>
            </div>
          </div>

          {/* Positions */}
          {allPositions.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Posiciones
                  <span className="ml-2 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500">{allPositions.length}</span>
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {allPositions.map((pos) => (
                  <div key={pos.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{pos.title}</p>
                      <p className="text-xs text-slate-400">
                        {pos.level} · {pos.work_location.replace('_', ' ')} · {pos.contract_type.replace('_', ' ')}
                      </p>
                    </div>
                    {pos.salary_min && pos.salary_max && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                        {pos.currency} {pos.salary_min.toLocaleString()}–{pos.salary_max.toLocaleString()}
                      </p>
                    )}
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${POSITION_STATUS[pos.status]}`}>
                      {pos.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placed Talents */}
          {placements.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Talentos Colocados</h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {placements.map((pl) => {
                  const talent = talents.find((t) => t.id === pl.talent_id)
                  return (
                    <div key={pl.id} className="flex items-center gap-4 px-5 py-3">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorHash(talent?.full_name ?? 'X')}`}>
                        {getInitials(talent?.full_name ?? '?')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{talent?.full_name ?? '—'}</p>
                        <p className="text-xs text-slate-400">Inicio: {format(new Date(pl.start_date), 'dd MMM yyyy')}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {pl.currency} {pl.final_salary.toLocaleString()}
                        </p>
                        <p className="text-xs text-emerald-600">+${pl.commission_amount.toLocaleString()}</p>
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
