import { SearchModal } from '../shared/SearchModal'

interface TopBarProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <SearchModal />
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
