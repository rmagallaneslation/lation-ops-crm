import { useState } from 'react'
import { Plus, Search, TrendingUp, DollarSign, CheckCircle } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { EmptyState } from '../../components/shared/EmptyState'
import { useLationStore } from '../../store/useLationStore'
import type { Placement, PlacementStatus } from '../../types/lation'

const STATUS_COLORS: Record<PlacementStatus, string> = {
  placed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  extended: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
}

type Form = Omit<Placement, 'id' | 'created_at' | 'updated_at'>

const empty = (): Form => ({
  talent_id: '', position_id: '', employer_id: '', application_id: '',
  start_date: new Date().toISOString().slice(0, 10), end_date: '',
  final_salary: 0, commission_type: 'percentage', commission_percentage: 15,
  commission_fixed_fee: 0, commission_amount: 0, currency: 'USD',
  status: 'placed', notes: '',
})

export function Placements() {
  const placements = useLationStore((s) => s.placements)
  const talents = useLationStore((s) => s.talents)
  const positions = useLationStore((s) => s.positions)
  const employers = useLationStore((s) => s.employers)
  const applications = useLationStore((s) => s.applications)
  const addPlacement = useLationStore((s) => s.addPlacement)
  const updatePlacement = useLationStore((s) => s.updatePlacement)
  const deletePlacement = useLationStore((s) => s.deletePlacement)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Placement | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Placement | null>(null)
  const [form, setForm] = useState<Form>(empty())

  const talentMap = Object.fromEntries(talents.map((t) => [t.id, t]))
  const positionMap = Object.fromEntries(positions.map((p) => [p.id, p]))
  const employerMap = Object.fromEntries(employers.map((e) => [e.id, e]))

  const filtered = placements.filter((p) => {
    const q = search.toLowerCase()
    const talent = talentMap[p.talent_id]
    const position = positionMap[p.position_id]
    const employer = employerMap[p.employer_id]
    return (!q || talent?.full_name.toLowerCase().includes(q) ||
      position?.title.toLowerCase().includes(q) ||
      employer?.company_name.toLowerCase().includes(q)) &&
      (!filterStatus || p.status === filterStatus)
  })

  const totalCommission = placements.reduce((sum, p) => sum + p.commission_amount, 0)
  const activeCount = placements.filter((p) => p.status === 'placed').length
  const completedCount = placements.filter((p) => p.status === 'completed').length

  function openAdd() { setEditing(null); setForm(empty()); setOpen(true) }
  function openEdit(p: Placement) { setEditing(p); setForm({ ...p }); setOpen(true) }
  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => {
      const next = { ...f, [k]: v }
      if (k === 'final_salary' || k === 'commission_percentage') {
        next.commission_amount = Math.round(Number(next.final_salary) * Number(next.commission_percentage) / 100)
      }
      return next
    })
  }

  function handleSave() {
    if (!form.talent_id || !form.employer_id || !form.position_id || !form.application_id) return
    if (editing) updatePlacement(editing.id, form)
    else addPlacement(form)
    setOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Placements"
        subtitle={`${filtered.length} placement${filtered.length !== 1 ? 's' : ''}`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Placement
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completedCount}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Total Commission</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              ${totalCommission.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search talent, position, employer…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="completed">Completed</option>
            <option value="extended">Extended</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No placements yet" action={{ label: 'Add Placement', onClick: openAdd }} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  {['Talent', 'Position', 'Employer', 'Start', 'Salary', 'Commission', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((p) => {
                  const talent = talentMap[p.talent_id]
                  const position = positionMap[p.position_id]
                  const employer = employerMap[p.employer_id]
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-700/50 transition-colors" onClick={() => openEdit(p)}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{talent?.full_name ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{position?.title ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{employer?.company_name ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{p.start_date}</td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        ${p.final_salary.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ${p.commission_amount.toLocaleString()}
                        </span>
                        <span className="ml-1 text-xs text-slate-400">({p.commission_percentage}%)</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[p.status]}`}>
                          {p.status}
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

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Placement' : 'Add Placement'} className="max-w-lg">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Talent *</Label>
            <Select value={form.talent_id} onChange={(e) => set('talent_id', e.target.value)}>
              <option value="">Select talent…</option>
              {talents.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Employer *</Label>
            <Select value={form.employer_id} onChange={(e) => set('employer_id', e.target.value)}>
              <option value="">Select employer…</option>
              {employers.map((e) => <option key={e.id} value={e.id}>{e.company_name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Position *</Label>
            <Select value={form.position_id} onChange={(e) => set('position_id', e.target.value)}>
              <option value="">Select position…</option>
              {positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Application *</Label>
            <Select value={form.application_id ?? ''} onChange={(e) => set('application_id', e.target.value)}>
              <option value="">Select application…</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {talentMap[a.talent_id]?.full_name ?? 'Unknown'} — {positionMap[a.position_id]?.title ?? 'Unknown'}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>End Date</Label>
              <Input type="date" value={form.end_date ?? ''} onChange={(e) => set('end_date', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Monthly Salary (USD)</Label>
              <Input type="number" value={form.final_salary} onChange={(e) => set('final_salary', Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>Commission %</Label>
              <Input type="number" min={0} max={100} step={0.5} value={form.commission_percentage} onChange={(e) => set('commission_percentage', Number(e.target.value))} />
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 dark:bg-emerald-950/20 dark:border-emerald-800/50">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Commission: <span className="text-base font-bold">${form.commission_amount.toLocaleString()}</span> / month
            </p>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as PlacementStatus)}>
              <option value="placed">Placed</option>
              <option value="completed">Completed</option>
              <option value="extended">Extended</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={2} />
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

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Placement">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Delete placement for <span className="font-semibold">{talentMap[confirmDelete?.talent_id ?? '']?.full_name ?? '—'}</span>? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={() => { deletePlacement(confirmDelete!.id); setConfirmDelete(null) }}>Yes, Delete</Button>
        </div>
      </Dialog>
    </div>
  )
}
