/** Generic CSV export — pass array of objects, downloads file */
export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) return

  const cols = columns ?? (Object.keys(data[0]) as (keyof T)[]).map((k) => ({ key: k, label: String(k) }))

  const header = cols.map((c) => JSON.stringify(c.label)).join(',')
  const rows = data.map((row) =>
    cols.map((c) => {
      const val = row[c.key]
      if (val === null || val === undefined) return ''
      if (Array.isArray(val)) return JSON.stringify(val.join('; '))
      return JSON.stringify(String(val))
    }).join(',')
  )

  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
