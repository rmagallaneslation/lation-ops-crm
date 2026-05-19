import { useState, useMemo } from 'react'
import { Plus, Building, DollarSign, User, MoreHorizontal } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

import { formatCurrency, generateId, today } from '../lib/utils'
import type { Prospect, ProspectStatus, TeamMember } from '../types'

const STAGES: { key: ProspectStatus; label: string; color: string; bg: string }[] = [
  { key: 'new', label: 'New', color: 'text-slate-600', bg: 'bg-slate-100' },
  { key: 'contacted', label: 'Contacted', color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'qualified', label: 'Qualified', color: 'text-sky-600', bg: 'bg-sky-50' },
  { key: 'proposal', label: 'Proposal', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { key: 'negotiation', label: 'Negotiation', color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'won', label: 'Won', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'lost', label: 'Lost', color: 'text-red-600', bg: 'bg-red-50' },
]

const TEAM: TeamMember[] = ['Roberto', 'Reynaldo', 'Santiago']
const INDUSTRIES = [
  'Software / FinTech',
  'Cloud Infrastructure',
  'SaaS / B2B',
  'AI / ML',
  'E-commerce',
  'Digital Agency',
  'Enterprise Software',
  'Data / Analytics',
  'HealthTech',
  'EdTech',
  'Other',
]

const avatarColors: Record<TeamMember, string> = {
  Roberto: 'bg-sky-600',
  Reynaldo: 'bg-indigo-600',
  Santiago: 'bg-emerald-600',
}

function TeamAvatar({ name }: { name: TeamMember }) {
  return (
    <div
      title={name}
      className={`w-5 h-5 rounded-full ${avatarColors[name]} flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white text-[9px] font-bold">{name[0]}</span>
    </div>
  )
}

interface FormState {
  companyName: string
  industry: string
  website: string
  contactName: string
  contactTitle: string
  contactEmail: string
  contactPhone: string
  status: ProspectStatus
  estimatedValue: string
  assignedTo: TeamMember
  notes: string
}

const emptyForm: FormState = {
  companyName: '',
  industry: '',
  website: '',
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactPhone: '',
  status: 'new',
  estimatedValue: '',
  assignedTo: 'Roberto',
  notes: '',
}

function formToProspect(form: FormState, existing?: Prospect): Prospect {
  const now = today()
  return {
    id: existing?.id ?? generateId('prospect'),
    companyName: form.companyName,
    industry: form.industry,
    website: form.website || undefined,
    contactName: form.contactName,
    contactTitle: form.contactTitle || undefined,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone || undefined,
    status: form.status,
    estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
    assignedTo: form.assignedTo,
    notes: form.notes,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
}

function prospectToForm(p: Prospect): FormState {
  return {
    companyName: p.companyName,
    industry: p.industry,
    website: p.website ?? '',
    contactName: p.contactName,
    contactTitle: p.contactTitle ?? '',
    contactEmail: p.contactEmail,
    contactPhone: p.contactPhone ?? '',
    status: p.status,
    estimatedValue: p.estimatedValue?.toString() ?? '',
    assignedTo: p.assignedTo,
    notes: p.notes,
  }
}

export function Prospects() {
  const { prospects, addProspect, updateProspect, deleteProspect } = useStore()
  const [filterAssignee, setFilterAssignee] = useState<TeamMember | 'All'>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Prospect | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const filtered = useMemo(
    () =>
      filterAssignee === 'All'
        ? prospects
        : prospects.filter((p) => p.assignedTo === filterAssignee),
    [prospects, filterAssignee]
  )

  function openAdd() {
    setEditTarget(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(p: Prospect) {
    setEditTarget(p)
    setForm(prospectToForm(p))
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.companyName || !form.contactName || !form.contactEmail) return
    if (editTarget) {
      updateProspect(editTarget.id, formToProspect(form, editTarget))
    } else {
      addProspect(formToProspect(form))
    }
    setModalOpen(false)
  }

  function handleDelete() {
    if (!editTarget) return
    deleteProspect(editTarget.id)
    setModalOpen(false)
  }

  function moveStage(prospect: Prospect, status: ProspectStatus) {
    updateProspect(prospect.id, { status, updatedAt: today() })
  }

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent placeholder:text-slate-400 bg-white'
  const labelCls = 'block text-xs font-medium text-slate-700 mb-1'

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      <TopBar
        title="Pipeline"
        subtitle="Track and manage your sales prospects"
        action={
          <div className="flex items-center gap-3">
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value as TeamMember | 'All')}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
            >
              <option value="All">All team</option>
              {TEAM.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} />
              Add Prospect
            </Button>
          </div>
        }
      />

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-3 h-full overflow-x-auto px-6 py-4 scrollbar-thin">
          {STAGES.map(({ key, label, color }) => {
            const cards = filtered.filter((p) => p.status === key)
            const stageValue = cards.reduce((s, p) => s + (p.estimatedValue ?? 0), 0)
            return (
              <div
                key={key}
                className="flex-shrink-0 w-72 flex flex-col rounded-xl bg-slate-100/70 border border-slate-200"
              >
                {/* Column header */}
                <div className="px-3 pt-3 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${color}`}>{label}</span>
                      <span className="text-xs text-slate-500 bg-white rounded-full px-1.5 py-0.5 font-medium leading-none">
                        {cards.length}
                      </span>
                    </div>
                    {stageValue > 0 && (
                      <span className="text-xs text-slate-500 font-medium">
                        {formatCurrency(stageValue)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-2 min-h-0 scrollbar-thin">
                  {cards.map((prospect) => (
                    <div
                      key={prospect.id}
                      onClick={() => openEdit(prospect)}
                      className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-150 group"
                    >
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">
                          {prospect.companyName}
                        </p>
                        <MoreHorizontal
                          size={14}
                          className="text-slate-400 group-hover:text-slate-600 flex-shrink-0 mt-0.5"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Building size={11} className="text-slate-400" />
                        <span className="text-xs text-slate-500 truncate">
                          {prospect.industry}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <User size={11} className="text-slate-400" />
                        <span className="text-xs text-slate-600 truncate">
                          {prospect.contactName}
                          {prospect.contactTitle && ` · ${prospect.contactTitle}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        {prospect.estimatedValue ? (
                          <div className="flex items-center gap-1">
                            <DollarSign size={11} className="text-emerald-500" />
                            <span className="text-xs font-semibold text-slate-700 tabular-nums">
                              {formatCurrency(prospect.estimatedValue)}/mo
                            </span>
                          </div>
                        ) : (
                          <span />
                        )}
                        <TeamAvatar name={prospect.assignedTo} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? `Edit — ${editTarget.companyName}` : 'Add Prospect'}
        size="lg"
        footer={
          <>
            {editTarget && (
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <div className="flex-1" />
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              {editTarget ? 'Save Changes' : 'Add Prospect'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Stage select when editing */}
          {editTarget && (
            <div>
              <label className={labelCls}>Pipeline Stage</label>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setForm((f) => ({ ...f, status: key }))
                      moveStage(editTarget, key)
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                      form.status === key
                        ? 'border-sky-600 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Company Name *</label>
              <input className={inputCls} value={form.companyName} onChange={set('companyName')} placeholder="Acme Corp" />
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
              <input className={inputCls} value={form.contactTitle} onChange={set('contactTitle')} placeholder="VP of Engineering" />
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
              <label className={labelCls}>Website</label>
              <input className={inputCls} value={form.website} onChange={set('website')} placeholder="https://company.com" />
            </div>
            <div>
              <label className={labelCls}>Est. Monthly Value ($)</label>
              <input className={inputCls} type="number" value={form.estimatedValue} onChange={set('estimatedValue')} placeholder="5000" />
            </div>
            {!editTarget && (
              <div>
                <label className={labelCls}>Stage</label>
                <select className={inputCls} value={form.status} onChange={set('status')}>
                  {STAGES.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className={labelCls}>Assigned To</label>
              <select className={inputCls} value={form.assignedTo} onChange={set('assignedTo')}>
                {TEAM.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.notes}
              onChange={set('notes')}
              placeholder="Key context, next steps, decision makers..."
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
