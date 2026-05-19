import type { ReactNode } from 'react'

interface TopBarProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-900 leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </header>
  )
}
