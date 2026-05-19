import { useState, useMemo } from 'react'
import { Plus, Clock, CheckCircle, XCircle, Pencil } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { InterviewStatusBadge, InterviewTypeBadge, RecommendationBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDateTime, generateId, isInPast } from '../lib/utils'
import type { Interview, InterviewType, InterviewStatus, Recommendation, TeamMember } from '../types'
import { Calendar } from 'lucide-react'

const TYPES: InterviewType[] = ['screening', 'technical', 'system-design', 'behavioral', 'final']
const STATUSES: InterviewStatus[] = ['scheduled', 'completed', 'cancelled', 'no-show']
const RECS: Recommendation[] = ['strong-hire', 'hire', 'no-hire', 'strong-no-hire']
const TEAM: TeamMember[] = ['Roberto', 'Reynaldo', 'Santiago']

const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent placeholder:text-slate-400 bg-white'
const labelCls = 'block text-xs font-medium text-slate-700 mb-1'

interface ItvForm {
  candidateId: string
  clientId: string
  interviewerName: string
  scheduledAt: string
  duration: string
  type: InterviewType
  status: InterviewStatus
  recommendation: Recommendation | ''
  overallScore: string
  scorecardId: string
  notes: string
}

const emptyForm: ItvForm = {
  candidateId: '', clientId: '', interviewerName: 'Reynaldo',
  scheduledAt: '', duration: '60', type: 'technical', status: 'scheduled',
  recommendation: '', overallScore: '', scorecardId: '', notes: '',
}

export function Interviews() {
  const { interviews, candidates, clients, hiringRoles, scorecards, addInterview, updateInterview } = useStore()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Interview | null>(null)
  const [form, setForm] = useState<ItvForm>(emptyForm)

  const upcoming = useMemo(
    () =>
      interviews
        .filter((i) => i.status === 'scheduled' && !isInPast(i.scheduledAt))
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [interviews]
  )

  const past = useMemo(
    () =>
      interviews
        .filter((i) => i.status !== 'scheduled' || isInPast(i.scheduledAt))
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [interviews]
  )

  const clientCandidates = useMemo(
    () => candidates.filter((c) => !form.clientId || c.clientId === form.clientId),
    [candidates, form.clientId]
  )

  function openAdd() {
    setEditTarget(null)
    setForm({ ...emptyForm, clientId: clients[0]?.id ?? '', candidateId: '' })
    setModalOpen(true)
  }

  function openEdit(i: Interview) {
    setEditTarget(i)
    setForm({
      candidateId: i.candidateId,
      clientId: i.clientId,
      interviewerName: i.interviewerName,
      scheduledAt: i.scheduledAt.slice(0, 16),
      duration: String(i.duration),
      type: i.type,
      status: i.status,
      recommendation: i.recommendation ?? '',
      overallScore: i.overallScore?.toString() ?? '',
      scorecardId: i.scorecardId ?? '',
      notes: i.notes ?? '',
    })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.candidateId || !form.scheduledAt) return
    const roleId = candidates.find((c) => c.id === form.candidateId)?.roleId ??
      hiringRoles.find((r) => r.clientId === form.clientId)?.id ?? ''
    const data: Partial<Interview> = {
      candidateId: form.candidateId,
      clientId: form.clientId,
      roleId,
      interviewerName: form.interviewerName,
      scheduledAt: form.scheduledAt,
      duration: Number(form.duration),
      type: form.type,
      status: form.status,
      recommendation: form.recommendation || undefined,
      overallScore: form.overallScore ? Number(form.overallScore) : undefined,
      scorecardId: form.scorecardId || undefined,
      notes: form.notes || undefined,
    }
    if (editTarget) {
      updateInterview(editTarget.id, data)
    } else {
      addInterview({ id: generateId('interview'), ...data } as Interview)
    }
    setModalOpen(false)
  }

  const set = (k: keyof ItvForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => {
      const next = { ...f, [k]: e.target.value }
      if (k === 'clientId') next.candidateId = ''
      return next
    })

  const currentList = tab === 'upcoming' ? upcoming : past

  function InterviewCard({ interview }: { interview: Interview }) {
    const candidate = candidates.find((c) => c.id === interview.candidateId)
    const client = clients.find((c) => c.id === interview.clientId)
    const role = hiringRoles.find((r) => r.id === interview.roleId)

    return (
      <Card padding={false}>
        <div className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            {interview.status === 'completed' ? (
              <CheckCircle size={18} className="text-emerald-500" />
            ) : interview.status === 'cancelled' || interview.status === 'no-show' ? (
              <XCircle size={18} className="text-slate-400" />
            ) : (
              <Clock size={18} className="text-sky-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-semibold text-slate-900 text-sm">{candidate?.name ?? 'Unknown'}</p>
              <InterviewTypeBadge type={interview.type} />
              <InterviewStatusBadge status={interview.status} />
              {interview.recommendation && (
                <RecommendationBadge rec={interview.recommendation} />
              )}
            </div>
            <p className="text-xs text-slate-500">
              {client?.companyName}
              {role ? ` · ${role.roleName}` : ''}
              {' · '}{interview.interviewerName}
              {' · '}{interview.duration} min
            </p>
            {interview.notes && (
              <p className="text-xs text-slate-400 mt-1 italic truncate">{interview.notes}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-medium text-slate-700">{formatDateTime(interview.scheduledAt)}</p>
            {interview.overallScore !== undefined && (
              <p className="text-xs text-slate-500 mt-0.5">
                Score: <span className="font-bold text-slate-700">{interview.overallScore.toFixed(1)}</span>/5
              </p>
            )}
          </div>
          <button
            onClick={() => openEdit(interview)}
            className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <Pencil size={14} />
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <TopBar
        title="Interviews"
        subtitle={`${upcoming.length} upcoming · ${past.length} past`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus size={14} /> Schedule Interview
          </Button>
        }
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 mb-5">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer capitalize flex items-center gap-1.5 ${
                tab === t
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${tab === t ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
                {t === 'upcoming' ? upcoming.length : past.length}
              </span>
            </button>
          ))}
        </div>

        {currentList.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={tab === 'upcoming' ? 'No upcoming interviews' : 'No past interviews'}
            description={tab === 'upcoming' ? 'Schedule the next interview to get started.' : 'Completed and cancelled interviews will appear here.'}
            action={tab === 'upcoming' ? <Button size="sm" onClick={openAdd}><Plus size={14} />Schedule Interview</Button> : undefined}
          />
        ) : (
          <div className="space-y-2">
            {currentList.map((i) => <InterviewCard key={i.id} interview={i} />)}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Interview' : 'Schedule Interview'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>{editTarget ? 'Save Changes' : 'Schedule'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Client</label>
              <select className={inputCls} value={form.clientId} onChange={set('clientId')}>
                <option value="">Select client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Candidate *</label>
              <select className={inputCls} value={form.candidateId} onChange={set('candidateId')}>
                <option value="">Select candidate</option>
                {clientCandidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Interviewer</label>
              <select className={inputCls} value={form.interviewerName} onChange={set('interviewerName')}>
                {TEAM.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={set('type')}>
                {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Date & Time *</label>
              <input className={inputCls} type="datetime-local" value={form.scheduledAt} onChange={set('scheduledAt')} />
            </div>
            <div>
              <label className={labelCls}>Duration (minutes)</label>
              <input className={inputCls} type="number" value={form.duration} onChange={set('duration')} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Scorecard</label>
              <select className={inputCls} value={form.scorecardId} onChange={set('scorecardId')}>
                <option value="">None</option>
                {scorecards.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {(form.status === 'completed') && (
              <>
                <div>
                  <label className={labelCls}>Recommendation</label>
                  <select className={inputCls} value={form.recommendation} onChange={set('recommendation')}>
                    <option value="">None</option>
                    {RECS.map((r) => <option key={r} value={r}>{r.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Overall Score (1–5)</label>
                  <input className={inputCls} type="number" min="1" max="5" step="0.1" value={form.overallScore} onChange={set('overallScore')} placeholder="4.5" />
                </div>
              </>
            )}
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.notes} onChange={set('notes')} placeholder="Focus areas, observations..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
