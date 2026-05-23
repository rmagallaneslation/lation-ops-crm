import {
  Users, Building2, Briefcase, TrendingUp, DollarSign,
  UserPlus, PlusSquare, ClipboardList, FileSearch,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLationStore } from '../../store/useLationStore'
import { getInitials, colorHash } from '../../lib/utils'

const TEAM = [
  { name: 'Roberto', role: 'Partner' },
  { name: 'Reynaldo', role: 'Partner' },
  { name: 'Santiago', role: 'Partner' },
]

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function KpiCard({ label, value, sub, icon: Icon, deltaPositive, delta }: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; deltaPositive?: boolean; delta?: string
}) {
  const deltaColor = !delta
    ? ''
    : delta.startsWith('-')
      ? 'text-red-500'
      : delta.startsWith('+')
        ? 'text-emerald-600'
        : 'text-slate-400'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
          <Icon className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {sub && (
            <p className={`mt-0.5 text-xs ${deltaPositive === undefined ? 'text-slate-400' : deltaPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {sub}
            </p>
          )}
          {delta && (
            <p className={`mt-0.5 text-xs font-medium ${deltaColor}`}>{delta}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SimpleBarChart({ data }: { data: { mes: string; colocaciones: number }[] }) {
  const max = Math.max(...data.map((d) => d.colocaciones), 1)
  return (
    <div className="flex h-[200px] items-end gap-1.5 pt-4">
      {data.map(({ mes, colocaciones }) => (
        <div key={mes} className="group relative flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-orange-500 transition-all duration-300 group-hover:bg-orange-400"
            style={{ height: `${(colocaciones / max) * 140}px`, minHeight: colocaciones > 0 ? 4 : 0 }}
          />
          {colocaciones > 0 && (
            <span className="absolute -top-5 text-[10px] font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {colocaciones}
            </span>
          )}
          <span className="text-[10px] text-slate-400 mt-1">{mes}</span>
        </div>
      ))}
    </div>
  )
}

function QuickAction({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-700 dark:hover:bg-orange-950/20"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
      </div>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{label}</span>
    </button>
  )
}

export function DashboardV2() {
  const talents = useLationStore((s) => s.talents)
  const employers = useLationStore((s) => s.employers)
  const positions = useLationStore((s) => s.positions)
  const applications = useLationStore((s) => s.applications)
  const placements = useLationStore((s) => s.placements)
  const navigate = useNavigate()

  // KPIs — Clientes
  const activeEmployers = employers.filter((e) => e.status === 'active').length
  const openPositions = positions.filter((p) => p.status === 'open').length

  // KPIs — Talentos
  const prospects = talents.filter((t) => t.status === 'prospect').length
  const inProcess = talents.filter((t) => t.status === 'in_process').length
  const activePlacements = placements.filter((p) => p.status === 'placed').length
  const totalCommission = placements.reduce((sum, p) => sum + p.commission_amount, 0)

  // Month deltas
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1)
  const placementsThisMonth = placements.filter((p) => {
    const d = new Date(p.start_date)
    return d.getFullYear() === thisYear && d.getMonth() === thisMonth
  }).length
  const placementsLastMonth = placements.filter((p) => {
    const d = new Date(p.start_date)
    return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth()
  }).length
  const placementsDelta = placementsThisMonth - placementsLastMonth
  const placementsDeltaStr = placementsDelta === 0
    ? 'igual que el mes pasado'
    : `${placementsDelta > 0 ? '+' : ''}${placementsDelta} vs mes pasado`

  const prospectsThisMonth = talents.filter((t) => {
    const d = new Date(t.created_at ?? '')
    return t.status === 'prospect' && d.getFullYear() === thisYear && d.getMonth() === thisMonth
  }).length
  const prospectsDeltaStr = prospectsThisMonth > 0 ? `+${prospectsThisMonth} este mes` : 'ninguno este mes'

  // Chart — colocaciones por mes (últimos 12 meses)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    const count = placements.filter((p) => {
      const pd = new Date(p.start_date)
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
    }).length
    return { mes: MONTHS[d.getMonth()], colocaciones: count }
  })

  // Pipeline reciente — últimas aplicaciones activas
  const recentApps = applications
    .filter((a) => !['rejected'].includes(a.status))
    .slice(0, 6)
    .map((a) => {
      const talent = talents.find((t) => t.id === a.talent_id)
      const position = positions.find((p) => p.id === a.position_id)
      const employer = employers.find((e) => e.id === position?.employer_id)
      return { ...a, talent, position, employer }
    })

  const STATUS_COLORS: Record<string, string> = {
    applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    screening: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    interview: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    reviewed: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    offer_sent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Hola, equipo LATION 👋</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">¿En qué están trabajando hoy?</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {/* Clientes KPIs */}
          <KpiCard label="Empresas activas" value={activeEmployers} sub={`${employers.length} total`} icon={Building2} />
          <KpiCard label="Posiciones abiertas" value={openPositions} sub={`${positions.length} total`} icon={Briefcase} />
          {/* Talentos KPIs */}
          <KpiCard label="Prospectos" value={prospects} sub="nuevos talentos" icon={UserPlus} delta={prospectsDeltaStr} />
          <KpiCard label="En proceso" value={inProcess} sub="en pipeline" icon={Users} />
          <KpiCard label="Colocados activos" value={activePlacements} sub="en clientes" icon={TrendingUp} delta={placementsDeltaStr} />
          <KpiCard label="Comisión total" value={`$${totalCommission.toLocaleString()}`} sub="acumulada" icon={DollarSign} deltaPositive />
        </div>

        {/* Chart + Quick Actions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Chart */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Colocaciones por mes</h2>
              <span className="text-xs text-slate-400">últimos 12 meses</span>
            </div>
            <SimpleBarChart data={chartData} />
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Acciones rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={UserPlus} label="Nuevo talento" onClick={() => navigate('/talents')} />
              <QuickAction icon={Building2} label="Nueva empresa" onClick={() => navigate('/employers')} />
              <QuickAction icon={PlusSquare} label="Nueva posición" onClick={() => navigate('/positions')} />
              <QuickAction icon={ClipboardList} label="Ver aplicaciones" onClick={() => navigate('/applications')} />
              <QuickAction icon={TrendingUp} label="Colocaciones" onClick={() => navigate('/placements')} />
              <QuickAction icon={FileSearch} label="Ver pipeline" onClick={() => navigate('/applications')} />
            </div>
          </div>
        </div>

        {/* Pipeline reciente + Team */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Pipeline reciente */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Pipeline activo <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{recentApps.length}</span>
              </h2>
              <button onClick={() => navigate('/applications')} className="text-xs text-orange-600 hover:underline dark:text-orange-400">
                Ver todo
              </button>
            </div>
            {recentApps.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No hay aplicaciones activas</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentApps.map((app) => (
                  <div key={app.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {getInitials(app.talent?.full_name ?? '?')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {app.talent?.full_name ?? 'Talento desconocido'}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {app.position?.title ?? 'Posición desconocida'} · {app.employer?.company_name ?? ''}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[app.status] ?? ''}`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Mi equipo</h2>
              <span className="text-xs text-slate-400">3 activos</span>
            </div>
            <div className="space-y-3">
              {TEAM.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorHash(member.name)}`}>
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Online
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
