import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Building2,
  UserCheck,
  Calendar,
  Briefcase,
  ArrowRight,
  Star,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { StatCard, Card } from '../components/ui/Card'
import { InterviewStatusBadge, InterviewTypeBadge, CandidateStatusBadge } from '../components/ui/Badge'
import { formatDateTime, formatCurrency, isInterviewThisWeek } from '../lib/utils'

const PIPELINE_STAGES = [
  { key: 'new', label: 'New', color: '#94A3B8' },
  { key: 'contacted', label: 'Contacted', color: '#60A5FA' },
  { key: 'qualified', label: 'Qualified', color: '#38BDF8' },
  { key: 'proposal', label: 'Proposal', color: '#818CF8' },
  { key: 'negotiation', label: 'Negotiation', color: '#FBBF24' },
]

export function Dashboard() {
  const { prospects, clients, hiringRoles, candidates, interviews } = useStore()

  const activeProspects = useMemo(
    () => prospects.filter((p) => p.status !== 'won' && p.status !== 'lost'),
    [prospects]
  )

  const activeClients = useMemo(
    () => clients.filter((c) => c.status === 'active'),
    [clients]
  )

  const openPositions = useMemo(
    () => hiringRoles.reduce((sum, r) => sum + r.openPositions, 0),
    [hiringRoles]
  )

  const interviewsThisWeek = useMemo(
    () =>
      interviews.filter(
        (i) => i.status === 'scheduled' && isInterviewThisWeek(i.scheduledAt)
      ),
    [interviews]
  )

  const activeCandidates = useMemo(
    () =>
      candidates.filter(
        (c) =>
          c.status !== 'hired' &&
          c.status !== 'rejected' &&
          c.status !== 'withdrawn'
      ),
    [candidates]
  )

  const pipelineData = useMemo(
    () =>
      PIPELINE_STAGES.map(({ key, label, color }) => ({
        label,
        count: prospects.filter((p) => p.status === key).length,
        color,
      })),
    [prospects]
  )

  const upcomingInterviews = useMemo(
    () =>
      interviews
        .filter((i) => i.status === 'scheduled')
        .sort(
          (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        )
        .slice(0, 5),
    [interviews]
  )

  const totalMRR = useMemo(
    () => activeClients.reduce((sum, c) => sum + c.monthlyValue, 0),
    [activeClients]
  )

  return (
    <div>
      <TopBar
        title="Dashboard"
        subtitle="Overview of your pipeline and operations"
      />

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard
            label="Active Prospects"
            value={activeProspects.length}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            label="Active Clients"
            value={activeClients.length}
            icon={Building2}
            color="emerald"
            sub={`${formatCurrency(totalMRR)}/mo MRR`}
          />
          <StatCard
            label="Open Positions"
            value={openPositions}
            icon={Briefcase}
            color="indigo"
          />
          <StatCard
            label="Interviews This Week"
            value={interviewsThisWeek.length}
            icon={Calendar}
            color="amber"
          />
          <StatCard
            label="Candidates in Pipeline"
            value={activeCandidates.length}
            icon={UserCheck}
            color="sky"
          />
        </div>

        {/* Charts + Upcoming */}
        <div className="grid grid-cols-5 gap-6">
          {/* Pipeline Chart */}
          <Card className="col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Prospect Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Active prospects by stage
                </p>
              </div>
              <Link
                to="/prospects"
                className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={pipelineData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value) => [value, 'Prospects']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Upcoming Interviews */}
          <Card padding={false} className="col-span-2">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                Upcoming Interviews
              </h2>
              <Link
                to="/interviews"
                className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center gap-1"
              >
                All
                <ArrowRight size={12} />
              </Link>
            </div>
            {upcomingInterviews.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No upcoming interviews
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingInterviews.map((interview) => {
                  const candidate = useStore
                    .getState()
                    .candidates.find((c) => c.id === interview.candidateId)
                  const client = useStore
                    .getState()
                    .clients.find((c) => c.id === interview.clientId)
                  return (
                    <div key={interview.id} className="px-5 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {candidate?.name ?? 'Unknown'}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {client?.companyName}
                          </p>
                        </div>
                        <InterviewTypeBadge type={interview.type} />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500">
                          {formatDateTime(interview.scheduledAt)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Client Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Active Clients</h2>
            <Link
              to="/clients"
              className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {activeClients.map((client) => {
              const roles = hiringRoles.filter((r) => r.clientId === client.id)
              const clientCandidates = candidates.filter(
                (c) =>
                  c.clientId === client.id &&
                  c.status !== 'hired' &&
                  c.status !== 'rejected' &&
                  c.status !== 'withdrawn'
              )
              const clientInterviews = interviews.filter(
                (i) => i.clientId === client.id && i.status === 'scheduled'
              )
              const latestCandidate = candidates
                .filter((c) => c.clientId === client.id && c.status !== 'rejected' && c.status !== 'withdrawn')
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                )[0]

              return (
                <Link key={client.id} to={`/clients/${client.id}`}>
                  <Card onClick={undefined} className="cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-150">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {client.companyName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {client.industry}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatCurrency(client.monthlyValue)}
                        <span className="text-xs font-normal text-slate-400">/mo</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2.5 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-900 tabular-nums">
                          {roles.length}
                        </p>
                        <p className="text-xs text-slate-500">Roles</p>
                      </div>
                      <div className="text-center p-2.5 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-900 tabular-nums">
                          {clientCandidates.length}
                        </p>
                        <p className="text-xs text-slate-500">In Pipeline</p>
                      </div>
                      <div className="text-center p-2.5 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-900 tabular-nums">
                          {clientInterviews.length}
                        </p>
                        <p className="text-xs text-slate-500">Scheduled</p>
                      </div>
                    </div>
                    {latestCandidate && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <Star size={12} className="text-amber-400" />
                        <span className="text-xs text-slate-500">
                          Latest:
                        </span>
                        <span className="text-xs font-medium text-slate-700">
                          {latestCandidate.name}
                        </span>
                        <CandidateStatusBadge status={latestCandidate.status} />
                      </div>
                    )}
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent completed interviews */}
        {interviews.filter((i) => i.status === 'completed').length > 0 && (
          <Card>
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Recent Completed Interviews
            </h2>
            <div className="space-y-3">
              {interviews
                .filter((i) => i.status === 'completed')
                .sort(
                  (a, b) =>
                    new Date(b.scheduledAt).getTime() -
                    new Date(a.scheduledAt).getTime()
                )
                .slice(0, 3)
                .map((interview) => {
                  const candidate = candidates.find(
                    (c) => c.id === interview.candidateId
                  )
                  const client = clients.find((c) => c.id === interview.clientId)
                  return (
                    <div
                      key={interview.id}
                      className="flex items-center gap-4 py-2.5 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {candidate?.name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {client?.companyName} · {formatDateTime(interview.scheduledAt)}
                        </p>
                      </div>
                      <InterviewTypeBadge type={interview.type} />
                      <InterviewStatusBadge status={interview.status} />
                      {interview.overallScore !== undefined && (
                        <span className="text-sm font-semibold text-slate-700 tabular-nums">
                          {interview.overallScore.toFixed(1)}
                          <span className="text-xs text-slate-400">/5</span>
                        </span>
                      )}
                    </div>
                  )
                })}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
