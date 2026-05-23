import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { EmptyState } from '../../components/shared/EmptyState'
import { useLationStore } from '../../store/useLationStore'
import type { Application, ApplicationStatus } from '../../types/lation'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const COLUMNS: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'applied', label: 'Applied', color: 'bg-slate-100 dark:bg-slate-800' },
  { status: 'screening', label: 'Screening', color: 'bg-sky-50 dark:bg-sky-950/30' },
  { status: 'interview', label: 'Interview', color: 'bg-violet-50 dark:bg-violet-950/30' },
  { status: 'reviewed', label: 'Reviewed', color: 'bg-amber-50 dark:bg-amber-950/30' },
  { status: 'offer_sent', label: 'Offer Sent', color: 'bg-blue-50 dark:bg-blue-950/30' },
  { status: 'accepted', label: 'Accepted', color: 'bg-emerald-50 dark:bg-emerald-950/30' },
]

const STATUS_DOT: Record<ApplicationStatus, string> = {
  applied: 'bg-slate-400',
  screening: 'bg-sky-400',
  interview: 'bg-violet-500',
  reviewed: 'bg-amber-500',
  offer_sent: 'bg-blue-500',
  accepted: 'bg-emerald-500',
  rejected: 'bg-red-400',
}

function DroppableColumn({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`${className} transition-colors ${isOver ? 'ring-2 ring-orange-400 ring-inset' : ''}`}
    >
      {children}
    </div>
  )
}

function DraggableCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`touch-none ${isDragging ? 'opacity-40' : ''}`}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}

type Form = Omit<Application, 'id' | 'created_at' | 'updated_at'>

const empty = (): Form => ({
  talent_id: '', position_id: '', status: 'applied',
  applied_at: new Date().toISOString(), interview_scheduled_at: '', notes: '',
})

export function Applications() {
  const { t } = useTranslation()
  const applications = useLationStore((s) => s.applications)
  const talents = useLationStore((s) => s.talents)
  const positions = useLationStore((s) => s.positions)
  const employers = useLationStore((s) => s.employers)
  const addApplication = useLationStore((s) => s.addApplication)
  const updateApplication = useLationStore((s) => s.updateApplication)
  const deleteApplication = useLationStore((s) => s.deleteApplication)

  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Application | null>(null)
  const [form, setForm] = useState<Form>(empty())
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const activeApp = activeId ? applications.find((a) => a.id === activeId) : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const newStatus = over.id as ApplicationStatus
    const app = applications.find((a) => a.id === active.id)
    if (app && app.status !== newStatus) {
      updateApplication(app.id, { status: newStatus })
      toast.success(t('applications.moved_to', { status: t(`status.${newStatus}`), defaultValue: `Moved to ${t(`status.${newStatus}`)}` }))
    }
  }

  const talentMap = Object.fromEntries(talents.map((t) => [t.id, t]))
  const positionMap = Object.fromEntries(positions.map((p) => [p.id, p]))
  const employerMap = Object.fromEntries(employers.map((e) => [e.id, e]))

  const activeApps = applications.filter((a) => a.status !== 'rejected')

  const filtered = activeApps.filter((a) => {
    const q = search.toLowerCase()
    const talent = talentMap[a.talent_id]
    const position = positionMap[a.position_id]
    return !q ||
      talent?.full_name.toLowerCase().includes(q) ||
      position?.title.toLowerCase().includes(q) ||
      (employerMap[position?.employer_id ?? '']?.company_name ?? '').toLowerCase().includes(q)
  })

  function openAdd() { setEditing(null); setForm(empty()); setOpen(true) }
  function openEdit(a: Application) { setEditing(a); setForm({ ...a }); setOpen(true) }
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm((f) => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.talent_id || !form.position_id) return
    if (editing) updateApplication(editing.id, form)
    else addApplication(form)
    setOpen(false)
  }

  function AppCard({ a }: { a: Application }) {
    const talent = talentMap[a.talent_id]
    const position = positionMap[a.position_id]
    const employer = employerMap[position?.employer_id ?? '']
    return (
      <div
        onClick={() => openEdit(a)}
        className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
      >
        <div className="flex items-start gap-2 mb-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
            {talent?.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{talent?.full_name ?? '—'}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{position?.title ?? '—'}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{employer?.company_name ?? '—'}</p>
        {a.notes && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">"{a.notes}"</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title={t('applications.title')}
        subtitle={t(filtered.length === 1 ? 'applications.active_count' : 'applications.active_count_plural', { count: filtered.length })}
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'kanban' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                {t('applications.kanban')}
              </button>
              <button onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                {t('applications.list')}
              </button>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4" /> {t('applications.add')}
            </Button>
          </div>
        }
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 pt-5 pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder={t('applications.search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div className="flex-1 overflow-x-auto px-6 pb-6">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex gap-4 h-full" style={{ minWidth: `${COLUMNS.length * 240}px` }}>
                {COLUMNS.map((col) => {
                  const colApps = filtered.filter((a) => a.status === col.status)
                  return (
                    <div key={col.status} className="flex flex-col w-56 flex-shrink-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{t(`status.${col.status}`)}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{colApps.length}</span>
                      </div>
                      <DroppableColumn id={col.status} className={`flex-1 rounded-xl p-3 space-y-2.5 overflow-y-auto ${col.color}`}>
                        {colApps.length === 0 ? (
                          <p className="text-xs text-slate-400 dark:text-slate-600 text-center py-4">{t('applications.empty')}</p>
                        ) : (
                          colApps.map((a) => (
                            <DraggableCard key={a.id} id={a.id}>
                              <AppCard a={a} />
                            </DraggableCard>
                          ))
                        )}
                      </DroppableColumn>
                    </div>
                  )
                })}
              </div>
              <DragOverlay>
                {activeApp ? (
                  <div className="rotate-2 scale-105 opacity-90 shadow-xl">
                    <AppCard a={activeApp} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {filtered.length === 0 ? (
              <EmptyState title={t('applications.no_applications')} action={{ label: t('applications.add'), onClick: openAdd }} />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                      {[t('applications.talent'), t('applications.position'), t('applications.employer'), t('common.status'), t('applications.applied')].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filtered.map((a) => {
                      const talent = talentMap[a.talent_id]
                      const position = positionMap[a.position_id]
                      const employer = employerMap[position?.employer_id ?? '']
                      return (
                        <tr key={a.id} className="hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-700/50 transition-colors" onClick={() => openEdit(a)}>
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{talent?.full_name ?? '—'}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{position?.title ?? '—'}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{employer?.company_name ?? '—'}</td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full ${STATUS_DOT[a.status]}`} />
                              <span className="text-xs capitalize text-slate-600 dark:text-slate-300">{t(`status.${a.status}`)}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(a.applied_at).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? t('applications.edit') : t('applications.add')} className="max-w-lg">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>{t('applications.talent')} *</Label>
            <Select value={form.talent_id} onChange={(e) => set('talent_id', e.target.value)}>
              <option value="">{t('common.select_talent')}</option>
              {talents.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>{t('applications.position')} *</Label>
            <Select value={form.position_id} onChange={(e) => set('position_id', e.target.value)}>
              <option value="">{t('common.select_position')}</option>
              {positions.map((p) => <option key={p.id} value={p.id}>{p.title} — {employerMap[p.employer_id]?.company_name}</option>)}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>{t('common.status')}</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as ApplicationStatus)}>
              <option value="applied">{t('status.applied')}</option>
              <option value="screening">{t('status.screening')}</option>
              <option value="interview">{t('status.interview')}</option>
              <option value="reviewed">{t('status.reviewed')}</option>
              <option value="offer_sent">{t('status.offer_sent')}</option>
              <option value="accepted">{t('status.accepted')}</option>
              <option value="rejected">{t('status.rejected')}</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>{t('applications.interview_date')}</Label>
            <Input type="datetime-local" value={form.interview_scheduled_at?.slice(0, 16) ?? ''} onChange={(e) => set('interview_scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : '')} />
          </div>
          <div className="space-y-1">
            <Label>{t('common.notes')}</Label>
            <Textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { setOpen(false); setConfirmDelete(editing) }}>{t('common.delete')}</Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
            <Button size="sm" onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title={t('applications.delete_application')}>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t('applications.delete_confirm', { name: talentMap[confirmDelete?.talent_id ?? '']?.full_name ?? '—' })} {t('common.cannot_be_undone')}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" size="sm" onClick={() => { deleteApplication(confirmDelete!.id); setConfirmDelete(null) }}>{t('common.yes_delete')}</Button>
        </div>
      </Dialog>
    </div>
  )
}
