import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { CandidateStatusBadge, HiringNeedStatusBadge, InterviewStatusBadge, UrgencyBadge } from '../../components/shared/StatusBadge'
import { useStore } from '../../store/useStore'
import { formatDate, formatDateTime } from '../../lib/formatters'
import { INTERVIEW_TYPE_LABELS } from '../../lib/status'

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const companies = useStore((s) => s.companies)
  const hiringNeeds = useStore((s) => s.hiringNeeds)
  const candidates = useStore((s) => s.candidates)
  const interviews = useStore((s) => s.interviews)

  const client = companies.find((c) => c.id === id)
  if (!client) return <div className="p-6 text-sm text-slate-500">Client not found.</div>

  const needs = hiringNeeds.filter((h) => h.companyId === id)
  const cands = candidates.filter((c) => c.companyId === id)
  const ints = interviews.filter((i) => i.companyId === id)

  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]))

  return (
    <div className="flex flex-col">
      <TopBar
        title={client.name}
        subtitle={`${client.industry} · ${client.city ?? ''}${client.city ? ', ' : ''}${client.country}`}
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Contact</p><p className="font-medium dark:text-slate-200">{client.contactName ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Role</p><p className="font-medium dark:text-slate-200">{client.contactRole ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Email</p><p className="font-medium dark:text-slate-200">{client.contactEmail ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Owner</p><p className="font-medium dark:text-slate-200">{client.owner}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Company Size</p><p className="font-medium dark:text-slate-200">{client.companySize ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Deal Value</p><p className="font-medium dark:text-slate-200">{client.estimatedDealValue ? `$${client.estimatedDealValue.toLocaleString()}` : '—'}</p></div>
          </CardContent>
        </Card>

        {/* Hiring Needs */}
        <Card>
          <CardHeader><CardTitle>Hiring Needs ({needs.length})</CardTitle></CardHeader>
          <CardContent>
            {needs.length === 0 ? <p className="text-xs text-slate-400">No hiring needs configured.</p> : (
              <div className="space-y-3">
                {needs.map((n) => (
                  <div key={n.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{n.roleTitle}</p>
                      <div className="flex gap-1.5">
                        <UrgencyBadge urgency={n.urgency} />
                        <HiringNeedStatusBadge status={n.status} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{n.seniority} · {n.stack.join(', ')}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">English: {n.englishLevel ?? '—'} · Volume: {n.candidateVolume ?? '—'}</p>
                    <p className="text-xs text-slate-400 mt-1">Must: {n.mustHaveSkills.join(', ')}</p>
                    {n.createdAt && <p className="text-xs text-slate-300 mt-1">{formatDate(n.createdAt)}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidates */}
        <Card>
          <CardHeader><CardTitle>Candidates ({cands.length})</CardTitle></CardHeader>
          <CardContent>
            {cands.length === 0 ? <p className="text-xs text-slate-400">No candidates yet.</p> : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {cands.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3 dark:text-slate-300">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.seniority} · {c.mainStack.slice(0, 3).join(', ')}</p>
                    </div>
                    <CandidateStatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card>
          <CardHeader><CardTitle>Interviews ({ints.length})</CardTitle></CardHeader>
          <CardContent>
            {ints.length === 0 ? <p className="text-xs text-slate-400">No interviews yet.</p> : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {ints.map((i) => {
                  const cand = candidateMap[i.candidateId]
                  return (
                    <div key={i.id} className="flex items-center justify-between py-3 dark:text-slate-300">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{cand?.name ?? '—'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {INTERVIEW_TYPE_LABELS[i.interviewType]} · {i.interviewer}
                          {i.scheduledAt ? ` · ${formatDateTime(i.scheduledAt)}` : ''}
                        </p>
                      </div>
                      <InterviewStatusBadge status={i.status} />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
