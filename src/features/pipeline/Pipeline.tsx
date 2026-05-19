import { useState } from 'react'
import { TopBar } from '../../components/layout/TopBar'
import { CompanyStatusBadge, PriorityBadge } from '../../components/shared/StatusBadge'
import { useStore } from '../../store/useStore'
import { PIPELINE_STAGES, COMPANY_STATUS_LABELS } from '../../lib/status'
import type { Company, CompanyStatus } from '../../types'
import { Dialog } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import { Label } from '../../components/ui/label'

export function Pipeline() {
  const companies = useStore((s) => s.companies)
  const updateCompany = useStore((s) => s.updateCompany)
  const [selected, setSelected] = useState<Company | null>(null)

  const stages = PIPELINE_STAGES.filter((s) => s !== 'closed_lost')

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Pipeline" subtitle="Sales funnel view" />
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const cols = companies.filter((c) => c.status === stage)
            return (
              <div key={stage} className="flex flex-col w-64 flex-shrink-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{COMPANY_STATUS_LABELS[stage]}</span>
                  <span className="text-xs text-slate-400">{cols.length}</span>
                </div>
                <div className="flex flex-col gap-2 min-h-[200px] rounded-xl bg-slate-100 p-2">
                  {cols.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg bg-white p-3 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelected(c)}
                    >
                      <p className="text-xs font-semibold text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500 truncate">{c.industry}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{c.owner}</span>
                        {c.estimatedDealValue && (
                          <span className="text-xs font-medium text-slate-600">${(c.estimatedDealValue / 1000).toFixed(0)}k</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <Dialog open onClose={() => setSelected(null)} title={selected.name}>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <CompanyStatusBadge status={selected.status} />
              <PriorityBadge priority={selected.priority} />
            </div>
            <p className="text-sm text-slate-600">{selected.industry} · {selected.city ?? ''}{selected.city ? ', ' : ''}{selected.country}</p>
            {selected.contactName && (
              <p className="text-sm text-slate-600">{selected.contactName} — {selected.contactRole}</p>
            )}
            {selected.estimatedDealValue && (
              <p className="text-sm text-slate-600">Deal: ${selected.estimatedDealValue.toLocaleString()} · {selected.closeProbability ?? 0}% probability</p>
            )}
            {selected.painPoints && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Pain Points</p>
                <p className="text-sm text-slate-700">{selected.painPoints}</p>
              </div>
            )}
            {selected.notes && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{selected.notes}</p>
              </div>
            )}
            <div className="space-y-1">
              <Label>Move to Stage</Label>
              <Select
                value={selected.status}
                onChange={(e) => {
                  updateCompany(selected.id, { status: e.target.value as CompanyStatus })
                  setSelected({ ...selected, status: e.target.value as CompanyStatus })
                }}
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s} value={s}>{COMPANY_STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button size="sm" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
