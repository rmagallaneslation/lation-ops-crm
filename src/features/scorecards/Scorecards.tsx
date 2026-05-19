import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent } from '../../components/ui/card'
import { RecommendationBadge } from '../../components/shared/StatusBadge'
import { EmptyState } from '../../components/shared/EmptyState'
import { useStore } from '../../store/useStore'
import { formatDate } from '../../lib/formatters'
import type { Scorecard, RoleType, FinalRecommendation, ScorecardStatus } from '../../types'
import { generateId } from '../../lib/utils'

type Form = Omit<Scorecard, 'id' | 'createdAt' | 'updatedAt'>

const emptyForm = (): Form => ({
  interviewId: '',
  candidateId: '',
  companyId: '',
  roleType: 'general',
  technicalKnowledge: 3,
  problemSolving: 3,
  communication: 3,
  seniorityAlignment: 3,
  roleFit: 3,
  clientReadiness: 3,
  strengths: '',
  concerns: '',
  finalRecommendation: 'hire',
  summary: '',
  status: 'draft',
})

const ROLE_TYPES: RoleType[] = ['general', 'frontend', 'backend', 'qa_manual', 'qa_automation', 'salesforce', 'devops', 'data', 'tech_lead']
const RECOMMENDATIONS: FinalRecommendation[] = ['strong_hire', 'hire', 'consider', 'weak_consider', 'no_hire']
const SC_STATUSES: ScorecardStatus[] = ['draft', 'completed', 'approved']

const DIMENSIONS: { key: keyof Pick<Form, 'technicalKnowledge' | 'problemSolving' | 'communication' | 'seniorityAlignment' | 'roleFit' | 'clientReadiness'>; label: string }[] = [
  { key: 'technicalKnowledge', label: 'Technical Knowledge' },
  { key: 'problemSolving', label: 'Problem Solving' },
  { key: 'communication', label: 'Communication' },
  { key: 'seniorityAlignment', label: 'Seniority Alignment' },
  { key: 'roleFit', label: 'Role Fit' },
  { key: 'clientReadiness', label: 'Client Readiness' },
]

function ScoreDots({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`h-2 w-2 rounded-full ${n <= value ? 'bg-orange-500' : 'bg-slate-200'}`}
        />
      ))}
    </div>
  )
}

export function Scorecards() {
  const companies = useStore((s) => s.companies)
  const candidates = useStore((s) => s.candidates)
  const interviews = useStore((s) => s.interviews)
  const scorecards = useStore((s) => s.scorecards)
  const addScorecard = useStore((s) => s.addScorecard)
  const updateScorecard = useStore((s) => s.updateScorecard)
  const deleteScorecard = useStore((s) => s.deleteScorecard)

  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]))
  const interviewMap = Object.fromEntries(interviews.map((i) => [i.id, i]))

  const [filterCompany, setFilterCompany] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Scorecard | null>(null)
  const [form, setForm] = useState<Form>(emptyForm())

  const clients = companies.filter((c) => c.status === 'closed_won')

  const filtered = scorecards.filter((s) => !filterCompany || s.companyId === filterCompany)

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyForm(), companyId: clients[0]?.id ?? '' })
    setOpen(true)
  }

  function openEdit(s: Scorecard) {
    setEditing(s)
    setForm({ ...s })
    setOpen(true)
  }

  function handleSave() {
    if (!form.companyId) return
    if (editing) {
      updateScorecard(editing.id, form)
    } else {
      addScorecard({ ...form, id: generateId('sc') } as Omit<Scorecard, 'id' | 'createdAt' | 'updatedAt'>)
    }
    setOpen(false)
  }

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const interviewsForCompany = interviews.filter((i) => i.companyId === form.companyId)
  const candidatesForCompany = candidates.filter((c) => c.companyId === form.companyId)

  return (
    <div className="flex flex-col">
      <TopBar
        title="Scorecards"
        subtitle={`${scorecards.length} scorecards`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> New Scorecard
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex gap-3">
          <Select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-44">
            <option value="">All Clients</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No scorecards found" action={{ label: 'New Scorecard', onClick: openAdd }} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((sc) => {
              const cand = candidateMap[sc.candidateId]
              const company = companyMap[sc.companyId]
              const interview = interviewMap[sc.interviewId]
              const avg = (sc.technicalKnowledge + sc.problemSolving + sc.communication + sc.seniorityAlignment + sc.roleFit + sc.clientReadiness) / 6
              return (
                <Card key={sc.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openEdit(sc)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{cand?.name ?? '—'}</p>
                        <p className="text-xs text-slate-500">{company?.name ?? '—'} · {sc.roleType.replace(/_/g, ' ')}</p>
                      </div>
                      <RecommendationBadge rec={sc.finalRecommendation} />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {DIMENSIONS.map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500 truncate">{label}</span>
                          <ScoreDots value={sc[key]} />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Avg: {avg.toFixed(1)} / 5</p>
                    {interview?.interviewType && (
                      <p className="text-xs text-slate-400">{interview.interviewType.replace(/_/g, ' ')}</p>
                    )}
                    <p className="text-xs text-slate-400">{formatDate(sc.createdAt)}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Scorecard' : 'New Scorecard'} className="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Client *</Label>
              <Select value={form.companyId} onChange={(e) => { set('companyId', e.target.value); set('interviewId', ''); set('candidateId', '') }}>
                <option value="">Select client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Candidate</Label>
              <Select value={form.candidateId} onChange={(e) => set('candidateId', e.target.value)}>
                <option value="">Select candidate...</option>
                {candidatesForCompany.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Interview</Label>
              <Select value={form.interviewId} onChange={(e) => set('interviewId', e.target.value)}>
                <option value="">Select interview...</option>
                {interviewsForCompany.map((i) => <option key={i.id} value={i.id}>{i.interviewType.replace(/_/g, ' ')} — {i.scheduledAt?.slice(0, 10) ?? 'unscheduled'}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Role Type</Label>
              <Select value={form.roleType} onChange={(e) => set('roleType', e.target.value as RoleType)}>
                {ROLE_TYPES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-600">Scores (1 = Poor, 5 = Exceptional)</p>
            {DIMENSIONS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-4">
                <span className="text-xs text-slate-600 w-40 flex-shrink-0">{label}</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => set(key, n)}
                      className={`h-8 w-8 rounded-full text-xs font-medium border transition-colors ${form[key] >= n ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-200 text-slate-500 hover:border-orange-300'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <Label>Final Recommendation</Label>
            <Select value={form.finalRecommendation} onChange={(e) => set('finalRecommendation', e.target.value as FinalRecommendation)}>
              {RECOMMENDATIONS.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as ScorecardStatus)}>
              {SC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Strengths</Label>
            <Textarea value={form.strengths} onChange={(e) => set('strengths', e.target.value)} placeholder="What stood out positively?" />
          </div>
          <div className="space-y-1">
            <Label>Concerns</Label>
            <Textarea value={form.concerns} onChange={(e) => set('concerns', e.target.value)} placeholder="What gave you pause?" />
          </div>
          <div className="space-y-1">
            <Label>Summary</Label>
            <Textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Overall evaluation summary..." rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteScorecard(editing.id); setOpen(false) }}>Delete</Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
