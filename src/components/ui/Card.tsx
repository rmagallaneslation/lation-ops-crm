import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', padding = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${padding ? 'p-6' : ''} ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-150' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

const iconColors = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
  sky: 'bg-sky-50 text-sky-600',
  slate: 'bg-slate-100 text-slate-600',
  indigo: 'bg-indigo-50 text-indigo-600',
} as const

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: keyof typeof iconColors
  sub?: string
}

export function StatCard({ label, value, icon: Icon, color = 'slate', sub }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColors[color]}`}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 leading-none tabular-nums">{value}</p>
        <p className="text-xs text-slate-500 mt-1 leading-tight">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Card>
  )
}
