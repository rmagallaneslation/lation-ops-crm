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

type NavItem = { to: string; labelKey: string; icon: React.ElementType; end?: boolean }

const NAV_MAIN: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
]

const NAV_CLIENTES: NavItem[] = [
  { to: '/employers', labelKey: 'nav.employers', icon: Building2 },
  { to: '/positions', labelKey: 'nav.positions', icon: Briefcase },
  { to: '/placements', labelKey: 'nav.placements', icon: TrendingUp },
]

const NAV_TALENTOS: NavItem[] = [
  { to: '/talents', labelKey: 'nav.talents', icon: Users },
  { to: '/applications', labelKey: 'nav.applications', icon: FileText },
]

const TEAM = ['Roberto', 'Reynaldo', 'Santiago'] as const

function NavGroup({ label, items, collapsed }: { label: string; items: NavItem[]; collapsed: boolean }) {
  const { t } = useTranslation()
  return (
    <div className="mb-1">
      {!collapsed && (
        <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </p>
      )}
      {collapsed && <div className="my-2 mx-3 border-t border-white/10" />}
      <ul className="space-y-0.5">
        {items.map(({ to, labelKey, icon: Icon, end }) => {
          const itemLabel = t(labelKey)
          return (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              title={collapsed ? itemLabel : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg py-2 text-sm transition-colors',
                  collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                  isActive
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 font-medium border-l-2 border-orange-500'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && itemLabel}
            </NavLink>
          </li>
        )})}
      </ul>
    </div>
  )
}

export function Sidebar() {
  const collapsed = useTheme((s) => s.sidebarCollapsed)
  const dark = useTheme((s) => s.dark)
  const toggleSidebar = useTheme((s) => s.toggleSidebar)
  const toggleDark = useTheme((s) => s.toggleDark)
  const { t, i18n } = useTranslation()
  const isES = i18n.language === 'es'
  function toggleLang() {
    const nextLanguage = isES ? 'en' : 'es'
    localStorage.setItem('lation-language', nextLanguage)
    void i18n.changeLanguage(nextLanguage)
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-[#0F172A] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-white/10 px-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white text-xs font-bold">
          L
        </div>
        {!collapsed && (
          <span className="ml-2.5 text-sm font-semibold text-white truncate">Lation Ops</span>
        )}
        <button
          onClick={toggleSidebar}
          title={collapsed ? 'Expandir' : 'Colapsar'}
          className="ml-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {/* Dashboard — sin label de sección */}
        <ul className="space-y-0.5">
          {NAV_MAIN.map(({ to, labelKey, icon: Icon, end }) => {
            const label = t(labelKey)
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
          )})}
        </ul>

        <NavGroup label={t('nav.employers')} items={NAV_CLIENTES} collapsed={collapsed} />
        <NavGroup label={t('nav.talents')} items={NAV_TALENTOS} collapsed={collapsed} />

        {/* Settings — separado al fondo del nav */}
        {!collapsed && (
          <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            {t('nav.administration', 'Administration')}
          </p>
        )}
        {collapsed && <div className="my-2 mx-3 border-t border-white/10" />}
        <ul className="space-y-0.5">
          <li>
            <NavLink
              to="/settings"
              title={collapsed ? t('nav.settings', 'Settings') : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg py-2 text-sm transition-colors',
                  collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                  isActive
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 font-medium border-l-2 border-orange-500'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                )
              }
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!collapsed && t('nav.settings', 'Settings')}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <button
          onClick={toggleDark}
          title={dark ? 'Modo claro' : 'Modo oscuro'}
          className={cn(
            'flex w-full items-center rounded-lg py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors',
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          )}
        >
          {dark ? <Sun className="h-4 w-4 flex-shrink-0" /> : <Moon className="h-4 w-4 flex-shrink-0" />}
          {!collapsed && (dark ? t('common.light_mode', 'Light Mode') : t('common.dark_mode', 'Dark Mode'))}
        </button>

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
        <div className={cn('pt-2', collapsed ? 'flex flex-col items-center gap-1.5' : 'flex gap-2 px-1')}>
          {TEAM.map((name) => (
            <div
              key={name}
              title={name}
              className={cn(
                'flex items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-300',
                collapsed ? 'h-6 w-6' : 'h-7 w-7'
              )}
            >
              {getInitials(name)}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
