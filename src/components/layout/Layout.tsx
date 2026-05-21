import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useTheme } from '../../lib/theme'
import { cn } from '../../lib/utils'

export function Layout() {
  const collapsed = useTheme((s) => s.sidebarCollapsed)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main
        className={cn(
          'flex flex-1 flex-col min-w-0 transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-60'
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}
