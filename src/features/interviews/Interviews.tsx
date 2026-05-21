import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { InterviewStatusBadge, InterviewTypeBadge } from '../../components/shared/StatusBadge'
import { EmptyState } from '../../components/shared/EmptyState'
import { useStore } from '../../store/useStore'
import { formatDateTime } from '../../lib/formatters'
import type { Interview, InterviewStatus, InterviewType, Interviewer } from '../../types'
import { generateId } from '../../lib/utils'

type Form = Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>

const emptyForm = (): Form => ({
  companyId: '',
  candidateId: '',
  hiringNeedId: '',
  interviewer: 'Roberto',
  interviewType: 'technical_screening',
  scheduledAt: '',
  meetingLink: '',
  status: 'to_schedule',
  notes: '',
})

const INTERVIEW_TYPES: InterviewType[] = [
  'technical_screening', 'live_coding', 'system_design',
  'qa_evaluation', 'salesforce_evaluation', 'english_technical',
]

const STATUSES: InterviewStatus[] = [
  'to_schedule', 'scheduled', 'completed', 'no_show',
  'cancelled', 'pending_scorecard', 'scorecard_completed', 'report_sent',
]

const INTERVIEWERS: Interviewer[] = ['Roberto', 'Reynaldo', 'Santiago', 'External']

export function Interviews() {
  const companies = useStore((s) => s.companies)
  const candidates = useStore((s) => s.candidates)
  const hiringNeeds = useStore((s) => s.hiringNeeds)
  const interviews = useStore((s) => s.interviews)
  const addInterview = useStore((s) => s.addInterview)
  const updateInterview = useStore((s) => s.updateInterview)
  const deleteInterview = useStore((s) => s.deleteInterview)

  const clients = companies.filter((c) => c.status === 'closed_won')
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))
  const candidateMap = Object.fromEntries(candidates.map((c) => [c.id, c]))
  const needMap = Object.fromEntries(hiringNeeds.map((h) => [h.id, h]))

  const [filterStatus, setFilterStatus] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Interview | null>(null)
  const [form, setForm] = useState<Form>(emptyForm())

  const filtered = interviews.filter((i) => {
    const matchStatus = !filterStatus || i.status === filterStatus
    const matchCompany = !filterCompany || i.companyId === filterCompany
    return matchStatus && matchCompany
  })

  const upcoming = filtered.filter((i) => ['to_schedule', 'scheduled'].includes(i.status))
  const past = filtered.filter((i) => !['to_schedule', 'scheduled'].includes(i.status))

  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setOpen(true)
  }

  function openEdit(i: Interview) {
    setEditing(i)
    setForm({ ...i })
    setOpen(true)
  }

  function handleSave() {
    if (!form.companyId || !form.candidateId) return
    if (editing) {
      updateInterview(editing.id, form)
    } else {
      addInterview({ ...form, id: generateId('int') } as Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>)
    }
    setOpen(false)
  }

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const needsForCompany = hiringNeeds.filter((h) => h.companyId === form.companyId)
  const candidatesForCompany = candidates.filter((c) => c.companyId === form.companyId)

  function InterviewRow({ i }: { i: Interview }) {
    const cand = candidateMap[i.candidateId]
    const company = companyMap[i.companyId]
    const need = needMap[i.hiringNeedId]
    return (
      <div
        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 px-4 rounded dark:border-slate-700 dark:hover:bg-slate-700"
        onClick={() => openEdit(i)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{cand?.name ?? '—'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{need?.roleTitle ?? '—'} · {company?.name ?? '—'}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{i.interviewer} · {i.scheduledAt ? formatDateTime(i.scheduledAt) : 'Not scheduled'}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <InterviewTypeBadge type={i.interviewType} />
          <InterviewStatusBadge status={i.status} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TopBar
        title="Interviews"
        subtitle={`${interviews.length} total`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Schedule Interview
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex gap-3">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-44">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </Select>
          <Select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-44">
            <option value="">All Clients</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        {filtered.length === 0 && (
          <EmptyState title="No interviews found" action={{ label: 'Schedule Interview', onClick: openAdd }} />
        )}

        {upcoming.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 dark:text-slate-400">Upcoming ({upcoming.length})</h2>
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              {upcoming.map((i) => <InterviewRow key={i.id} i={i} />)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 dark:text-slate-400">Past / Completed ({past.length})</h2>
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              {past.map((i) => <InterviewRow key={i.id} i={i} />)}
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Interview' : 'Schedule Interview'} className="max-w-xl">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Client *</Label>
            <Select value={form.companyId} onChange={(e) => { set('companyId', e.target.value); set('candidateId', ''); set('hiringNeedId', '') }}>
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Candidate *</Label>
            <Select value={form.candidateId} onChange={(e) => set('candidateId', e.target.value)}>
              <option value="">Select candidate...</option>
              {candidatesForCompany.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Hiring Need</Label>
            <Select value={form.hiringNeedId} onChange={(e) => set('hiringNeedId', e.target.value)}>
              <option value="">Select role...</option>
              {needsForCompany.map((h) => <option key={h.id} value={h.id}>{h.roleTitle}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Interviewer</Label>
              <Select value={form.interviewer} onChange={(e) => set('interviewer', e.target.value as Interviewer)}>
                {INTERVIEWERS.map((i) => <option key={i} value={i}>{i}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Interview Type</Label>
              <Select value={form.interviewType} onChange={(e) => set('interviewType', e.target.value as InterviewType)}>
                {INTERVIEW_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Scheduled At</Label>
              <Input type="datetime-local" value={form.scheduledAt ?? ''} onChange={(e) => set('scheduledAt', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => set('status', e.target.value as InterviewStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Meeting Link</Label>
            <Input value={form.meetingLink ?? ''} onChange={(e) => set('meetingLink', e.target.value)} placeholder="https://meet.google.com/..." />
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteInterview(editing.id); setOpen(false) }}>Delete</Button>
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
