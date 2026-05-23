// SkeletonCard — matches layout of table rows and KPI cards
// Usage:
//   <SkeletonTable rows={5} cols={6} />   ← for table loading
//   <SkeletonKpi count={6} />             ← for KPI card loading

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="rounded bg-slate-200 dark:bg-slate-700 animate-pulse h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {Array.from({ length: cols }).map((_, ci) => (
                <td key={ci} className="px-4 py-3">
                  {ci === 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="rounded bg-slate-200 dark:bg-slate-700 animate-pulse h-4 w-28" />
                        <div className="rounded bg-slate-200 dark:bg-slate-700 animate-pulse h-3 w-20" />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded bg-slate-200 dark:bg-slate-700 animate-pulse h-4 w-16" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SkeletonKpi({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5"
        >
          <div className="rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse h-9 w-9 mb-3" />
          <div className="rounded bg-slate-200 dark:bg-slate-700 animate-pulse h-6 w-16 mb-2" />
          <div className="rounded bg-slate-200 dark:bg-slate-700 animate-pulse h-4 w-24" />
        </div>
      ))}
    </div>
  )
}
