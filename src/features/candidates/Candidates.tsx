import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { CandidateStatusBadge } from '../../components/shared/StatusBadge'
import { EmptyState } from '../../components/shared/EmptyState'
import { useStore } from '../../store/useStore'
import type { Candidate, CandidateStatus, Seniority, EnglishLevel } from '../../types'
import { generateId } from '../../lib/utils'

type Form = Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>

const emptyForm = (companyId = '', hiringNeedId = ''): Form => ({
  companyId,
  hiringNeedId,
  name: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  location: '',
  englishLevel: 'intermediate',
  seniority: 'mid',
  mainStack: [],
  status: 'received',
  notes: '',
})

export function Candidates() {
  const companies = useStore((s) => s.companies)
  const hiringNeeds = useStore((s) => s.hiringNeeds)
  const candidates = useStore((s) => s.candidates)
  const addCandidate = useStore((s) => s.addCandidate)
  const updateCandidate = useStore((s) => s.updateCandidate)
  const deleteCandidate = useStore((s) => s.deleteCandidate)

  const clients = companies.filter((c) => c.status === 'closed_won')
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))
  const needMap = Object.fromEntries(hiringNeeds.map((h) => [h.id, h]))

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Candidate | null>(null)
  const [form, setForm] = useState<Form>(emptyForm())

  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || c.status === filterStatus
    const matchCompany = !filterCompany || c.companyId === filterCompany
    return matchSearch && matchStatus && matchCompany
  })

  function openAdd() {
    setEditing(null)
    setForm(emptyForm(clients[0]?.id ?? '', hiringNeeds[0]?.id ?? ''))
    setOpen(true)
  }

  function openEdit(c: Candidate) {
    setEditing(c)
    setForm({ ...c })
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    if (editing) {
      updateCandidate(editing.id, form)
    } else {
      addCandidate({ ...form, id: generateId('ca') } as Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>)
    }
    setOpen(false)
  }

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const needsForCompany = hiringNeeds.filter((h) => h.companyId === form.companyId)

  const STATUSES: CandidateStatus[] = [
    'received', 'pending_review', 'interview_scheduled', 'interview_completed',
    'recommended', 'not_recommended', 'on_hold', 'sent_to_client',
  ]

  return (
    <div className="flex flex-col">
      <TopBar
        title="Candidates"
        subtitle={`${filtered.length} candidates`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Candidate
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-8" placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-44">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </Select>
          <Select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-44">
            <option value="">All Clients</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No candidates found" action={{ label: 'Add Candidate', onClick: openAdd }} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Stack</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-700" onClick={() => openEdit(c)}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{c.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{c.location ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{companyMap[c.companyId]?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{needMap[c.hiringNeedId]?.roleTitle ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{c.mainStack.slice(0, 3).join(', ')}</td>
                    <td className="px-4 py-3"><CandidateStatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500 capitalize dark:text-slate-400">{c.seniority ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Candidate' : 'Add Candidate'} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label>Full Name *</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1">
            <Label>Client *</Label>
            <Select value={form.companyId} onChange={(e) => { set('companyId', e.target.value); set('hiringNeedId', '') }}>
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Hiring Need *</Label>
            <Select value={form.hiringNeedId} onChange={(e) => set('hiringNeedId', e.target.value)}>
              <option value="">Select role...</option>
              {needsForCompany.map((h) => <option key={h.id} value={h.id}>{h.roleTitle}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>LinkedIn</Label>
            <Input value={form.linkedin ?? ''} onChange={(e) => set('linkedin', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>GitHub</Label>
            <Input value={form.github ?? ''} onChange={(e) => set('github', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Location</Label>
            <Input value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" />
          </div>
          <div className="space-y-1">
            <Label>English Level</Label>
            <Select value={form.englishLevel ?? ''} onChange={(e) => set('englishLevel', e.target.value as EnglishLevel)}>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="fluent">Fluent</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Seniority</Label>
            <Select value={form.seniority ?? ''} onChange={(e) => set('seniority', e.target.value as Seniority)}>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="architect">Architect</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as CandidateStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Main Stack (comma-separated)</Label>
            <Input value={form.mainStack.join(', ')} onChange={(e) => set('mainStack', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Notes</Label>
            <Textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteCandidate(editing.id); setOpen(false) }}>Delete</Button>
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
