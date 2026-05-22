import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useTheme } from '../../lib/theme'
import { cn } from '../../lib/utils'
import { useLationStore } from '../../store/useLationStore'

export function Layout() {
  const collapsed = useTheme((s) => s.sidebarCollapsed)
  const loading = useLationStore((s) => s.loading)
  const error = useLationStore((s) => s.error)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main
        className={cn(
          'flex flex-1 flex-col min-w-0 transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-60'
        )}
      >
        {(loading || error) && (
          <div className={cn(
            'border-b px-6 py-2 text-xs font-medium',
            error
              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'
              : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300'
          )}>
            {error ?? 'Loading Supabase data...'}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
