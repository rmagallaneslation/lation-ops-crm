import { useState, useMemo } from 'react'
import { Plus, Search, ExternalLink, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { CandidateStatusBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, generateId, today } from '../lib/utils'
import type { Candidate, CandidateStatus } from '../types'
import { UserCheck } from 'lucide-react'

const STATUSES: CandidateStatus[] = [
  'screening', 'technical', 'system-design', 'final', 'offer', 'hired', 'rejected', 'withdrawn',
]

const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent placeholder:text-slate-400 bg-white'
const labelCls = 'block text-xs font-medium text-slate-700 mb-1'

interface CandForm {
  name: string; email: string; phone: string; linkedIn: string
  clientId: string; roleId: string; status: CandidateStatus; notes: string
}

export function Candidates() {
  const { candidates, clients, hiringRoles, addCandidate, updateCandidate } = useStore()
  const [search, setSearch] = useState('')
  const [filterClient, setFilterClient] = useState('')
  const [filterStatus, setFilterStatus] = useState<CandidateStatus | ''>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Candidate | null>(null)
  const [form, setForm] = useState<CandForm>({
    name: '', email: '', phone: '', linkedIn: '',
    clientId: clients[0]?.id ?? '', roleId: '', status: 'screening', notes: '',
  })

  const clientRoles = useMemo(
    () => hiringRoles.filter((r) => r.clientId === form.clientId),
    [hiringRoles, form.clientId]
  )

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (filterClient && c.clientId !== filterClient) return false
      if (filterStatus && c.status !== filterStatus) return false
      if (search) {
        const q = search.toLowerCase()
        const client = clients.find((cl) => cl.id === c.clientId)
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          client?.companyName.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [candidates, filterClient, filterStatus, search, clients])

  function openAdd() {
    setEditTarget(null)
    setForm({ name: '', email: '', phone: '', linkedIn: '', clientId: clients[0]?.id ?? '', roleId: hiringRoles.find((r) => r.clientId === clients[0]?.id)?.id ?? '', status: 'screening', notes: '' })
    setModalOpen(true)
  }

  function openEdit(c: Candidate) {
    setEditTarget(c)
    setForm({ name: c.name, email: c.email, phone: c.phone ?? '', linkedIn: c.linkedIn ?? '', clientId: c.clientId, roleId: c.roleId, status: c.status, notes: c.notes })
    setModalOpen(true)
  }

  function handleSave() {
    if (!form.name || !form.email) return
    const now = today()
    if (editTarget) {
      updateCandidate(editTarget.id, { ...form, phone: form.phone || undefined, linkedIn: form.linkedIn || undefined, updatedAt: now })
    } else {
      addCandidate({ id: generateId('candidate'), ...form, phone: form.phone || undefined, linkedIn: form.linkedIn || undefined, appliedAt: now, updatedAt: now })
    }
    setModalOpen(false)
  }

  const set = (k: keyof CandForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => {
      const next = { ...f, [k]: e.target.value }
      if (k === 'clientId') next.roleId = hiringRoles.find((r) => r.clientId === e.target.value)?.id ?? ''
      return next
    })

  return (
    <div>
      <TopBar
        title="Candidates"
        subtitle={`${candidates.length} total candidates tracked`}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus size={14} /> Add Candidate
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white placeholder:text-slate-400"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="">All clients</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
          </select>
          <select
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CandidateStatus | '')}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No candidates found"
            description="Adjust your filters or add a new candidate."
            action={<Button size="sm" onClick={openAdd}><Plus size={14} />Add Candidate</Button>}
          />
        ) : (
          <Card padding={false}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Candidate</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Client</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Applied</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Updated</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => {
                  const client = clients.find((cl) => cl.id === c.clientId)
                  const role = hiringRoles.find((r) => r.id === c.roleId)
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                        {c.linkedIn && (
                          <a
                            href={`https://${c.linkedIn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-0.5 mt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            LinkedIn <ExternalLink size={10} />
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {client ? (
                          <Link
                            to={`/clients/${client.id}`}
                            className="text-xs text-sky-700 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {client.companyName}
                          </Link>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{role?.roleName ?? '—'}</td>
                      <td className="px-4 py-3"><CandidateStatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(c.appliedAt)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(c.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? `Edit — ${editTarget.name}` : 'Add Candidate'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>{editTarget ? 'Save Changes' : 'Add Candidate'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Carlos Méndez" />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="carlos@email.com" />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+52 55 1234 5678" />
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input className={inputCls} value={form.linkedIn} onChange={set('linkedIn')} placeholder="linkedin.com/in/..." />
            </div>
            <div>
              <label className={labelCls}>Client</label>
              <select className={inputCls} value={form.clientId} onChange={set('clientId')}>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <select className={inputCls} value={form.roleId} onChange={set('roleId')}>
                {clientRoles.map((r) => <option key={r.id} value={r.id}>{r.roleName}</option>)}
                {clientRoles.length === 0 && <option value="">No roles configured</option>}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Status</label>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                      form.status === s
                        ? 'border-sky-600 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.notes} onChange={set('notes')} placeholder="Experience highlights, context..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
