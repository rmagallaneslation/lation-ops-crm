import { useState } from 'react'
import { Plus, Search, MapPin, Clock, Briefcase } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { EmptyState } from '../../components/shared/EmptyState'
import { useLationStore } from '../../store/useLationStore'
import type { Talent, TalentLevel, TalentStatus, EmploymentType } from '../../types/lation'

const STATUS_COLORS: Record<TalentStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  placed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  unavailable: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  reviewing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const LEVEL_COLORS: Record<TalentLevel, string> = {
  junior: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  mid: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  senior: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  lead: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  architect: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

type Form = Omit<Talent, 'id' | 'created_at' | 'updated_at'>

const empty = (): Form => ({
  full_name: '', email: '', phone: '', country: '', timezone: '',
  tech_stack: [], languages: ['Spanish', 'English'], level: 'mid',
  years_of_experience: 2, specialization: 'Full Stack',
  cv_url: '', available_from: '', employment_type: 'full_time', status: 'active',
})

export function Talents() {
  const talents = useLationStore((s) => s.talents)
  const addTalent = useLationStore((s) => s.addTalent)
  const updateTalent = useLationStore((s) => s.updateTalent)
  const deleteTalent = useLationStore((s) => s.deleteTalent)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Talent | null>(null)
  const [form, setForm] = useState<Form>(empty())

  const filtered = talents.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch = t.full_name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.specialization.toLowerCase().includes(q) ||
      t.tech_stack.some((s) => s.toLowerCase().includes(q))
    return matchSearch &&
      (!filterStatus || t.status === filterStatus) &&
      (!filterLevel || t.level === filterLevel)
  })

  function openAdd() { setEditing(null); setForm(empty()); setOpen(true) }
  function openEdit(t: Talent) { setEditing(t); setForm({ ...t }); setOpen(true) }
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm((f) => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.full_name.trim() || !form.email.trim()) return
    if (editing) updateTalent(editing.id, form)
    else addTalent(form)
    setOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Talent Pool"
        subtitle={`${filtered.length} talent${filtered.length !== 1 ? 's' : ''}`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Talent
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search name, stack, specialization…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="placed">Placed</option>
            <option value="reviewing">Reviewing</option>
            <option value="unavailable">Unavailable</option>
          </Select>
          <Select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-36">
            <option value="">All Levels</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="architect">Architect</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No talent found" action={{ label: 'Add Talent', onClick: openAdd }} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => openEdit(t)}
                className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                      {t.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">{t.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.specialization}</p>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[t.status]}`}>
                    {t.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{t.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />{t.years_of_experience}y exp
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />{t.employment_type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${LEVEL_COLORS[t.level]}`}>
                    {t.level}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {t.languages.slice(0, 2).join(' · ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {t.tech_stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {tech}
                    </span>
                  ))}
                  {t.tech_stack.length > 4 && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                      +{t.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Talent' : 'Add Talent'} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label>Full Name *</Label>
            <Input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Mexico, Colombia…" />
          </div>
          <div className="space-y-1">
            <Label>Timezone</Label>
            <Input value={form.timezone ?? ''} onChange={(e) => set('timezone', e.target.value)} placeholder="CST, CET…" />
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
            <Label>Years of Experience</Label>
            <Input type="number" min={0} value={form.years_of_experience} onChange={(e) => set('years_of_experience', Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label>Specialization</Label>
            <Input value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Frontend, Backend, Full Stack…" />
          </div>
          <div className="space-y-1">
            <Label>Employment Type</Label>
            <Select value={form.employment_type} onChange={(e) => set('employment_type', e.target.value as EmploymentType)}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as TalentStatus)}>
              <option value="active">Active</option>
              <option value="reviewing">Reviewing</option>
              <option value="placed">Placed</option>
              <option value="unavailable">Unavailable</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Available From</Label>
            <Input type="date" value={form.available_from ?? ''} onChange={(e) => set('available_from', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Tech Stack (comma-separated)</Label>
            <Input
              value={form.tech_stack.join(', ')}
              onChange={(e) => set('tech_stack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="React, TypeScript, Node.js…"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Languages (comma-separated)</Label>
            <Input
              value={form.languages.join(', ')}
              onChange={(e) => set('languages', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="Spanish, English…"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>CV URL</Label>
            <Input type="url" value={form.cv_url ?? ''} onChange={(e) => set('cv_url', e.target.value)} placeholder="https://drive.google.com/…" />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteTalent(editing.id); setOpen(false) }}>Delete</Button>
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
