import { useNavigate } from 'react-router-dom'
import { Building2, Users, ClipboardList, ChevronRight } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Card, CardContent } from '../../components/ui/card'
import { EmptyState } from '../../components/shared/EmptyState'
import { useStore } from '../../store/useStore'

export function Clients() {
  const navigate = useNavigate()
  const companies = useStore((s) => s.companies)
  const candidates = useStore((s) => s.candidates)
  const hiringNeeds = useStore((s) => s.hiringNeeds)

  const clients = companies.filter((c) => c.status === 'closed_won')

  return (
    <div className="flex flex-col">
      <TopBar title="Clients" subtitle={`${clients.length} active clients`} />
      <div className="flex-1 overflow-y-auto p-6">
        {clients.length === 0 ? (
          <EmptyState title="No active clients" description="Close a deal to see clients here" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map((c) => {
              const needs = hiringNeeds.filter((h) => h.companyId === c.id)
              const cands = candidates.filter((ca) => ca.companyId === c.id)
              return (
                <Card
                  key={c.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/clients/${c.id}`)}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.industry}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-slate-500">{c.city ?? ''}{c.city ? ', ' : ''}{c.country} · {c.companySize ?? '—'} employees</p>
                    {c.contactName && (
                      <p className="text-xs text-slate-600">{c.contactName} · {c.contactRole}</p>
                    )}
                    <div className="flex gap-4 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <ClipboardList className="h-3 w-3 text-slate-400" />
                        {needs.length} roles
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-400" />
                        {cands.length} candidates
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {c.owner}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
