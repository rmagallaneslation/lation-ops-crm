import { useState } from 'react'
import { Plus, Search, ExternalLink, Eye, Columns } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
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
  prospect:   'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  available:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  in_process: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  placed:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  inactive:   'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

const STATUS_LABELS: Record<TalentStatus, string> = {
  prospect:   'Prospecto',
  available:  'Available',
  in_process: 'In Process',
  placed:     'Placed',
  inactive:   'Inactive',
}

const LEVEL_COLORS: Record<TalentLevel, string> = {
  junior:    'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  mid:       'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  senior:    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  lead:      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  architect: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

type ColKey = 'name' | 'country' | 'level' | 'specialization' | 'stack' | 'status' | 'links'

const ALL_COLUMNS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: 'name',           label: 'Nombre',          defaultVisible: true },
  { key: 'country',        label: 'País',             defaultVisible: true },
  { key: 'level',          label: 'Nivel',            defaultVisible: true },
  { key: 'specialization', label: 'Especialización',  defaultVisible: true },
  { key: 'stack',          label: 'Stack',            defaultVisible: true },
  { key: 'status',         label: 'Status',           defaultVisible: true },
  { key: 'links',          label: 'Links',            defaultVisible: true },
]

function getStoredCols(): Set<ColKey> {
  try {
    const raw = localStorage.getItem('lation-talent-cols')
    if (raw) return new Set(JSON.parse(raw) as ColKey[])
  } catch { /* ignore */ }
  return new Set(ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.key))
}

type Form = Omit<Talent, 'id' | 'created_at' | 'updated_at'>

const empty = (): Form => ({
  full_name: '', email: '', phone: '', country: '', timezone: '',
  tech_stack: [], languages: ['Spanish', 'English'], level: 'mid',
  years_of_experience: 2, specialization: 'Full Stack',
  cv_url: '', linkedin_url: '', available_from: '', employment_type: 'full_time',
  preferred_salary_min: undefined, preferred_salary_max: undefined,
  preferred_salary_currency: 'USD', status: 'available',
})

export function Talents() {
  const talents = useLationStore((s) => s.talents)
  const addTalent = useLationStore((s) => s.addTalent)
  const updateTalent = useLationStore((s) => s.updateTalent)
  const deleteTalent = useLationStore((s) => s.deleteTalent)

  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Talent | null>(null)
  const [form, setForm] = useState<Form>(empty())
  const [confirmDelete, setConfirmDelete] = useState<Talent | null>(null)
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(getStoredCols)
  const [colMenuOpen, setColMenuOpen] = useState(false)

  function toggleCol(key: ColKey) {
    if (key === 'name') return
    setVisibleCols((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size <= 1) return prev
        next.delete(key)
      } else {
        next.add(key)
      }
      localStorage.setItem('lation-talent-cols', JSON.stringify([...next]))
      return next
    })
  }

  // Unique values for filter dropdowns
  const countries = [...new Set(talents.map((t) => t.country))].sort()
  const specializations = [...new Set(talents.map((t) => t.specialization))].sort()

  const filtered = talents.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      t.full_name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.specialization.toLowerCase().includes(q) ||
      t.tech_stack.some((s) => s.toLowerCase().includes(q))
    return matchSearch &&
      (!filterStatus || t.status === filterStatus) &&
      (!filterLevel || t.level === filterLevel) &&
      (!filterCountry || t.country === filterCountry) &&
      (!filterSpecialization || t.specialization === filterSpecialization)
  })

  function openAdd() { setEditing(null); setForm(empty()); setOpen(true) }
  function openEdit(t: Talent) { setEditing(t); setForm({ ...t }); setOpen(true) }
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm((f) => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.full_name.trim() || !form.email.trim() || !form.country.trim() || !form.specialization.trim()) return
    if (editing) { updateTalent(editing.id, form); toast.success('Talento actualizado') }
    else { addTalent(form); toast.success('Talento agregado') }
    setOpen(false)
  }

  function handleDeleteConfirm() {
    if (!confirmDelete) return
    deleteTalent(confirmDelete.id)
    toast.success('Talento eliminado')
    setConfirmDelete(null)
    setOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Talent Pool"
        subtitle={`${filtered.length} of ${talents.length} talents`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Talent
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search name, email, stack…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="">All Statuses</option>
            <option value="prospect">Prospecto</option>
            <option value="available">Available</option>
            <option value="in_process">In Process</option>
            <option value="placed">Placed</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-36">
            <option value="">All Levels</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="architect">Architect</option>
          </Select>
          <Select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="w-40">
            <option value="">All Countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={filterSpecialization} onChange={(e) => setFilterSpecialization(e.target.value)} className="w-44">
            <option value="">All Specializations</option>
            {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>

          {/* Column visibility toggle */}
          <div className="relative">
            <button
              onClick={() => setColMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <Columns className="h-3.5 w-3.5" />
              Columnas
            </button>
            {colMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setColMenuOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {ALL_COLUMNS.map((col) => (
                    <label
                      key={col.key}
                      className="flex cursor-pointer items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols.has(col.key)}
                        onChange={() => toggleCol(col.key)}
                        disabled={col.key === 'name'}
                        className="h-3.5 w-3.5 rounded accent-orange-500 disabled:opacity-50"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300">{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState title="No talents found" action={{ label: 'Add Talent', onClick: openAdd }} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  {ALL_COLUMNS.filter(c => visibleCols.has(c.key)).map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-700/50 transition-colors"
                    onClick={() => openEdit(t)}
                  >
                    {visibleCols.has('name') && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                            {t.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{t.full_name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{t.email}</p>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleCols.has('country') && (
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t.country}</td>
                    )}
                    {visibleCols.has('level') && (
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${LEVEL_COLORS[t.level]}`}>
                          {t.level}
                        </span>
                      </td>
                    )}
                    {visibleCols.has('specialization') && (
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t.specialization}</td>
                    )}
                    {visibleCols.has('stack') && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {t.tech_stack.slice(0, 3).map((tech) => (
                            <span key={tech} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              {tech}
                            </span>
                          ))}
                          {t.tech_stack.length > 3 && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                              +{t.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                    {visibleCols.has('status') && (
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                          {STATUS_LABELS[t.status]}
                        </span>
                      </td>
                    )}
                    {visibleCols.has('links') && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {t.cv_url ? (
                            <a href={t.cv_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                              <ExternalLink className="h-3 w-3" /> CV
                            </a>
                          ) : <span className="text-xs text-slate-300 dark:text-slate-600">—</span>}
                          {t.linkedin_url && (
                            <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                              <ExternalLink className="h-3 w-3" /> LI
                            </a>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/talents/${t.id}`)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-600 transition-colors"
                        title="Ver perfil"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Talent' : 'Add Talent'}
        className="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Required fields */}
          <div className="col-span-2 space-y-1">
            <Label>Full Name *</Label>
            <Input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Country *</Label>
            <Input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Mexico, Colombia…" />
          </div>
          <div className="space-y-1">
            <Label>Level *</Label>
            <Select value={form.level} onChange={(e) => set('level', e.target.value as TalentLevel)}>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="architect">Architect</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Specialization *</Label>
            <Input value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Frontend, Backend, Full Stack…" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Tech Stack * (comma-separated)</Label>
            <Input
              value={form.tech_stack.join(', ')}
              onChange={(e) => set('tech_stack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="React, TypeScript, Node.js…"
            />
          </div>

          {/* Optional fields */}
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Timezone</Label>
            <Input value={form.timezone ?? ''} onChange={(e) => set('timezone', e.target.value)} placeholder="CST, CET, BRT…" />
          </div>
          <div className="space-y-1">
            <Label>Years of Experience</Label>
            <Input type="number" min={0} value={form.years_of_experience} onChange={(e) => set('years_of_experience', Number(e.target.value))} />
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
            <Label>Available From</Label>
            <Input type="date" value={form.available_from ?? ''} onChange={(e) => set('available_from', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as TalentStatus)}>
              <option value="prospect">Prospecto</option>
              <option value="available">Available</option>
              <option value="in_process">In Process</option>
              <option value="placed">Placed</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Preferred Salary Min</Label>
            <Input type="number" value={form.preferred_salary_min ?? ''} onChange={(e) => set('preferred_salary_min', e.target.value ? Number(e.target.value) : undefined)} placeholder="3000" />
          </div>
          <div className="space-y-1">
            <Label>Preferred Salary Max</Label>
            <Input type="number" value={form.preferred_salary_max ?? ''} onChange={(e) => set('preferred_salary_max', e.target.value ? Number(e.target.value) : undefined)} placeholder="5000" />
          </div>
          <div className="space-y-1">
            <Label>Salary Currency</Label>
            <Select value={form.preferred_salary_currency} onChange={(e) => set('preferred_salary_currency', e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
            </Select>
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
            <Label>CV URL (Google Drive or similar)</Label>
            <Input value={form.cv_url ?? ''} onChange={(e) => set('cv_url', e.target.value)} placeholder="https://drive.google.com/…" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>LinkedIn URL</Label>
            <Input
              value={form.linkedin_url ?? ''}
              onChange={(e) => set('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          {editing && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmDelete(editing)}
            >
              Delete
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Talent"
        className="max-w-sm"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Delete <span className="font-semibold text-slate-900 dark:text-slate-100">{confirmDelete?.full_name}</span>? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>Yes, Delete</Button>
        </div>
      </Dialog>
    </div>
  )
}
