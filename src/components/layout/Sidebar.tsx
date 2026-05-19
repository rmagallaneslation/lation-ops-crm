import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  UserCheck,
  Calendar,
  ClipboardList,
  BarChart2,
} from 'lucide-react'
import { getInitials } from '../../lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/prospects', label: 'Pipeline', icon: TrendingUp, end: false },
  { to: '/clients', label: 'Clients', icon: Building2, end: false },
  { to: '/candidates', label: 'Candidates', icon: UserCheck, end: false },
  { to: '/interviews', label: 'Interviews', icon: Calendar, end: false },
  { to: '/scorecards', label: 'Scorecards', icon: ClipboardList, end: false },
  { to: '/reports', label: 'Reports', icon: BarChart2, end: false },
]

const teamColors: Record<string, string> = {
  R: 'bg-sky-600',
  Re: 'bg-indigo-600',
  S: 'bg-emerald-600',
}

export function Sidebar() {
  const user = 'Roberto'
  const initials = getInitials(user)
  const avatarColor = teamColors[initials[0]] ?? 'bg-sky-600'

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900 flex flex-col z-40">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white"
            >
              <path
                d="M3 13L8 3L13 13M5.5 9.5H10.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none tracking-tight">
              Lation
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Operations CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">
          Main
        </p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <div
            className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm font-medium truncate leading-none">
              {user}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
