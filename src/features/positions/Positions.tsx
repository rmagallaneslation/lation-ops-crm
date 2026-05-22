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
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  filled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  closed: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
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
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Position | null>(null)
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
      (!filterEmployer || p.employer_id === filterEmployer)
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
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-36">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="paused">Paused</option>
            <option value="filled">Filled</option>
            <option value="closed">Closed</option>
          </Select>
          <Select value={filterEmployer} onChange={(e) => setFilterEmployer(e.target.value)} className="w-44">
            <option value="">All Employers</option>
            {employers.map((e) => <option key={e.id} value={e.id}>{e.company_name}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No positions found" action={{ label: 'Add Position', onClick: openAdd }} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => {
              const employer = employerMap[p.employer_id]
              const appCount = appCountMap[p.id] ?? 0
              return (
                <div
                  key={p.id}
                  onClick={() => openEdit(p)}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{p.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{employer?.company_name ?? '—'}</p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{p.level}</span>
                    <span>·</span>
                    <span>{p.specialization}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{p.work_location.replace('_', ' ')}
                    </span>
                  </div>

                  {(p.salary_min || p.salary_max) && (
                    <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 mb-3">
                      <DollarSign className="h-3 w-3" />
                      {p.salary_min?.toLocaleString()} – {p.salary_max?.toLocaleString()} {p.currency}/mo
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {p.required_skills.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{s}</span>
                      ))}
                      {p.required_skills.length > 3 && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">+{p.required_skills.length - 3}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 flex-shrink-0">
                      {appCount} applicant{appCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )
            })}
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
              <option value="paused">Paused</option>
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
            <Button variant="danger" size="sm" onClick={() => { deletePosition(editing.id); setOpen(false) }}>Delete</Button>
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
