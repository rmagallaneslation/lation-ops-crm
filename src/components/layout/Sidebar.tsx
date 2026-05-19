import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  KanbanSquare,
  Users,
  Briefcase,
  CalendarCheck2,
  ClipboardList,
  BarChart3,
  Activity,
  Settings,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { getInitials } from '../../lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/prospects', label: 'Prospects', icon: Building2 },
  { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/clients', label: 'Clients', icon: Briefcase },
  { to: '/hiring-needs', label: 'Hiring Needs', icon: ClipboardList },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/interviews', label: 'Interviews', icon: CalendarCheck2 },
  { to: '/scorecards', label: 'Scorecards', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/activities', label: 'Activities', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const TEAM = ['Roberto', 'Reynaldo', 'Santiago'] as const

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-[#0F172A]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-white/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white text-xs font-bold">
          L
        </div>
        <span className="text-sm font-semibold text-white">Lation Ops</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Team */}
      <div className="border-t border-white/10 px-4 py-4">
        <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Team</p>
        <div className="flex gap-2">
          {TEAM.map((name) => (
            <div
              key={name}
              title={name}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-300"
            >
              {getInitials(name)}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
