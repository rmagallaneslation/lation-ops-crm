import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { ActivityTypeBadge } from '../../components/shared/StatusBadge'
import { EmptyState } from '../../components/shared/EmptyState'
import { useStore } from '../../store/useStore'
import { formatDate, formatRelative } from '../../lib/formatters'
import type { Activity, ActivityType, TeamMember } from '../../types'
import { generateId } from '../../lib/utils'

type Form = Omit<Activity, 'id' | 'createdAt'>

const ACTIVITY_TYPES: ActivityType[] = ['call', 'email', 'linkedin', 'whatsapp', 'meeting', 'proposal', 'note', 'follow_up']
const OWNERS: TeamMember[] = ['Roberto', 'Reynaldo', 'Santiago']

const emptyForm = (companyId = ''): Form => ({
  companyId,
  type: 'call',
  owner: 'Roberto',
  date: new Date().toISOString().slice(0, 16),
  summary: '',
  nextStep: '',
})

export function Activities() {
  const companies = useStore((s) => s.companies)
  const activities = useStore((s) => s.activities)
  const addActivity = useStore((s) => s.addActivity)
  const updateActivity = useStore((s) => s.updateActivity)
  const deleteActivity = useStore((s) => s.deleteActivity)

  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))

  const [filterCompany, setFilterCompany] = useState('')
  const [filterOwner, setFilterOwner] = useState('')
  const [filterType, setFilterType] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Activity | null>(null)
  const [form, setForm] = useState<Form>(emptyForm())

  const filtered = activities
    .filter((a) => {
      const matchCompany = !filterCompany || a.companyId === filterCompany
      const matchOwner = !filterOwner || a.owner === filterOwner
      const matchType = !filterType || a.type === filterType
      return matchCompany && matchOwner && matchType
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  function openAdd() {
    setEditing(null)
    setForm(emptyForm(companies[0]?.id ?? ''))
    setOpen(true)
  }

  function openEdit(a: Activity) {
    setEditing(a)
    setForm({ ...a })
    setOpen(true)
  }

  function handleSave() {
    if (!form.summary.trim() || !form.companyId) return
    if (editing) {
      updateActivity(editing.id, form)
    } else {
      addActivity({ ...form, id: generateId('act') } as Omit<Activity, 'id' | 'createdAt'>)
    }
    setOpen(false)
  }

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const ACTIVITY_ICONS: Record<ActivityType, string> = {
    call: '📞', email: '✉️', linkedin: '💼', whatsapp: '💬',
    meeting: '🤝', proposal: '📄', note: '📝', follow_up: '🔁',
  }

  return (
    <div className="flex flex-col">
      <TopBar
        title="Activities"
        subtitle={`${filtered.length} activities`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Log Activity
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-48">
            <option value="">All Companies</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="w-36">
            <option value="">All Owners</option>
            {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-36">
            <option value="">All Types</option>
            {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No activities found" action={{ label: 'Log Activity', onClick: openAdd }} />
        ) : (
          <div className="space-y-2">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="flex gap-4 rounded-xl bg-white border border-slate-200 p-4 cursor-pointer hover:shadow-sm transition-shadow dark:bg-slate-800 dark:border-slate-700"
                onClick={() => openEdit(a)}
              >
                <div className="text-xl flex-shrink-0 mt-0.5">{ACTIVITY_ICONS[a.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ActivityTypeBadge type={a.type} />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{companyMap[a.companyId]?.name ?? '—'}</span>
                    <span className="text-xs text-slate-400">· {a.owner}</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-100">{a.summary}</p>
                  {a.nextStep && (
                    <p className="text-xs text-orange-600 mt-1">Next: {a.nextStep}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{formatDate(a.date)} · {formatRelative(a.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Activity' : 'Log Activity'}>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Company *</Label>
            <Select value={form.companyId} onChange={(e) => set('companyId', e.target.value)}>
              <option value="">Select company...</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={form.type} onChange={(e) => set('type', e.target.value as ActivityType)}>
                {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Owner</Label>
              <Select value={form.owner} onChange={(e) => set('owner', e.target.value as TeamMember)}>
                {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Date & Time</Label>
            <Input type="datetime-local" value={form.date.slice(0, 16)} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Summary *</Label>
            <Textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="What happened?" rows={3} />
          </div>
          <div className="space-y-1">
            <Label>Next Step</Label>
            <Input value={form.nextStep ?? ''} onChange={(e) => set('nextStep', e.target.value)} placeholder="What needs to happen next?" />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteActivity(editing.id); setOpen(false) }}>Delete</Button>
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
