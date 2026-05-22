import { Users, Building2, Briefcase, FileText, TrendingUp, DollarSign } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { useLationStore } from '../../store/useLationStore'

function KpiCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; accent?: boolean
}) {
  return (
    <div className={`rounded-xl border p-5 ${accent
      ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/20'
      : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium mb-1 ${accent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{label}</p>
          <p className={`text-3xl font-bold ${accent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>{value}</p>
          {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
          <Icon className={`h-5 w-5 ${accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
        </div>
      </div>
    </div>
  )
}

export function DashboardV2() {
  const talents = useLationStore((s) => s.talents)
  const employers = useLationStore((s) => s.employers)
  const positions = useLationStore((s) => s.positions)
  const applications = useLationStore((s) => s.applications)
  const placements = useLationStore((s) => s.placements)

  const activeTalents = talents.filter((t) => t.status === 'available' || t.status === 'in_process').length
  const activeEmployers = employers.filter((e) => e.status === 'active').length
  const openPositions = positions.filter((p) => p.status === 'open').length
  const activeApplications = applications.filter((a) => !['rejected', 'withdrawn'].includes(a.status)).length
  const activePlacements = placements.filter((p) => p.status === 'placed').length
  const totalCommission = placements.reduce((sum, p) => sum + p.commission_amount, 0)

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    .slice(0, 6)

  const talentMap = Object.fromEntries(talents.map((t) => [t.id, t]))
  const positionMap = Object.fromEntries(positions.map((p) => [p.id, p]))
  const employerMap = Object.fromEntries(employers.map((e) => [e.id, e]))

  const STATUS_DOT: Record<string, string> = {
    applied: 'bg-slate-400', screening: 'bg-sky-400',
    interview_scheduled: 'bg-violet-500', interview_done: 'bg-amber-500',
    offer_sent: 'bg-blue-500', accepted: 'bg-emerald-500',
    rejected: 'bg-red-400', withdrawn: 'bg-slate-300',
  }

  const countryDist = talents.reduce<Record<string, number>>((acc, t) => {
    acc[t.country] = (acc[t.country] ?? 0) + 1
    return acc
  }, {})

  const topCountries = Object.entries(countryDist)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Dashboard" subtitle="LATION 2 — Talent Marketplace" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          <KpiCard label="Active Talents" value={activeTalents} sub={`${talents.length} total`} icon={Users} />
          <KpiCard label="Active Employers" value={activeEmployers} sub={`${employers.length} total`} icon={Building2} />
          <KpiCard label="Open Positions" value={openPositions} sub={`${positions.length} total`} icon={Briefcase} />
          <KpiCard label="Active Applications" value={activeApplications} sub="in pipeline" icon={FileText} />
          <KpiCard label="Active Placements" value={activePlacements} sub="ongoing" icon={TrendingUp} />
          <KpiCard label="Total Commission" value={`$${totalCommission.toLocaleString()}`} sub="all time" icon={DollarSign} accent />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Applications */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Applications</h2>
              <span className="text-xs text-slate-400">{applications.length} total</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentApps.map((a) => {
                const talent = talentMap[a.talent_id]
                const position = positionMap[a.position_id]
                const employer = employerMap[position?.employer_id ?? '']
                return (
                  <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                      {talent?.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{talent?.full_name ?? '—'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{position?.title} · {employer?.company_name}</p>
                    </div>
                    <span className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[a.status] ?? 'bg-slate-300'}`} />
                      <span className="text-xs capitalize text-slate-600 dark:text-slate-300">{a.status.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Talent by Country */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Talent by Country</h2>
              <span className="text-xs text-slate-400">{talents.length} talents</span>
            </div>
            <div className="px-5 py-4 space-y-3">
              {topCountries.map(([country, count]) => {
                const pct = Math.round((count / talents.length) * 100)
                return (
                  <div key={country}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{country}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                      <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Active placements strip */}
            <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Active Placements</h3>
              <div className="space-y-2">
                {placements.filter((p) => p.status === 'placed').map((p) => {
                  const talent = talentMap[p.talent_id]
                  const employer = employerMap[p.employer_id]
                  return (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{talent?.full_name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">→ {employer?.company_name}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-2">
                        +${p.commission_amount.toLocaleString()}/mo
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
