import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LevelBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, generateId, today } from '../lib/utils'
import type { SeniorityLevel } from '../types'

const LEVELS: SeniorityLevel[] = ['junior', 'mid', 'senior', 'lead', 'principal']

const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent placeholder:text-slate-400 bg-white'
const labelCls = 'block text-xs font-medium text-slate-700 mb-1'

export function Scorecards() {
  const { scorecards, addScorecard, interviews } = useStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', technology: '', level: 'mid' as SeniorityLevel })

  function handleCreate() {
    if (!form.name || !form.role || !form.technology) return
    addScorecard({
      id: generateId('scorecard'),
      name: form.name,
      role: form.role,
      technology: form.technology,
      level: form.level,
      sections: [
        {
          id: generateId('sec'),
          title: 'Technical Skills',
          criteria: [
            { id: generateId('c'), label: 'Core language proficiency', weight: 5 },
            { id: generateId('c'), label: 'Problem-solving approach', weight: 4 },
            { id: generateId('c'), label: 'System design fundamentals', weight: 4 },
          ],
        },
        {
          id: generateId('sec'),
          title: 'Soft Skills',
          criteria: [
            { id: generateId('c'), label: 'Communication clarity', weight: 3 },
            { id: generateId('c'), label: 'Collaboration & teamwork', weight: 3 },
          ],
        },
      ],
      createdAt: today(),
    })
    setForm({ name: '', role: '', technology: '', level: 'mid' })
    setShowForm(false)
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <TopBar
        title="Scorecards"
        subtitle="Evaluation templates by role and technology"
        action={
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus size={14} /> New Scorecard
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Create form */}
        {showForm && (
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">New Scorecard</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Template Name *</label>
                <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Senior Backend Engineer (Python)" />
              </div>
              <div>
                <label className={labelCls}>Role *</label>
                <input className={inputCls} value={form.role} onChange={set('role')} placeholder="Senior Backend Engineer" />
              </div>
              <div>
                <label className={labelCls}>Primary Technology *</label>
                <input className={inputCls} value={form.technology} onChange={set('technology')} placeholder="Python" />
              </div>
              <div>
                <label className={labelCls}>Seniority Level</label>
                <select className={inputCls} value={form.level} onChange={set('level')}>
                  {LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Default sections (Technical Skills, Soft Skills) will be created. Edit criteria in a future update.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" onClick={handleCreate}>Create Scorecard</Button>
            </div>
          </Card>
        )}

        {scorecards.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No scorecards yet"
            description="Create evaluation templates to standardize your technical interviews."
            action={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={14} />New Scorecard</Button>}
          />
        ) : (
          <div className="space-y-3">
            {scorecards.map((sc) => {
              const usageCount = interviews.filter((i) => i.scorecardId === sc.id && i.status === 'completed').length
              const isExpanded = expanded === sc.id
              const totalCriteria = sc.sections.reduce((s, sec) => s + sec.criteria.length, 0)

              return (
                <Card key={sc.id} padding={false}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : sc.id)}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <ClipboardList size={16} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-900 text-sm">{sc.name}</p>
                          <LevelBadge level={sc.level} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {sc.technology} · {sc.sections.length} sections · {totalCriteria} criteria · {usageCount} uses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{formatDate(sc.createdAt)}</span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 pt-4">
                      <div className="grid grid-cols-1 gap-4">
                        {sc.sections.map((section) => (
                          <div key={section.id}>
                            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                              {section.title}
                            </h4>
                            <div className="space-y-1.5">
                              {section.criteria.map((c) => (
                                <div
                                  key={c.id}
                                  className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                                >
                                  <span className="text-sm text-slate-700">{c.label}</span>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${i < c.weight ? 'bg-sky-500' : 'bg-slate-200'}`}
                                      />
                                    ))}
                                    <span className="text-xs text-slate-400 ml-1 tabular-nums">
                                      w{c.weight}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
