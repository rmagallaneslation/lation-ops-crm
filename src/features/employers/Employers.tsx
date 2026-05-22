import { useState } from 'react'
import { Plus, Search, Globe, Phone, Mail } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { EmptyState } from '../../components/shared/EmptyState'
import { useLationStore } from '../../store/useLationStore'
import type { Employer, EmployerStatus, EmployerType } from '../../types/lation'

const STATUS_COLORS: Record<EmployerStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  prospect: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  inactive: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

type Form = Omit<Employer, 'id' | 'created_at' | 'updated_at'>

const empty = (): Form => ({
  company_name: '', industry: '', country: '', email: '',
  phone: '', website: '', contact_name: '', contact_email: '',
  contact_phone: '', employer_type: 'hiring_company', status: 'active',
})

export function Employers() {
  const employers = useLationStore((s) => s.employers)
  const positions = useLationStore((s) => s.positions)
  const addEmployer = useLationStore((s) => s.addEmployer)
  const updateEmployer = useLationStore((s) => s.updateEmployer)
  const deleteEmployer = useLationStore((s) => s.deleteEmployer)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Employer | null>(null)
  const [form, setForm] = useState<Form>(empty())

  const filtered = employers.filter((e) => {
    const q = search.toLowerCase()
    return (e.company_name.toLowerCase().includes(q) ||
      e.industry.toLowerCase().includes(q) ||
      e.contact_name.toLowerCase().includes(q)) &&
      (!filterStatus || e.status === filterStatus)
  })

  function openAdd() { setEditing(null); setForm(empty()); setOpen(true) }
  function openEdit(e: Employer) { setEditing(e); setForm({ ...e }); setOpen(true) }
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm((f) => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.company_name.trim()) return
    if (editing) updateEmployer(editing.id, form)
    else addEmployer(form)
    setOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Employers"
        subtitle={`${filtered.length} employer${filtered.length !== 1 ? 's' : ''}`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Employer
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Search company, industry, contact…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No employers found" action={{ label: 'Add Employer', onClick: openAdd }} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  {['Company', 'Industry', 'Country', 'Contact', 'Open Positions', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((e) => {
                  const openPos = positions.filter((p) => p.employer_id === e.id && p.status === 'open').length
                  return (
                    <tr key={e.id} className="hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-700/50 transition-colors" onClick={() => openEdit(e)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white">
                            {e.company_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{e.company_name}</p>
                            {e.website && (
                              <a href={e.website} target="_blank" rel="noopener noreferrer"
                                onClick={(ev) => ev.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                                <Globe className="h-3 w-3" /> website
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{e.industry}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{e.country}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{e.contact_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {e.contact_email && (
                            <a href={`mailto:${e.contact_email}`} onClick={(ev) => ev.stopPropagation()}
                              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors">
                              <Mail className="h-3 w-3" />
                            </a>
                          )}
                          {e.contact_phone && (
                            <a href={`tel:${e.contact_phone}`} onClick={(ev) => ev.stopPropagation()}
                              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors">
                              <Phone className="h-3 w-3" />
                            </a>
                          )}
                          <span className="text-xs text-slate-400">{e.contact_email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${openPos > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {openPos}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[e.status]}`}>
                          {e.status}
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

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Employer' : 'Add Employer'} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label>Company Name *</Label>
            <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} placeholder="Accenture" />
          </div>
          <div className="space-y-1">
            <Label>Industry</Label>
            <Input value={form.industry} onChange={(e) => set('industry', e.target.value)} placeholder="Fintech, Consulting…" />
          </div>
          <div className="space-y-1">
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="USA, Mexico…" />
          </div>
          <div className="space-y-1">
            <Label>Company Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Website</Label>
            <Input type="url" value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-1">
            <Label>Contact Name</Label>
            <Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Contact Email</Label>
            <Input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Contact Phone</Label>
            <Input value={form.contact_phone ?? ''} onChange={(e) => set('contact_phone', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Employer Type</Label>
            <Select value={form.employer_type} onChange={(e) => set('employer_type', e.target.value as EmployerType)}>
              <option value="hiring_company">Hiring Company</option>
              <option value="talent_source">Talent Source</option>
              <option value="both">Both</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as EmployerStatus)}>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { deleteEmployer(editing.id); setOpen(false) }}>Delete</Button>
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
