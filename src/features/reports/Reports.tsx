import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { RecommendationBadge, CandidateStatusBadge, InterviewStatusBadge } from '../../components/shared/StatusBadge'
import { useStore } from '../../store/useStore'
import { formatDate, formatDateTime } from '../../lib/formatters'
import { INTERVIEW_TYPE_LABELS, RECOMMENDATION_LABELS } from '../../lib/status'

export function Reports() {
  const companies = useStore((s) => s.companies)
  const hiringNeeds = useStore((s) => s.hiringNeeds)
  const candidates = useStore((s) => s.candidates)
  const interviews = useStore((s) => s.interviews)
  const scorecards = useStore((s) => s.scorecards)

  const clients = companies.filter((c) => c.status === 'closed_won')
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '')
  const [copied, setCopied] = useState(false)

  const client = companies.find((c) => c.id === selectedClientId)
  const needs = hiringNeeds.filter((h) => h.companyId === selectedClientId)
  const cands = candidates.filter((c) => c.companyId === selectedClientId)
  const ints = interviews.filter((i) => i.companyId === selectedClientId)
  const scs = scorecards.filter((s) => s.companyId === selectedClientId)

  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]))
  const needMap = Object.fromEntries(hiringNeeds.map((h) => [h.id, h]))

  function generateReportText(): string {
    if (!client) return ''
    const lines: string[] = [
      `# Lation Technical Interview Report`,
      `## Client: ${client.name}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      `### Summary`,
      `- Hiring Needs: ${needs.length}`,
      `- Candidates Evaluated: ${cands.length}`,
      `- Interviews Conducted: ${ints.length}`,
      `- Scorecards Completed: ${scs.length}`,
      '',
      `### Scorecards`,
    ]
    scs.forEach((sc) => {
      const cand = candidateMap[sc.candidateId]
      const avg = (sc.technicalKnowledge + sc.problemSolving + sc.communication + sc.seniorityAlignment + sc.roleFit + sc.clientReadiness) / 6
      lines.push(`#### ${cand?.name ?? '—'} — ${sc.roleType.replace(/_/g, ' ')}`)
      lines.push(`- Recommendation: ${RECOMMENDATION_LABELS[sc.finalRecommendation]}`)
      lines.push(`- Average Score: ${avg.toFixed(1)}/5`)
      lines.push(`- Strengths: ${sc.strengths}`)
      lines.push(`- Concerns: ${sc.concerns}`)
      lines.push(`- Summary: ${sc.summary}`)
      lines.push('')
    })
    return lines.join('\n')
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateReportText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col">
      <TopBar
        title="Reports"
        subtitle="Client evaluation reports"
        action={
          <Button size="sm" onClick={handleCopy} disabled={!client}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Report'}
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex gap-3">
          <Select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-56">
            <option value="">Select client...</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        {!client ? (
          <p className="text-sm text-slate-400">Select a client to view their report.</p>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Hiring Needs', value: needs.length },
                { label: 'Candidates', value: cands.length },
                { label: 'Interviews', value: ints.length },
                { label: 'Scorecards', value: scs.length },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-white border border-slate-200 p-4 dark:bg-slate-800 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
                </div>
              ))}
            </div>

            {/* Scorecards */}
            {scs.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Scorecards</CardTitle></CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700">
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Candidate</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Role</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Score</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Recommendation</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {scs.map((sc) => {
                        const cand = candidateMap[sc.candidateId]
                        const avg = (sc.technicalKnowledge + sc.problemSolving + sc.communication + sc.seniorityAlignment + sc.roleFit + sc.clientReadiness) / 6
                        return (
                          <tr key={sc.id}>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-100">{cand?.name ?? '—'}</td>
                            <td className="py-2 text-slate-500 capitalize">{sc.roleType.replace(/_/g, ' ')}</td>
                            <td className="py-2 text-slate-700 font-medium">{avg.toFixed(1)}/5</td>
                            <td className="py-2"><RecommendationBadge rec={sc.finalRecommendation} /></td>
                            <td className="py-2 text-slate-400 text-xs">{formatDate(sc.createdAt)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* Candidates */}
            {cands.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Candidates</CardTitle></CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700">
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Name</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Role</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Stack</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {cands.map((c) => (
                        <tr key={c.id}>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-100">{c.name}</td>
                          <td className="py-2 text-slate-500">{needMap[c.hiringNeedId]?.roleTitle ?? '—'}</td>
                          <td className="py-2 text-xs text-slate-500">{c.mainStack.slice(0, 3).join(', ')}</td>
                          <td className="py-2"><CandidateStatusBadge status={c.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* Interviews */}
            {ints.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Interviews</CardTitle></CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700">
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Candidate</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Type</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Interviewer</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Date</th>
                        <th className="pb-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {ints.map((i) => (
                        <tr key={i.id}>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-100">{candidateMap[i.candidateId]?.name ?? '—'}</td>
                          <td className="py-2 text-xs text-slate-500">{INTERVIEW_TYPE_LABELS[i.interviewType]}</td>
                          <td className="py-2 text-slate-500">{i.interviewer}</td>
                          <td className="py-2 text-xs text-slate-400">{i.scheduledAt ? formatDateTime(i.scheduledAt) : '—'}</td>
                          <td className="py-2"><InterviewStatusBadge status={i.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
