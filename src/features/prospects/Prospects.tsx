import { useState } from 'react'
import { Plus, Search, ExternalLink } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Card, CardContent } from '../../components/ui/card'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { CompanyStatusBadge, PriorityBadge } from '../../components/shared/StatusBadge'
import { EmptyState } from '../../components/shared/EmptyState'
import { useStore } from '../../store/useStore'
import { formatDate } from '../../lib/formatters'
import type { Company, CompanyStatus, Priority, TeamMember } from '../../types'
import { generateId } from '../../lib/utils'

const STATUSES: CompanyStatus[] = [
  'new_lead', 'researching', 'contacted', 'responded',
  'discovery_scheduled', 'proposal_sent', 'negotiation', 'nurturing',
]
const PRIORITIES: Priority[] = ['high', 'medium', 'low']
const OWNERS: TeamMember[] = ['Roberto', 'Reynaldo', 'Santiago']
const INDUSTRIES = ['Fintech', 'SaaS', 'E-commerce', 'HealthTech', 'Cloud Infrastructure', 'Data & AI', 'Cybersecurity', 'Digital Marketing', 'Energy Tech', 'Other']

type Form = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>

const emptyForm = (): Form => ({
  name: '',
  industry: 'SaaS',
  country: '',
  city: '',
  companySize: '',
  website: '',
  linkedin: '',
  status: 'new_lead',
  priority: 'medium',
  contactName: '',
  contactRole: '',
  contactEmail: '',
  contactPhone: '',
  source: '',
  painPoints: '',
  hiringNeeds: '',
  estimatedDealValue: undefined,
  closeProbability: undefined,
  notes: '',
  nextFollowUpDate: '',
  owner: 'Roberto',
})

export function Prospects() {
  const companies = useStore((s) => s.companies)
  const addCompany = useStore((s) => s.addCompany)
  const updateCompany = useStore((s) => s.updateCompany)
  const deleteCompany = useStore((s) => s.deleteCompany)

  const prospects = companies.filter((c) => c.status !== 'closed_won')

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterOwner, setFilterOwner] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Company | null>(null)
  const [form, setForm] = useState<Form>(emptyForm())

  const filtered = prospects.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.contactName ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || c.status === filterStatus
    const matchOwner = !filterOwner || c.owner === filterOwner
    return matchSearch && matchStatus && matchOwner
  })

  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setOpen(true)
  }

  function openEdit(c: Company) {
    setEditing(c)
    setForm({ ...c })
    setOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    if (editing) {
      updateCompany(editing.id, form)
    } else {
      addCompany({ ...form, id: generateId('co') } as Omit<Company, 'id' | 'createdAt' | 'updatedAt'>)
    }
    setOpen(false)
  }

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  return (
    <div className="flex flex-col">
      <TopBar
        title="Prospects"
        subtitle={`${filtered.length} companies`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Prospect
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              placeholder="Search prospects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-44">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </Select>
          <Select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="w-36">
            <option value="">All Owners</option>
            {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No prospects found"
            description="Add your first prospect to get started"
            action={{ label: 'Add Prospect', onClick: openAdd }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEdit(c)}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.industry} · {c.city ?? ''}{c.city ? ', ' : ''}{c.country}</p>
                    </div>
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <CompanyStatusBadge status={c.status} />
                  </div>
                  {c.contactName && (
                    <p className="text-xs text-slate-600">
                      {c.contactName}{c.contactRole ? ` · ${c.contactRole}` : ''}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{c.owner}</span>
                    {c.estimatedDealValue && (
                      <span className="font-medium text-slate-600">${(c.estimatedDealValue / 1000).toFixed(0)}k</span>
                    )}
                  </div>
                  {c.nextFollowUpDate && (
                    <p className="text-xs text-orange-600">Follow-up: {formatDate(c.nextFollowUpDate)}</p>
                  )}
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Website
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Prospect' : 'Add Prospect'} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Acme Corp" />
          </div>
          <div className="space-y-1">
            <Label>Industry</Label>
            <Select value={form.industry} onChange={(e) => set('industry', e.target.value)}>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Company Size</Label>
            <Select value={form.companySize ?? ''} onChange={(e) => set('companySize', e.target.value)}>
              <option value="">—</option>
              <option>1-10</option><option>11-50</option><option>51-200</option>
              <option>201-500</option><option>501-1000</option><option>1000+</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Country *</Label>
            <Input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="USA" />
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <Input value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} placeholder="Austin" />
          </div>
          <div className="space-y-1">
            <Label>Website</Label>
            <Input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>LinkedIn</Label>
            <Input value={form.linkedin ?? ''} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/..." />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as CompanyStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Priority</Label>
            <Select value={form.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Contact Name</Label>
            <Input value={form.contactName ?? ''} onChange={(e) => set('contactName', e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1">
            <Label>Contact Role</Label>
            <Input value={form.contactRole ?? ''} onChange={(e) => set('contactRole', e.target.value)} placeholder="VP of Engineering" />
          </div>
          <div className="space-y-1">
            <Label>Contact Email</Label>
            <Input type="email" value={form.contactEmail ?? ''} onChange={(e) => set('contactEmail', e.target.value)} placeholder="jane@example.com" />
          </div>
          <div className="space-y-1">
            <Label>Contact Phone</Label>
            <Input value={form.contactPhone ?? ''} onChange={(e) => set('contactPhone', e.target.value)} placeholder="+1 ..." />
          </div>
          <div className="space-y-1">
            <Label>Estimated Deal Value ($)</Label>
            <Input type="number" value={form.estimatedDealValue ?? ''} onChange={(e) => set('estimatedDealValue', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="space-y-1">
            <Label>Close Probability (%)</Label>
            <Input type="number" min="0" max="100" value={form.closeProbability ?? ''} onChange={(e) => set('closeProbability', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="space-y-1">
            <Label>Owner</Label>
            <Select value={form.owner} onChange={(e) => set('owner', e.target.value as TeamMember)}>
              {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Next Follow-up Date</Label>
            <Input type="date" value={form.nextFollowUpDate ?? ''} onChange={(e) => set('nextFollowUpDate', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Source</Label>
            <Input value={form.source ?? ''} onChange={(e) => set('source', e.target.value)} placeholder="LinkedIn, Referral, Cold Outreach..." />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Pain Points</Label>
            <Textarea value={form.painPoints ?? ''} onChange={(e) => set('painPoints', e.target.value)} placeholder="What problems are they facing?" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Hiring Needs</Label>
            <Textarea value={form.hiringNeeds ?? ''} onChange={(e) => set('hiringNeeds', e.target.value)} placeholder="What roles are they looking to fill?" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Notes</Label>
            <Textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="Additional notes..." />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteCompany(editing.id); setOpen(false) }}>
              Delete
            </Button>
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
