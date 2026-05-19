import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  UserCheck,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Badge, LevelBadge, CandidateStatusBadge, InterviewStatusBadge, InterviewTypeBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency, formatDate, formatDateTime, generateId, today } from '../lib/utils'
import type {
  HiringRole,
  Candidate,
  Interview,
  SeniorityLevel,
  CandidateStatus,
  InterviewType,
  TeamMember,
} from '../types'

type Tab = 'overview' | 'roles' | 'candidates' | 'interviews'

const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent placeholder:text-slate-400 bg-white'
const labelCls = 'block text-xs font-medium text-slate-700 mb-1'

const LEVELS: SeniorityLevel[] = ['junior', 'mid', 'senior', 'lead', 'principal']
const CANDIDATE_STATUSES: CandidateStatus[] = ['screening', 'technical', 'system-design', 'final', 'offer', 'hired', 'rejected', 'withdrawn']
const INTERVIEW_TYPES: InterviewType[] = ['screening', 'technical', 'system-design', 'behavioral', 'final']
const TEAM: TeamMember[] = ['Roberto', 'Reynaldo', 'Santiago']

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const {
    clients,
    hiringRoles, addHiringRole, updateHiringRole, deleteHiringRole,
    candidates, addCandidate, updateCandidate,
    interviews, addInterview, updateInterview,
    scorecards,
  } = useStore()

  const client = clients.find((c) => c.id === id)
  const [tab, setTab] = useState<Tab>('overview')

  // Role modal
  const [roleModal, setRoleModal] = useState(false)
  const [editRole, setEditRole] = useState<HiringRole | null>(null)
  const [roleForm, setRoleForm] = useState({
    roleName: '', technology: '', level: 'mid' as SeniorityLevel,
    openPositions: '1', interviewStages: 'Screening, Technical, Final', scorecardId: '',
  })

  // Candidate modal
  const [candModal, setCandModal] = useState(false)
  const [editCand, setEditCand] = useState<Candidate | null>(null)
  const [candForm, setCandForm] = useState({
    name: '', email: '', phone: '', linkedIn: '',
    roleId: '', status: 'screening' as CandidateStatus, notes: '',
  })

  // Interview modal
  const [itvModal, setItvModal] = useState(false)
  const [editItv, setEditItv] = useState<Interview | null>(null)
  const [itvForm, setItvForm] = useState({
    candidateId: '', interviewerName: 'Reynaldo' as TeamMember | string,
    scheduledAt: '', duration: '60', type: 'technical' as InterviewType,
    scorecardId: '', notes: '',
  })

  const clientRoles = useMemo(() => hiringRoles.filter((r) => r.clientId === id), [hiringRoles, id])
  const clientCandidates = useMemo(() => candidates.filter((c) => c.clientId === id), [candidates, id])
  const clientInterviews = useMemo(() => interviews.filter((i) => i.clientId === id), [interviews, id])

  if (!client) {
    return (
      <div className="p-6">
        <Link to="/clients" className="text-sky-700 text-sm hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Clients
        </Link>
        <p className="mt-6 text-slate-500">Client not found.</p>
      </div>
    )
  }

  // ---- Role helpers ----
  function openAddRole() {
    setEditRole(null)
    setRoleForm({ roleName: '', technology: '', level: 'mid', openPositions: '1', interviewStages: 'Screening, Technical, Final', scorecardId: '' })
    setRoleModal(true)
  }
  function openEditRole(r: HiringRole) {
    setEditRole(r)
    setRoleForm({
      roleName: r.roleName, technology: r.technology.join(', '),
      level: r.level, openPositions: String(r.openPositions),
      interviewStages: r.interviewStages.join(', '), scorecardId: r.scorecardId ?? '',
    })
    setRoleModal(true)
  }
  function saveRole() {
    if (!roleForm.roleName) return
    const data: Omit<HiringRole, 'id' | 'createdAt' | 'clientId'> = {
      roleName: roleForm.roleName,
      technology: roleForm.technology.split(',').map((s) => s.trim()).filter(Boolean),
      level: roleForm.level,
      openPositions: Number(roleForm.openPositions) || 1,
      filledPositions: editRole?.filledPositions ?? 0,
      interviewStages: roleForm.interviewStages.split(',').map((s) => s.trim()).filter(Boolean),
      scorecardId: roleForm.scorecardId || undefined,
    }
    if (editRole) {
      updateHiringRole(editRole.id, data)
    } else {
      addHiringRole({ ...data, id: generateId('role'), clientId: id!, createdAt: today() })
    }
    setRoleModal(false)
  }

  // ---- Candidate helpers ----
  function openAddCand() {
    setEditCand(null)
    setCandForm({ name: '', email: '', phone: '', linkedIn: '', roleId: clientRoles[0]?.id ?? '', status: 'screening', notes: '' })
    setCandModal(true)
  }
  function openEditCand(c: Candidate) {
    setEditCand(c)
    setCandForm({ name: c.name, email: c.email, phone: c.phone ?? '', linkedIn: c.linkedIn ?? '', roleId: c.roleId, status: c.status, notes: c.notes })
    setCandModal(true)
  }
  function saveCand() {
    if (!candForm.name || !candForm.email) return
    const now = today()
    if (editCand) {
      updateCandidate(editCand.id, { ...candForm, updatedAt: now, phone: candForm.phone || undefined, linkedIn: candForm.linkedIn || undefined })
    } else {
      addCandidate({ id: generateId('candidate'), clientId: id!, ...candForm, phone: candForm.phone || undefined, linkedIn: candForm.linkedIn || undefined, appliedAt: now, updatedAt: now })
    }
    setCandModal(false)
  }

  // ---- Interview helpers ----
  function openAddItv() {
    setEditItv(null)
    setItvForm({ candidateId: clientCandidates[0]?.id ?? '', interviewerName: 'Reynaldo', scheduledAt: '', duration: '60', type: 'technical', scorecardId: '', notes: '' })
    setItvModal(true)
  }
  function openEditItv(i: Interview) {
    setEditItv(i)
    setItvForm({ candidateId: i.candidateId, interviewerName: i.interviewerName, scheduledAt: i.scheduledAt.slice(0, 16), duration: String(i.duration), type: i.type, scorecardId: i.scorecardId ?? '', notes: i.notes ?? '' })
    setItvModal(true)
  }
  function saveItv() {
    if (!itvForm.candidateId || !itvForm.scheduledAt) return
    const role = candidates.find((c) => c.id === itvForm.candidateId)?.roleId ?? clientRoles[0]?.id ?? ''
    if (editItv) {
      updateInterview(editItv.id, { ...itvForm, duration: Number(itvForm.duration), roleId: role, scorecardId: itvForm.scorecardId || undefined, notes: itvForm.notes || undefined })
    } else {
      addInterview({ id: generateId('interview'), clientId: id!, roleId: role, ...itvForm, duration: Number(itvForm.duration), status: 'scheduled', scorecardId: itvForm.scorecardId || undefined, notes: itvForm.notes || undefined })
    }
    setItvModal(false)
  }

  const setR = (k: keyof typeof roleForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setRoleForm((f) => ({ ...f, [k]: e.target.value }))
  const setC = (k: keyof typeof candForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setCandForm((f) => ({ ...f, [k]: e.target.value }))
  const setI = (k: keyof typeof itvForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setItvForm((f) => ({ ...f, [k]: e.target.value }))

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'roles', label: 'Roles', count: clientRoles.length },
    { key: 'candidates', label: 'Candidates', count: clientCandidates.length },
    { key: 'interviews', label: 'Interviews', count: clientInterviews.length },
  ]

  return (
    <div>
      <TopBar
        title={client.companyName}
        subtitle={client.industry}
        action={
          <Link to="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={14} /> Back
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        {/* Header card */}
        <Card className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{client.companyName.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-base font-bold text-slate-900">{client.companyName}</h2>
                  <Badge variant="emerald">{client.status}</Badge>
                </div>
                <p className="text-sm text-slate-500">{client.industry}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Mail size={12} className="text-slate-400" /> {client.contactEmail}
                  </span>
                  {client.contactPhone && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Phone size={12} className="text-slate-400" /> {client.contactPhone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatCurrency(client.monthlyValue)}<span className="text-sm font-normal text-slate-400">/mo</span></p>
              <p className="text-xs text-slate-500 mt-0.5">Since {formatDate(client.startDate)}</p>
              <p className="text-xs text-slate-500 mt-0.5">Assigned to <span className="font-medium text-slate-700">{client.assignedTo}</span></p>
            </div>
          </div>
          {client.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed">{client.notes}</p>
            </div>
          )}
        </Card>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px flex items-center gap-1.5 ${
                tab === key
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
              {count !== undefined && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${tab === key ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === 'overview' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-5 bg-white rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">{clientRoles.length}</p>
              <p className="text-sm text-slate-500 mt-1">Active Roles</p>
            </div>
            <div className="text-center p-5 bg-white rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">{clientCandidates.filter((c) => c.status !== 'rejected' && c.status !== 'withdrawn').length}</p>
              <p className="text-sm text-slate-500 mt-1">Active Candidates</p>
            </div>
            <div className="text-center p-5 bg-white rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">{clientCandidates.filter((c) => c.status === 'hired').length}</p>
              <p className="text-sm text-slate-500 mt-1">Total Hires</p>
            </div>
            <div className="text-center p-5 bg-white rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">{clientInterviews.filter((i) => i.status === 'completed').length}</p>
              <p className="text-sm text-slate-500 mt-1">Interviews Done</p>
            </div>
            <div className="text-center p-5 bg-white rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">{clientInterviews.filter((i) => i.status === 'scheduled').length}</p>
              <p className="text-sm text-slate-500 mt-1">Scheduled</p>
            </div>
            <div className="text-center p-5 bg-white rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">{clientRoles.reduce((s, r) => s + r.openPositions, 0)}</p>
              <p className="text-sm text-slate-500 mt-1">Open Positions</p>
            </div>
          </div>
        )}

        {/* Tab: Roles */}
        {tab === 'roles' && (
          <div>
            <div className="flex justify-end mb-4">
              <Button size="sm" onClick={openAddRole}><Plus size={14} /> Add Role</Button>
            </div>
            {clientRoles.length === 0 ? (
              <EmptyState icon={Briefcase} title="No roles configured" description="Add hiring roles for this client to start tracking candidates." action={<Button size="sm" onClick={openAddRole}><Plus size={14} />Add Role</Button>} />
            ) : (
              <div className="space-y-3">
                {clientRoles.map((role) => {
                  const roleScorecard = scorecards.find((s) => s.id === role.scorecardId)
                  const roleCandidates = clientCandidates.filter((c) => c.roleId === role.id)
                  return (
                    <Card key={role.id} padding={false}>
                      <div className="p-4 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-semibold text-slate-900 text-sm">{role.roleName}</h3>
                            <LevelBadge level={role.level} />
                            {roleScorecard && <Badge variant="sky">Scorecard: {roleScorecard.name}</Badge>}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {role.technology.map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">{t}</span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500">
                            Stages: {role.interviewStages.join(' → ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">{role.openPositions - role.filledPositions} open</p>
                            <p className="text-xs text-slate-500">{roleCandidates.length} candidates</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openEditRole(role)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => { deleteHiringRole(role.id) }} className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Candidates */}
        {tab === 'candidates' && (
          <div>
            <div className="flex justify-end mb-4">
              <Button size="sm" onClick={openAddCand}><Plus size={14} /> Add Candidate</Button>
            </div>
            {clientCandidates.length === 0 ? (
              <EmptyState icon={UserCheck} title="No candidates yet" description="Add candidates for this client's roles." action={<Button size="sm" onClick={openAddCand}><Plus size={14} />Add Candidate</Button>} />
            ) : (
              <Card padding={false}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Candidate</th>
                      <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Role</th>
                      <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Applied</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientCandidates.map((c) => {
                      const role = clientRoles.find((r) => r.id === c.roleId)
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-slate-700 text-xs">{role?.roleName ?? '—'}</p>
                          </td>
                          <td className="px-4 py-3"><CandidateStatusBadge status={c.status} /></td>
                          <td className="px-4 py-3 text-xs text-slate-500">{formatDate(c.appliedAt)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => openEditCand(c)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"><Pencil size={14} /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}

        {/* Tab: Interviews */}
        {tab === 'interviews' && (
          <div>
            <div className="flex justify-end mb-4">
              <Button size="sm" onClick={openAddItv}><Plus size={14} /> Schedule Interview</Button>
            </div>
            {clientInterviews.length === 0 ? (
              <EmptyState icon={Calendar} title="No interviews yet" description="Schedule the first interview for this client." action={<Button size="sm" onClick={openAddItv}><Plus size={14} />Schedule Interview</Button>} />
            ) : (
              <div className="space-y-2">
                {clientInterviews
                  .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                  .map((itv) => {
                    const cand = clientCandidates.find((c) => c.id === itv.candidateId)
                    const role = clientRoles.find((r) => r.id === itv.roleId)
                    return (
                      <Card key={itv.id} padding={false}>
                        <div className="p-4 flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-slate-900 text-sm">{cand?.name ?? 'Unknown'}</p>
                              <InterviewTypeBadge type={itv.type} />
                              <InterviewStatusBadge status={itv.status} />
                            </div>
                            <p className="text-xs text-slate-500">
                              {role?.roleName} · {itv.duration} min · {itv.interviewerName}
                            </p>
                            {itv.notes && <p className="text-xs text-slate-400 mt-1 italic">{itv.notes}</p>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-medium text-slate-700">{formatDateTime(itv.scheduledAt)}</p>
                            {itv.overallScore !== undefined && (
                              <p className="text-xs text-slate-500">Score: <span className="font-semibold">{itv.overallScore.toFixed(1)}/5</span></p>
                            )}
                          </div>
                          <button onClick={() => openEditItv(itv)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"><Pencil size={14} /></button>
                        </div>
                      </Card>
                    )
                  })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role Modal */}
      <Modal open={roleModal} onClose={() => setRoleModal(false)} title={editRole ? 'Edit Role' : 'Add Hiring Role'} footer={<><Button variant="secondary" size="sm" onClick={() => setRoleModal(false)}>Cancel</Button><Button size="sm" onClick={saveRole}>{editRole ? 'Save' : 'Add Role'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Role Name *</label>
              <input className={inputCls} value={roleForm.roleName} onChange={setR('roleName')} placeholder="Senior Backend Engineer" />
            </div>
            <div>
              <label className={labelCls}>Technology (comma-separated)</label>
              <input className={inputCls} value={roleForm.technology} onChange={setR('technology')} placeholder="Node.js, PostgreSQL, AWS" />
            </div>
            <div>
              <label className={labelCls}>Seniority Level</label>
              <select className={inputCls} value={roleForm.level} onChange={setR('level')}>
                {LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Open Positions</label>
              <input className={inputCls} type="number" min="0" value={roleForm.openPositions} onChange={setR('openPositions')} />
            </div>
            <div>
              <label className={labelCls}>Scorecard</label>
              <select className={inputCls} value={roleForm.scorecardId} onChange={setR('scorecardId')}>
                <option value="">None</option>
                {scorecards.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Interview Stages (comma-separated)</label>
              <input className={inputCls} value={roleForm.interviewStages} onChange={setR('interviewStages')} placeholder="Screening, Technical, System Design, Final" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Candidate Modal */}
      <Modal open={candModal} onClose={() => setCandModal(false)} title={editCand ? 'Edit Candidate' : 'Add Candidate'} footer={<><Button variant="secondary" size="sm" onClick={() => setCandModal(false)}>Cancel</Button><Button size="sm" onClick={saveCand}>{editCand ? 'Save' : 'Add'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} value={candForm.name} onChange={setC('name')} placeholder="Carlos Méndez" />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input className={inputCls} type="email" value={candForm.email} onChange={setC('email')} placeholder="carlos@email.com" />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} value={candForm.phone} onChange={setC('phone')} placeholder="+52 55 1234 5678" />
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input className={inputCls} value={candForm.linkedIn} onChange={setC('linkedIn')} placeholder="linkedin.com/in/..." />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <select className={inputCls} value={candForm.roleId} onChange={setC('roleId')}>
                {clientRoles.map((r) => <option key={r.id} value={r.id}>{r.roleName}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={candForm.status} onChange={setC('status')}>
                {CANDIDATE_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={candForm.notes} onChange={setC('notes')} placeholder="Experience, highlights, context..." />
          </div>
        </div>
      </Modal>

      {/* Interview Modal */}
      <Modal open={itvModal} onClose={() => setItvModal(false)} title={editItv ? 'Edit Interview' : 'Schedule Interview'} footer={<><Button variant="secondary" size="sm" onClick={() => setItvModal(false)}>Cancel</Button><Button size="sm" onClick={saveItv}>{editItv ? 'Save' : 'Schedule'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Candidate *</label>
              <select className={inputCls} value={itvForm.candidateId} onChange={setI('candidateId')}>
                <option value="">Select candidate</option>
                {clientCandidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Interviewer</label>
              <select className={inputCls} value={itvForm.interviewerName} onChange={setI('interviewerName')}>
                {TEAM.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Date & Time *</label>
              <input className={inputCls} type="datetime-local" value={itvForm.scheduledAt} onChange={setI('scheduledAt')} />
            </div>
            <div>
              <label className={labelCls}>Duration (minutes)</label>
              <input className={inputCls} type="number" value={itvForm.duration} onChange={setI('duration')} />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={itvForm.type} onChange={setI('type')}>
                {INTERVIEW_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Scorecard</label>
              <select className={inputCls} value={itvForm.scorecardId} onChange={setI('scorecardId')}>
                <option value="">None</option>
                {scorecards.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={itvForm.notes} onChange={setI('notes')} placeholder="Focus areas, instructions for interviewer..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
