import { Users, Calendar, Briefcase, FileText, TrendingUp, DollarSign } from 'lucide-react'
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
  const positions = useLationStore((s) => s.positions)
  const applications = useLationStore((s) => s.applications)
  const placements = useLationStore((s) => s.placements)

  const talentsInPool = talents.filter((t) => t.status === 'available' || t.status === 'in_process').length
  const openPositions = positions.filter((p) => p.status === 'open').length
  const activeApplications = applications.filter((a) => !['rejected'].includes(a.status)).length
  const activePlacements = placements.filter((p) => p.status === 'placed').length

  const thisMonth = new Date()
  const placementsThisMonth = placements.filter((p) => {
    const d = new Date(p.start_date)
    return d.getFullYear() === thisMonth.getFullYear() && d.getMonth() === thisMonth.getMonth()
  }).length

  const totalCommission = placements.reduce((sum, p) => sum + p.commission_amount, 0)

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Dashboard" subtitle="LATION OPS" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          <KpiCard label="Talent Pool" value={talentsInPool} sub={`${talents.length} total registered`} icon={Users} />
          <KpiCard label="Open Positions" value={openPositions} sub={`${positions.length} total positions`} icon={Briefcase} />
          <KpiCard label="Active Applications" value={activeApplications} sub="in pipeline" icon={FileText} />
          <KpiCard label="Active Placements" value={activePlacements} sub="currently placed" icon={TrendingUp} />
          <KpiCard label="Placements This Month" value={placementsThisMonth} sub="new starts" icon={Calendar} />
          <KpiCard label="Total Commission" value={`$${totalCommission.toLocaleString()}`} sub="all time" icon={DollarSign} accent />
        </div>
      </div>
    </div>
  )
}
