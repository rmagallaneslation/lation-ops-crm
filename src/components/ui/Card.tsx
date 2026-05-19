import { cn } from '../../lib/utils'

export function Card({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)} onClick={onClick}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('flex items-center justify-between px-5 pt-5 pb-3', className)}>{children}</div>
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn('text-sm font-semibold text-slate-700', className)}>{children}</h3>
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-5 pb-5', className)}>{children}</div>
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, sub, icon, className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-1 p-5', className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </Card>
  )
}
