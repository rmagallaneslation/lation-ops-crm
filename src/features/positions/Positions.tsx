import { useState } from 'react'
import { Plus, Search, DollarSign, MapPin } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { EmptyState } from '../../components/shared/EmptyState'
import { useLationStore } from '../../store/useLationStore'
import type { Position, PositionStatus, TalentLevel, WorkLocation, ContractType } from '../../types/lation'

const STATUS_COLORS: Record<PositionStatus, string> = {
  open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  filled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  closed: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

const LEVEL_COLORS: Record<TalentLevel, string> = {
  junior: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  mid: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  senior: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  lead: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  architect: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

type Form = Omit<Position, 'id' | 'created_at' | 'updated_at'>

const empty = (): Form => ({
  employer_id: '', title: '', description: '', level: 'mid',
  specialization: '', required_skills: [], languages_required: ['English'],
  salary_min: undefined, salary_max: undefined, currency: 'USD',
  work_location: 'remote', contract_type: 'full_time',
  status: 'open', posted_date: new Date().toISOString().slice(0, 10), deadline: '',
})

export function Positions() {
  const positions = useLationStore((s) => s.positions)
  const employers = useLationStore((s) => s.employers)
  const applications = useLationStore((s) => s.applications)
  const addPosition = useLationStore((s) => s.addPosition)
  const updatePosition = useLationStore((s) => s.updatePosition)
  const deletePosition = useLationStore((s) => s.deletePosition)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterEmployer, setFilterEmployer] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Position | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Position | null>(null)
  const [form, setForm] = useState<Form>(empty())

  const employerMap = Object.fromEntries(employers.map((e) => [e.id, e]))
  const appCountMap = Object.fromEntries(
    positions.map((p) => [p.id, applications.filter((a) => a.position_id === p.id).length])
  )

  const filtered = positions.filter((p) => {
    const q = search.toLowerCase()
    return (p.title.toLowerCase().includes(q) ||
      p.specialization.toLowerCase().includes(q) ||
      (employerMap[p.employer_id]?.company_name ?? '').toLowerCase().includes(q)) &&
      (!filterStatus || p.status === filterStatus) &&
      (!filterEmployer || p.employer_id === filterEmployer) &&
      (!filterLevel || p.level === filterLevel)
  })

  function openAdd() { setEditing(null); setForm(empty()); setOpen(true) }
  function openEdit(p: Position) { setEditing(p); setForm({ ...p }); setOpen(true) }
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm((f) => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.title.trim() || !form.employer_id) return
    if (editing) updatePosition(editing.id, form)
    else addPosition(form)
    setOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Positions"
        subtitle={`${filtered.length} position${filtered.length !== 1 ? 's' : ''}`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Position
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search title, specialization, employer…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterEmployer} onChange={(e) => setFilterEmployer(e.target.value)} className="w-44">
            <option value="">All Employers</option>
            {employers.map((e) => <option key={e.id} value={e.id}>{e.company_name}</option>)}
          </Select>
          <Select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-32">
            <option value="">All Levels</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="architect">Architect</option>
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-36">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="filled">Filled</option>
            <option value="closed">Closed</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No positions found" action={{ label: 'Add Position', onClick: openAdd }} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  {['Title', 'Employer', 'Level', 'Specialization', 'Salary', 'Apps', 'Deadline', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((p) => {
                  const employer = employerMap[p.employer_id]
                  const appCount = appCountMap[p.id] ?? 0
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-700/50 transition-colors" onClick={() => openEdit(p)}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{p.title}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />{p.work_location.replace('_', ' ')}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{employer?.company_name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${LEVEL_COLORS[p.level]}`}>
                          {p.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.specialization}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                        {(p.salary_min || p.salary_max) ? (
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="h-3 w-3" />
                            {p.salary_min?.toLocaleString()}–{p.salary_max?.toLocaleString()}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${appCount > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {appCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{p.deadline || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[p.status]}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Position' : 'Add Position'} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label>Job Title *</Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Senior React Developer" />
          </div>
          <div className="space-y-1">
            <Label>Employer *</Label>
            <Select value={form.employer_id} onChange={(e) => set('employer_id', e.target.value)}>
              <option value="">Select employer…</option>
              {employers.map((e) => <option key={e.id} value={e.id}>{e.company_name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Level</Label>
            <Select value={form.level} onChange={(e) => set('level', e.target.value as TalentLevel)}>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="architect">Architect</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Specialization</Label>
            <Input value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Frontend, Backend…" />
          </div>
          <div className="space-y-1">
            <Label>Work Location</Label>
            <Select value={form.work_location} onChange={(e) => set('work_location', e.target.value as WorkLocation)}>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on_site">On Site</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Contract Type</Label>
            <Select value={form.contract_type} onChange={(e) => set('contract_type', e.target.value as ContractType)}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as PositionStatus)}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="filled">Filled</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Min Salary</Label>
            <Input type="number" value={form.salary_min ?? ''} onChange={(e) => set('salary_min', e.target.value ? Number(e.target.value) : undefined)} placeholder="3000" />
          </div>
          <div className="space-y-1">
            <Label>Max Salary</Label>
            <Input type="number" value={form.salary_max ?? ''} onChange={(e) => set('salary_max', e.target.value ? Number(e.target.value) : undefined)} placeholder="5000" />
          </div>
          <div className="space-y-1">
            <Label>Currency</Label>
            <Select value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Deadline</Label>
            <Input type="date" value={form.deadline ?? ''} onChange={(e) => set('deadline', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Required Skills (comma-separated)</Label>
            <Input
              value={form.required_skills.join(', ')}
              onChange={(e) => set('required_skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="React, TypeScript, Node.js…"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Languages Required (comma-separated)</Label>
            <Input
              value={form.languages_required.join(', ')}
              onChange={(e) => set('languages_required', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Description</Label>
            <Textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { setOpen(false); setConfirmDelete(editing) }}>Delete</Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Position">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Delete <span className="font-semibold">{confirmDelete?.title}</span>? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={() => { deletePosition(confirmDelete!.id); setConfirmDelete(null) }}>Yes, Delete</Button>
        </div>
      </Dialog>
    </div>
  )
}
