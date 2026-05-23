import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Languages,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { getInitials } from '../../lib/utils'
import { useTheme } from '../../lib/theme'
import { useTranslation } from 'react-i18next'

const NAV_KEYS = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard, end: true },
  { to: '/talents', key: 'talents', icon: Users },
  { to: '/employers', key: 'employers', icon: Building2 },
  { to: '/positions', key: 'positions', icon: Briefcase },
  { to: '/applications', key: 'applications', icon: FileText },
  { to: '/placements', key: 'placements', icon: TrendingUp },
  { to: '/settings', key: 'settings', icon: Settings },
] as const

const TEAM = ['Roberto', 'Reynaldo', 'Santiago'] as const

export function Sidebar() {
  const collapsed = useTheme((s) => s.sidebarCollapsed)
  const dark = useTheme((s) => s.dark)
  const toggleSidebar = useTheme((s) => s.toggleSidebar)
  const toggleDark = useTheme((s) => s.toggleDark)
  const { t, i18n } = useTranslation()
  const isES = i18n.language === 'es'
  function toggleLang() { void i18n.changeLanguage(isES ? 'en' : 'es') }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-[#0F172A] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo + collapse toggle */}
      <div className="flex h-14 items-center border-b border-white/10 px-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white text-xs font-bold">
          L
        </div>
        {!collapsed && (
          <span className="ml-2.5 text-sm font-semibold text-white truncate">Lation Ops</span>
        )}
        <button
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="ml-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-0.5">
          {NAV_KEYS.map(({ to, key, icon: Icon, ...rest }) => {
            const label = key === 'settings' ? 'Settings' : t(`nav.${key}`)
            const end = 'end' in rest ? rest.end : undefined
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-lg py-2 text-sm transition-colors',
                      collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    )
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: dark mode toggle + team avatars */}
      <div className="border-t border-white/10 px-3 py-3 space-y-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={cn(
            'flex w-full items-center rounded-lg py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors',
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          )}
        >
          {dark ? <Sun className="h-4 w-4 flex-shrink-0" /> : <Moon className="h-4 w-4 flex-shrink-0" />}
          {!collapsed && (dark ? 'Light Mode' : 'Dark Mode')}
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          title={isES ? 'Switch to English' : 'Cambiar a Español'}
          className={cn(
            'flex w-full items-center rounded-lg py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors',
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          )}
        >
          <Languages className="h-4 w-4 flex-shrink-0" />
          {!collapsed && (isES ? 'English' : 'Español')}
        </button>

        {/* Team avatars */}
        {!collapsed && (
          <div>
            <p className="mb-2 px-1 text-xs font-medium text-slate-500 uppercase tracking-wider">Team</p>
            <div className="flex gap-2 px-1">
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
        )}

        {collapsed && (
          <div className="flex flex-col items-center gap-1.5">
            {TEAM.map((name) => (
              <div
                key={name}
                title={name}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-300"
              >
                {getInitials(name)}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
