import { Building2, Users, CalendarCheck2, TrendingUp, ClipboardList } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TopBar } from '../../components/layout/TopBar'
import { StatCard, Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { InterviewStatusBadge, CompanyStatusBadge } from '../../components/shared/StatusBadge'
import { useStore } from '../../store/useStore'
import { formatDateTime } from '../../lib/formatters'
import { COMPANY_STATUS_LABELS, PIPELINE_STAGES } from '../../lib/status'

export function Dashboard() {
  const companies = useStore((s) => s.companies)
  const candidates = useStore((s) => s.candidates)
  const interviews = useStore((s) => s.interviews)
  const hiringNeeds = useStore((s) => s.hiringNeeds)

  const activeClients = companies.filter((c) => c.status === 'closed_won')
  const openDeals = companies.filter(
    (c) => !['closed_won', 'closed_lost'].includes(c.status)
  )
  const upcoming = interviews
    .filter((i) => i.status === 'scheduled' && i.scheduledAt)
    .sort((a, b) => (a.scheduledAt! > b.scheduledAt! ? 1 : -1))
    .slice(0, 5)

  const pipelineData = PIPELINE_STAGES.slice(0, 7).map((s) => ({
    name: COMPANY_STATUS_LABELS[s],
    count: companies.filter((c) => c.status === s).length,
  }))

  const totalPipelineValue = openDeals.reduce((sum, c) => sum + (c.estimatedDealValue ?? 0), 0)

  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]))
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))
  const hiringNeedMap = Object.fromEntries(hiringNeeds.map((h) => [h.id, h]))

  return (
    <div className="flex flex-col">
      <TopBar title="Dashboard" subtitle="Lation Ops CRM" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Clients"
            value={activeClients.length}
            icon={<Building2 className="h-4 w-4" />}
          />
          <StatCard
            label="Open Deals"
            value={openDeals.length}
            sub={`$${(totalPipelineValue / 1000).toFixed(0)}k pipeline`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            label="Active Candidates"
            value={candidates.filter((c) => !['not_recommended'].includes(c.status)).length}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            label="Interviews Scheduled"
            value={interviews.filter((i) => i.status === 'scheduled').length}
            icon={<CalendarCheck2 className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pipelineData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#EA580C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 && (
                <p className="text-xs text-slate-400">No upcoming interviews</p>
              )}
              {upcoming.map((i) => {
                const candidate = candidateMap[i.candidateId]
                const company = companyMap[i.companyId]
                const need = hiringNeedMap[i.hiringNeedId]
                return (
                  <div key={i.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{candidate?.name ?? '—'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{need?.roleTitle ?? '—'} · {company?.name ?? '—'}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{i.scheduledAt ? formatDateTime(i.scheduledAt) : '—'}</p>
                    <div className="mt-1.5">
                      <InterviewStatusBadge status={i.status} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Active clients summary */}
        <Card>
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {activeClients.length === 0 && (
              <p className="text-xs text-slate-400">No active clients yet</p>
            )}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {activeClients.map((c) => {
                const needs = hiringNeeds.filter((h) => h.companyId === c.id)
                const cands = candidates.filter((ca) => ca.companyId === c.id)
                return (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.industry} · {c.city}, {c.country}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <ClipboardList className="h-3 w-3 text-slate-400" />
                        {needs.length} roles
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-400" />
                        {cands.length} candidates
                      </span>
                      <CompanyStatusBadge status={c.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
