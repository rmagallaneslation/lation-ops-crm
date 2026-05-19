import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Mail, Phone, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { ClientStatusBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency, formatDate, generateId, today, getInitials } from '../lib/utils'
import type { Client, ClientStatus, TeamMember } from '../types'
import { Building2 } from 'lucide-react'

const TEAM: TeamMember[] = ['Roberto', 'Reynaldo', 'Santiago']
const INDUSTRIES = [
  'Software / FinTech', 'Cloud Infrastructure', 'SaaS / B2B', 'AI / ML',
  'E-commerce', 'Digital Agency', 'Enterprise Software', 'Data / Analytics',
  'HealthTech', 'EdTech', 'Other',
]

const avatarColors: Record<TeamMember, string> = {
  Roberto: 'bg-sky-600',
  Reynaldo: 'bg-indigo-600',
  Santiago: 'bg-emerald-600',
}

const clientBgColors = [
  'from-sky-500 to-blue-600',
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
]

interface FormState {
  companyName: string
  industry: string
  contactName: string
  contactTitle: string
  contactEmail: string
  contactPhone: string
  status: ClientStatus
  startDate: string
  monthlyValue: string
  assignedTo: TeamMember
  notes: string
}

const emptyForm: FormState = {
  companyName: '',
  industry: '',
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
  status: 'active',
  startDate: today(),
  monthlyValue: '',
  assignedTo: 'Roberto',
  notes: '',
}

const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent placeholder:text-slate-400 bg-white'
const labelCls = 'block text-xs font-medium text-slate-700 mb-1'

export function Clients() {
  const { clients, addClient, hiringRoles, candidates } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all')

  const filtered = statusFilter === 'all' ? clients : clients.filter((c) => c.status === statusFilter)

  function handleSave() {
    if (!form.companyName || !form.contactName || !form.contactEmail) return
    const client: Client = {
      id: generateId('client'),
      companyName: form.companyName,
      industry: form.industry,
      contactName: form.contactName,
      contactTitle: form.contactTitle || undefined,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone || undefined,
      status: form.status,
      startDate: form.startDate,
      monthlyValue: Number(form.monthlyValue) || 0,
      assignedTo: form.assignedTo,
      notes: form.notes,
      createdAt: today(),
    }
    addClient(client)
    setModalOpen(false)
    setForm(emptyForm)
  }

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <div>
      <TopBar
        title="Clients"
        subtitle={`${clients.filter((c) => c.status === 'active').length} active clients`}
        action={
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'all')}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="churned">Churned</option>
            </select>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus size={14} />
              Add Client
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No clients yet"
            description="Add your first client or convert a won prospect."
            action={<Button size="sm" onClick={() => setModalOpen(true)}><Plus size={14} />Add Client</Button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {filtered.map((client, idx) => {
              const roles = hiringRoles.filter((r) => r.clientId === client.id)
              const openPos = roles.reduce((s, r) => s + r.openPositions, 0)
              const activeCandidates = candidates.filter(
                (c) => c.clientId === client.id && c.status !== 'hired' && c.status !== 'rejected' && c.status !== 'withdrawn'
              )
              const initials = getInitials(client.companyName)
              const gradient = clientBgColors[idx % clientBgColors.length]

              return (
                <Link key={client.id} to={`/clients/${client.id}`}>
                  <Card padding={false} className="overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-150 cursor-pointer">
                    {/* Card header gradient */}
                    <div className={`bg-gradient-to-r ${gradient} px-5 py-4`}>
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{initials}</span>
                        </div>
                        <ClientStatusBadge status={client.status} />
                      </div>
                      <h3 className="text-white font-bold text-base mt-3 leading-tight">
                        {client.companyName}
                      </h3>
                      <p className="text-white/70 text-xs mt-0.5">{client.industry}</p>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-slate-500">Monthly Value</p>
                          <p className="text-lg font-bold text-slate-900 tabular-nums">
                            {formatCurrency(client.monthlyValue)}
                            <span className="text-xs font-normal text-slate-400">/mo</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Since</p>
                          <p className="text-sm font-medium text-slate-700">{formatDate(client.startDate)}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center py-2 px-1 bg-slate-50 rounded-lg">
                          <p className="text-base font-bold text-slate-900">{roles.length}</p>
                          <p className="text-xs text-slate-500">Roles</p>
                        </div>
                        <div className="text-center py-2 px-1 bg-slate-50 rounded-lg">
                          <p className="text-base font-bold text-slate-900">{openPos}</p>
                          <p className="text-xs text-slate-500">Open Pos.</p>
                        </div>
                        <div className="text-center py-2 px-1 bg-slate-50 rounded-lg">
                          <p className="text-base font-bold text-slate-900">{activeCandidates.length}</p>
                          <p className="text-xs text-slate-500">Candidates</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="border-t border-slate-100 pt-3 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full ${avatarColors[client.assignedTo]} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-[9px] font-bold">{client.assignedTo[0]}</span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium">{client.contactName}</span>
                          {client.contactTitle && (
                            <span className="text-xs text-slate-400">· {client.contactTitle}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={11} className="text-slate-400" />
                          <span className="text-xs text-slate-500">{client.contactEmail}</span>
                        </div>
                        {client.contactPhone && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={11} className="text-slate-400" />
                            <span className="text-xs text-slate-500">{client.contactPhone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end mt-3">
                        <span className="text-xs text-sky-700 font-medium flex items-center gap-1 hover:text-sky-800">
                          View details <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setForm(emptyForm) }}
        title="Add Client"
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setModalOpen(false); setForm(emptyForm) }}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Add Client</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Company Name *</label>
              <input className={inputCls} value={form.companyName} onChange={set('companyName')} placeholder="Company Inc." />
            </div>
            <div>
              <label className={labelCls}>Industry</label>
              <select className={inputCls} value={form.industry} onChange={set('industry')}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Contact Name *</label>
              <input className={inputCls} value={form.contactName} onChange={set('contactName')} placeholder="Jane Smith" />
            </div>
            <div>
              <label className={labelCls}>Contact Title</label>
              <input className={inputCls} value={form.contactTitle} onChange={set('contactTitle')} placeholder="CTO" />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input className={inputCls} type="email" value={form.contactEmail} onChange={set('contactEmail')} placeholder="jane@company.com" />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} value={form.contactPhone} onChange={set('contactPhone')} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <label className={labelCls}>Start Date</label>
              <input className={inputCls} type="date" value={form.startDate} onChange={set('startDate')} />
            </div>
            <div>
              <label className={labelCls}>Monthly Value ($)</label>
              <input className={inputCls} type="number" value={form.monthlyValue} onChange={set('monthlyValue')} placeholder="5000" />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="churned">Churned</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Assigned To</label>
              <select className={inputCls} value={form.assignedTo} onChange={set('assignedTo')}>
                {TEAM.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.notes} onChange={set('notes')} placeholder="Key context, SLA, special requirements..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
