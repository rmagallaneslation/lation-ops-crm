import { useState, useEffect, useRef } from 'react'
import { Search, Users, Building2, Briefcase, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLationStore } from '../../store/useLationStore'

type Result = {
  id: string
  type: 'talent' | 'employer' | 'position'
  label: string
  sub: string
  href: string
}

const TYPE_ICON = {
  talent:   Users,
  employer: Building2,
  position: Briefcase,
}

const TYPE_LABEL = {
  talent:   'Talentos',
  employer: 'Empresas',
  position: 'Posiciones',
}

export function SearchModal() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const talents = useLationStore((s) => s.talents)
  const employers = useLationStore((s) => s.employers)
  const positions = useLationStore((s) => s.positions)

  // Cmd+K / Ctrl+K trigger
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const q = query.toLowerCase().trim()

  const results: Result[] = q.length < 1 ? [] : [
    ...talents
      .filter((t) =>
        t.full_name.toLowerCase().includes(q) ||
        t.specialization.toLowerCase().includes(q) ||
        t.tech_stack.some((s) => s.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .map((t) => ({
        id: t.id, type: 'talent' as const,
        label: t.full_name,
        sub: `${t.specialization} · ${t.country}`,
        href: `/talents/${t.id}`,
      })),
    ...employers
      .filter((e) =>
        e.company_name.toLowerCase().includes(q) ||
        e.industry.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((e) => ({
        id: e.id, type: 'employer' as const,
        label: e.company_name,
        sub: `${e.industry} · ${e.country}`,
        href: `/employers/${e.id}`,
      })),
    ...positions
      .filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.specialization.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((p) => ({
        id: p.id, type: 'position' as const,
        label: p.title,
        sub: `${t(`level.${p.level}`)} · ${t(`status.${p.status}`)}`,
        href: `/positions`,
      })),
  ]

  // Group by type
  const groups = (Object.keys(TYPE_LABEL) as Result['type'][])
    .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
    .filter((g) => g.items.length > 0)

  function go(href: string) {
    navigate(href)
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-300"
      >
        <Search className="h-3.5 w-3.5" />
        <span>{t('common.search')}...</span>
        <kbd className="ml-2 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-600 dark:bg-slate-700">
          ⌘K
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
          <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.global_search_placeholder', 'Search talents, employers, positions...')}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100"
          />
          <button onClick={() => setOpen(false)} className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {query.length > 0 && groups.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">{t('common.no_results_for', { query, defaultValue: `No results for "${query}"` })}</p>
          ) : query.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">{t('common.type_to_search', 'Type to search...')}</p>
          ) : (
            groups.map(({ type, items }) => {
              const Icon = TYPE_ICON[type]
              return (
                <div key={type}>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    {t(`nav.${type === 'talent' ? 'talents' : type === 'employer' ? 'employers' : 'positions'}`, TYPE_LABEL[type])}
                  </p>
                  {items.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => go(r.href)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                        <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{r.label}</p>
                        <p className="truncate text-xs text-slate-400">{r.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
