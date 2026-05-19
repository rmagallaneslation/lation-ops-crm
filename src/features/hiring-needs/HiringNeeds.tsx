import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Card, CardContent } from '../../components/ui/card'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { HiringNeedStatusBadge, UrgencyBadge } from '../../components/shared/StatusBadge'
import { EmptyState } from '../../components/shared/EmptyState'
import { useStore } from '../../store/useStore'
import type { HiringNeed, HiringNeedStatus, Seniority, EnglishLevel, Urgency } from '../../types'
import { generateId } from '../../lib/utils'

type Form = Omit<HiringNeed, 'id' | 'createdAt' | 'updatedAt'>

const emptyForm = (companyId = ''): Form => ({
  companyId,
  roleTitle: '',
  seniority: 'mid',
  stack: [],
  englishLevel: 'advanced',
  urgency: 'medium',
  candidateVolume: undefined,
  jobDescription: '',
  mustHaveSkills: [],
  niceToHaveSkills: [],
  dealBreakers: [],
  status: 'active',
})

export function HiringNeeds() {
  const companies = useStore((s) => s.companies)
  const hiringNeeds = useStore((s) => s.hiringNeeds)
  const addHiringNeed = useStore((s) => s.addHiringNeed)
  const updateHiringNeed = useStore((s) => s.updateHiringNeed)
  const deleteHiringNeed = useStore((s) => s.deleteHiringNeed)

  const clients = companies.filter((c) => c.status === 'closed_won')
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<HiringNeed | null>(null)
  const [form, setForm] = useState<Form>(emptyForm())

  const filtered = hiringNeeds.filter((h) => {
    const matchSearch = h.roleTitle.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || h.status === filterStatus
    const matchCompany = !filterCompany || h.companyId === filterCompany
    return matchSearch && matchStatus && matchCompany
  })

  function openAdd() {
    setEditing(null)
    setForm(emptyForm(clients[0]?.id ?? ''))
    setOpen(true)
  }

  function openEdit(h: HiringNeed) {
    setEditing(h)
    setForm({ ...h })
    setOpen(true)
  }

  function handleSave() {
    if (!form.roleTitle.trim() || !form.companyId) return
    if (editing) {
      updateHiringNeed(editing.id, form)
    } else {
      addHiringNeed({ ...form, id: generateId('hn') } as Omit<HiringNeed, 'id' | 'createdAt' | 'updatedAt'>)
    }
    setOpen(false)
  }

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function splitList(val: string): string[] {
    return val.split(',').map((s) => s.trim()).filter(Boolean)
  }

  return (
    <div className="flex flex-col">
      <TopBar
        title="Hiring Needs"
        subtitle={`${filtered.length} roles`}
        action={
          <Button size="sm" onClick={openAdd} disabled={clients.length === 0}>
            <Plus className="h-4 w-4" /> Add Role
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            className="flex-1 min-w-48"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-36">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </Select>
          <Select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-44">
            <option value="">All Clients</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No hiring needs found" action={{ label: 'Add Role', onClick: openAdd }} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((h) => (
              <Card key={h.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openEdit(h)}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{h.roleTitle}</p>
                    <UrgencyBadge urgency={h.urgency} />
                  </div>
                  <p className="text-xs text-slate-500">{companyMap[h.companyId]?.name ?? '—'}</p>
                  <p className="text-xs text-slate-500">{h.seniority} · {h.stack.slice(0, 3).join(', ')}</p>
                  <div className="flex items-center justify-between">
                    <HiringNeedStatusBadge status={h.status} />
                    <span className="text-xs text-slate-400">Vol: {h.candidateVolume ?? '—'}</span>
                  </div>
                  <p className="text-xs text-slate-400">Must: {h.mustHaveSkills.slice(0, 2).join(', ')}{h.mustHaveSkills.length > 2 ? '...' : ''}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Hiring Need' : 'Add Hiring Need'} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label>Client *</Label>
            <Select value={form.companyId} onChange={(e) => set('companyId', e.target.value)}>
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Role Title *</Label>
            <Input value={form.roleTitle} onChange={(e) => set('roleTitle', e.target.value)} placeholder="Senior Backend Engineer" />
          </div>
          <div className="space-y-1">
            <Label>Seniority</Label>
            <Select value={form.seniority} onChange={(e) => set('seniority', e.target.value as Seniority)}>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="architect">Architect</option>
            </Select>
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
            <Label>Urgency</Label>
            <Select value={form.urgency} onChange={(e) => set('urgency', e.target.value as Urgency)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as HiringNeedStatus)}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Candidate Volume</Label>
            <Input type="number" value={form.candidateVolume ?? ''} onChange={(e) => set('candidateVolume', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Tech Stack (comma-separated)</Label>
            <Input value={form.stack.join(', ')} onChange={(e) => set('stack', splitList(e.target.value))} placeholder="React, TypeScript, Node.js" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Must-Have Skills (comma-separated)</Label>
            <Input value={form.mustHaveSkills.join(', ')} onChange={(e) => set('mustHaveSkills', splitList(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Nice-to-Have Skills (comma-separated)</Label>
            <Input value={form.niceToHaveSkills.join(', ')} onChange={(e) => set('niceToHaveSkills', splitList(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Deal Breakers (comma-separated)</Label>
            <Input value={(form.dealBreakers ?? []).join(', ')} onChange={(e) => set('dealBreakers', splitList(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Job Description</Label>
            <Textarea value={form.jobDescription ?? ''} onChange={(e) => set('jobDescription', e.target.value)} rows={4} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteHiringNeed(editing.id); setOpen(false) }}>Delete</Button>
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
