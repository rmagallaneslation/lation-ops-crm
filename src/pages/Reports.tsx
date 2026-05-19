import { useState, useMemo } from 'react'
import { BarChart2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { LevelBadge, CandidateStatusBadge, InterviewTypeBadge, RecommendationBadge } from '../components/ui/Badge'
import { formatCurrency, formatDate, formatDateTime } from '../lib/utils'

const CANDIDATE_PIPELINE_ORDER = [
  'screening', 'technical', 'system-design', 'final', 'offer', 'hired', 'rejected', 'withdrawn',
] as const

export function Reports() {
  const { clients, hiringRoles, candidates, interviews } = useStore()
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '')

  const client = useMemo(() => clients.find((c) => c.id === selectedClientId), [clients, selectedClientId])
  const clientRoles = useMemo(() => hiringRoles.filter((r) => r.clientId === selectedClientId), [hiringRoles, selectedClientId])
  const clientCandidates = useMemo(() => candidates.filter((c) => c.clientId === selectedClientId), [candidates, selectedClientId])
  const clientInterviews = useMemo(() => interviews.filter((i) => i.clientId === selectedClientId), [interviews, selectedClientId])

  const completedInterviews = clientInterviews.filter((i) => i.status === 'completed')
  const scheduledInterviews = clientInterviews.filter((i) => i.status === 'scheduled')
  const hiredCandidates = clientCandidates.filter((c) => c.status === 'hired')
  const activeCandidates = clientCandidates.filter((c) => c.status !== 'rejected' && c.status !== 'withdrawn')

  const avgScore = useMemo(() => {
    const withScore = completedInterviews.filter((i) => i.overallScore !== undefined)
    if (withScore.length === 0) return null
    return withScore.reduce((s, i) => s + (i.overallScore ?? 0), 0) / withScore.length
  }, [completedInterviews])

  const passRate = useMemo(() => {
    if (completedInterviews.length === 0) return null
    const hired = completedInterviews.filter(
      (i) => i.recommendation === 'hire' || i.recommendation === 'strong-hire'
    ).length
    return Math.round((hired / completedInterviews.length) * 100)
  }, [completedInterviews])

  const candidatesByStatus = useMemo(() => {
    const map: Record<string, number> = {}
    clientCandidates.forEach((c) => {
      map[c.status] = (map[c.status] ?? 0) + 1
    })
    return map
  }, [clientCandidates])

  if (!client) {
    return (
      <div>
        <TopBar title="Reports" subtitle="Client-specific technical reports" />
        <div className="p-6">
          <p className="text-slate-500 text-sm">No clients available.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopBar
        title="Reports"
        subtitle="Client-specific performance summary"
        action={
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer font-medium"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>
        }
      />

      <div className="p-6 space-y-6">
        {/* Report Header */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 size={16} className="text-sky-600" />
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Technical Report</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{client.companyName}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{client.industry}</p>
              <p className="text-xs text-slate-400 mt-1">
                Client since {formatDate(client.startDate)} · {formatCurrency(client.monthlyValue)}/mo · Assigned to {client.assignedTo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Report generated</p>
              <p className="text-sm font-medium text-slate-700">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </Card>

        {/* Executive Summary */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">{clientRoles.length}</p>
            <p className="text-xs text-slate-500 mt-1">Active Roles</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">{activeCandidates.length}</p>
            <p className="text-xs text-slate-500 mt-1">Candidates Assessed</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-emerald-600 tabular-nums">{hiredCandidates.length}</p>
            <p className="text-xs text-slate-500 mt-1">Successful Hires</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {completedInterviews.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">Interviews Completed</p>
          </Card>
        </div>

        {/* Interview Stats */}
        {completedInterviews.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Interview Performance</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Interviews</p>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">{clientInterviews.length}</p>
                <p className="text-xs text-slate-400">{scheduledInterviews.length} upcoming</p>
              </div>
              {avgScore !== null && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">{avgScore.toFixed(2)}<span className="text-sm text-slate-400">/5</span></p>
                  <p className="text-xs text-slate-400">across {completedInterviews.filter((i) => i.overallScore !== undefined).length} scored interviews</p>
                </div>
              )}
              {passRate !== null && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Recommendation Rate</p>
                  <p className={`text-2xl font-bold tabular-nums ${passRate >= 50 ? 'text-emerald-600' : 'text-amber-600'}`}>{passRate}%</p>
                  <p className="text-xs text-slate-400">hire or strong-hire</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Roles Table */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Active Roles</h3>
          </div>
          {clientRoles.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No roles configured for this client.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Level</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Technology</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Open</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Filled</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Candidates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientRoles.map((role) => {
                  const roleCandidates = clientCandidates.filter((c) => c.roleId === role.id)
                  return (
                    <tr key={role.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-900">{role.roleName}</td>
                      <td className="px-4 py-3"><LevelBadge level={role.level} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {role.technology.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium tabular-nums">{role.openPositions}</td>
                      <td className="px-4 py-3 text-emerald-600 font-medium tabular-nums">{role.filledPositions}</td>
                      <td className="px-4 py-3 text-slate-700 tabular-nums">{roleCandidates.length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </Card>

        {/* Candidate Pipeline */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Candidate Pipeline</h3>
          {clientCandidates.length === 0 ? (
            <p className="text-sm text-slate-500">No candidates for this client yet.</p>
          ) : (
            <div className="flex items-end gap-2">
              {CANDIDATE_PIPELINE_ORDER.map((status) => {
                const count = candidatesByStatus[status] ?? 0
                const maxCount = Math.max(...Object.values(candidatesByStatus), 1)
                const height = count > 0 ? Math.max((count / maxCount) * 80, 20) : 4
                return (
                  <div key={status} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-slate-700 tabular-nums">{count > 0 ? count : ''}</span>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${height}px`,
                        backgroundColor: count > 0
                          ? status === 'hired' ? '#059669'
                          : status === 'rejected' || status === 'withdrawn' ? '#94A3B8'
                          : status === 'offer' ? '#D97706'
                          : '#3B82F6'
                          : '#F1F5F9',
                      }}
                    />
                    <span className="text-xs text-slate-500 capitalize" style={{ fontSize: '10px' }}>
                      {status.replace('-', ' ')}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Hired Candidates */}
        {hiredCandidates.length > 0 && (
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Successful Hires</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Candidate</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Hired Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hiredCandidates.map((c) => {
                  const role = clientRoles.find((r) => r.id === c.roleId)
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700 text-xs">{role?.roleName ?? '—'}</td>
                      <td className="px-4 py-3"><CandidateStatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(c.updatedAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )}

        {/* Recent Completed Interviews */}
        {completedInterviews.length > 0 && (
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Completed Interviews</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Candidate</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Interviewer</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Score</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedInterviews.map((itv) => {
                  const cand = clientCandidates.find((c) => c.id === itv.candidateId)
                  return (
                    <tr key={itv.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-900">{cand?.name ?? 'Unknown'}</td>
                      <td className="px-4 py-3"><InterviewTypeBadge type={itv.type} /></td>
                      <td className="px-4 py-3 text-xs text-slate-600">{itv.interviewerName}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(itv.scheduledAt)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700 tabular-nums">
                        {itv.overallScore !== undefined ? `${itv.overallScore.toFixed(1)}/5` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {itv.recommendation ? <RecommendationBadge rec={itv.recommendation} /> : <span className="text-xs text-slate-400">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
