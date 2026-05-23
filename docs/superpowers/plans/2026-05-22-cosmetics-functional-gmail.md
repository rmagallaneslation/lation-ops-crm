# Cosmetics + Functional + Gmail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visual polish, bulk actions, CSV export, Gmail Compose, expanded column visibility, animated status badges, kanban avatars, skeleton loaders, and pipeline-per-position view — all without schema changes.

**Architecture:** All changes are pure frontend. No new Supabase tables. Persistent preferences (filters, column visibility) use `localStorage`. Gmail Compose uses `mailto:` links with pre-filled templates. Pipeline view is a computed breakdown of existing `applications` data grouped by `position_id` and `status`.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind v3, Zustand (`useLationStore`), `lucide-react`, `react-hot-toast`, `date-fns` (already installed).

**Out of scope (separate plan required — needs Supabase schema):**
- Notes / activity log per talent
- Reminders / follow-up flags

---

## File Map

| File | Change |
|---|---|
| `src/features/talents/Talents.tsx` | Expand columns (+ 8 new ColKeys), bulk select + status change, saved filters, CSV export button |
| `src/features/talents/TalentDetail.tsx` | Gmail Compose button, skeleton loader |
| `src/features/employers/EmployerDetail.tsx` | Gmail Compose button, skeleton loader, pipeline-per-position section |
| `src/features/applications/Applications.tsx` | Avatar initials on Kanban cards |
| `src/components/shared/LationStatusBadge.tsx` | Animated pulse dot for `in_process` and `placed` statuses |
| `src/lib/csv.ts` | Already exists — no changes needed |

---

## Task 1: Expand Talents column visibility (8 new columns)

**Files:**
- Modify: `src/features/talents/Talents.tsx`

**Context:** `ColKey` union type and `ALL_COLUMNS` array live above the component. The table conditionally renders `<th>` and `<td>` based on `visibleCols.has(key)`. New columns: `phone`, `timezone`, `years_of_experience`, `employment_type`, `available_from`, `salary`, `languages`. `salary` is a combined column showing `salary_min – salary_max currency`.

- [ ] **Step 1: Expand `ColKey` type**

Replace the current `ColKey` type (line ~39):

```ts
type ColKey =
  | 'name' | 'country' | 'level' | 'specialization' | 'stack' | 'status' | 'links'
  | 'phone' | 'timezone' | 'years_of_experience' | 'employment_type'
  | 'available_from' | 'salary' | 'languages'
```

- [ ] **Step 2: Expand `ALL_COLUMNS` array**

Replace the current `ALL_COLUMNS` array (lines ~41-49):

```ts
const ALL_COLUMNS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: 'name',                label: 'Nombre',          defaultVisible: true  },
  { key: 'country',             label: 'País',             defaultVisible: true  },
  { key: 'level',               label: 'Nivel',            defaultVisible: true  },
  { key: 'specialization',      label: 'Especialización',  defaultVisible: true  },
  { key: 'stack',               label: 'Stack',            defaultVisible: true  },
  { key: 'status',              label: 'Status',           defaultVisible: true  },
  { key: 'links',               label: 'Links',            defaultVisible: true  },
  { key: 'phone',               label: 'Teléfono',         defaultVisible: false },
  { key: 'timezone',            label: 'Timezone',         defaultVisible: false },
  { key: 'years_of_experience', label: 'Experiencia',      defaultVisible: false },
  { key: 'employment_type',     label: 'Tipo Empleo',      defaultVisible: false },
  { key: 'available_from',      label: 'Disponible desde', defaultVisible: false },
  { key: 'salary',              label: 'Salario',          defaultVisible: false },
  { key: 'languages',           label: 'Idiomas',          defaultVisible: false },
]
```

- [ ] **Step 3: Add new `<th>` headers**

The `<thead>` already maps `ALL_COLUMNS.filter(c => visibleCols.has(c.key))` — no header change needed since labels come from `ALL_COLUMNS`.

- [ ] **Step 4: Add new `<td>` cells inside the `filtered.map` row**

After the existing `visibleCols.has('links')` block, before the eye-icon `<td>`, add:

```tsx
{visibleCols.has('phone') && (
  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
    {t.phone || <span className="text-slate-300 dark:text-slate-600">—</span>}
  </td>
)}
{visibleCols.has('timezone') && (
  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
    {t.timezone || <span className="text-slate-300 dark:text-slate-600">—</span>}
  </td>
)}
{visibleCols.has('years_of_experience') && (
  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
    {t.years_of_experience != null ? `${t.years_of_experience} yrs` : <span className="text-slate-300 dark:text-slate-600">—</span>}
  </td>
)}
{visibleCols.has('employment_type') && (
  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs capitalize">
    {t.employment_type?.replace('_', ' ') || <span className="text-slate-300 dark:text-slate-600">—</span>}
  </td>
)}
{visibleCols.has('available_from') && (
  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
    {t.available_from || <span className="text-slate-300 dark:text-slate-600">—</span>}
  </td>
)}
{visibleCols.has('salary') && (
  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
    {t.preferred_salary_min && t.preferred_salary_max
      ? `${t.preferred_salary_min.toLocaleString()}–${t.preferred_salary_max.toLocaleString()} ${t.preferred_salary_currency ?? 'USD'}`
      : <span className="text-slate-300 dark:text-slate-600">—</span>}
  </td>
)}
{visibleCols.has('languages') && (
  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
    {t.languages?.join(', ') || <span className="text-slate-300 dark:text-slate-600">—</span>}
  </td>
)}
```

- [ ] **Step 5: Verify in browser**

Open `/talents`. Click "Columnas" → new columns appear in the list (defaultVisible: false so unchecked). Toggle "Teléfono" on → column appears in table. Reload → state persists from localStorage.

- [ ] **Step 6: Commit**

```bash
git add src/features/talents/Talents.tsx
git commit -m "feat(talents): expand column visibility with 8 new data columns"
```

---

## Task 2: Bulk actions — select rows + bulk status change

**Files:**
- Modify: `src/features/talents/Talents.tsx`

**Context:** Add a checkbox column as the first column (always visible, not in `ALL_COLUMNS`). When ≥1 row selected, show a floating action bar at the bottom with a "Change status" dropdown and "Deselect all" button. Uses `updateTalent` from the store.

- [ ] **Step 1: Add `selectedIds` state inside `Talents()`**

```ts
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
const [bulkStatus, setBulkStatus] = useState<TalentStatus | ''>('')
```

- [ ] **Step 2: Add helper functions**

```ts
function toggleSelect(id: string) {
  setSelectedIds((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
}

function toggleSelectAll() {
  if (selectedIds.size === filtered.length) {
    setSelectedIds(new Set())
  } else {
    setSelectedIds(new Set(filtered.map((t) => t.id)))
  }
}

function applyBulkStatus() {
  if (!bulkStatus) return
  selectedIds.forEach((id) => updateTalent(id, { status: bulkStatus as TalentStatus }))
  toast.success(`${selectedIds.size} talentos actualizados`)
  setSelectedIds(new Set())
  setBulkStatus('')
}
```

- [ ] **Step 3: Add checkbox `<th>` as the first header column**

In `<thead>`, before the `ALL_COLUMNS.filter(...)` map, add:

```tsx
<th className="px-4 py-3 w-10">
  <input
    type="checkbox"
    checked={filtered.length > 0 && selectedIds.size === filtered.length}
    onChange={toggleSelectAll}
    className="h-3.5 w-3.5 rounded accent-orange-500"
  />
</th>
```

- [ ] **Step 4: Add checkbox `<td>` as the first cell in each row**

At the start of the `filtered.map` row, before `visibleCols.has('name')`, add:

```tsx
<td className="px-4 py-3 w-10" onClick={(e) => e.stopPropagation()}>
  <input
    type="checkbox"
    checked={selectedIds.has(t.id)}
    onChange={() => toggleSelect(t.id)}
    className="h-3.5 w-3.5 rounded accent-orange-500"
  />
</td>
```

- [ ] **Step 5: Add floating bulk action bar**

After the closing `</div>` of the table container (and before the dialogs), add:

```tsx
{selectedIds.size > 0 && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
    </span>
    <select
      value={bulkStatus}
      onChange={(e) => setBulkStatus(e.target.value as TalentStatus | '')}
      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
    >
      <option value="">Cambiar status…</option>
      <option value="prospect">Prospecto</option>
      <option value="available">Available</option>
      <option value="in_process">In Process</option>
      <option value="placed">Placed</option>
      <option value="inactive">Inactive</option>
    </select>
    <button
      onClick={applyBulkStatus}
      disabled={!bulkStatus}
      className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-40 transition-colors"
    >
      Aplicar
    </button>
    <button
      onClick={() => setSelectedIds(new Set())}
      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
    >
      Cancelar
    </button>
  </div>
)}
```

- [ ] **Step 6: Verify in browser**

Check a few rows → floating bar appears. Select "In Process" → click Aplicar → toast fires, statuses update, bar disappears.

- [ ] **Step 7: Commit**

```bash
git add src/features/talents/Talents.tsx
git commit -m "feat(talents): bulk select + status change for multiple talents"
```

---

## Task 3: CSV export button + Saved filters

**Files:**
- Modify: `src/features/talents/Talents.tsx`

**Context:** `src/lib/csv.ts` already exports `exportToCsv<T>()`. Saved filters store the current filter combination in `localStorage` under `lation-talent-saved-filters` as a named preset. One slot only (last saved) for simplicity.

### Part A — Export CSV

- [ ] **Step 1: Import `exportToCsv` at top of Talents.tsx**

```ts
import { exportToCsv } from '../../lib/csv'
```

- [ ] **Step 2: Add export handler inside `Talents()`**

```ts
function handleExportCsv() {
  exportToCsv(filtered, 'talentos', [
    { key: 'full_name',              label: 'Nombre' },
    { key: 'email',                  label: 'Email' },
    { key: 'country',                label: 'País' },
    { key: 'level',                  label: 'Nivel' },
    { key: 'specialization',         label: 'Especialización' },
    { key: 'status',                 label: 'Status' },
    { key: 'phone',                  label: 'Teléfono' },
    { key: 'timezone',               label: 'Timezone' },
    { key: 'years_of_experience',    label: 'Experiencia (años)' },
    { key: 'employment_type',        label: 'Tipo Empleo' },
    { key: 'available_from',         label: 'Disponible desde' },
    { key: 'preferred_salary_min',   label: 'Salario Min' },
    { key: 'preferred_salary_max',   label: 'Salario Max' },
    { key: 'preferred_salary_currency', label: 'Moneda' },
    { key: 'languages',              label: 'Idiomas' },
  ])
  toast.success(`${filtered.length} talentos exportados`)
}
```

Note: `exportToCsv` accepts `Record<string, unknown>[]`. Cast: `exportToCsv(filtered as unknown as Record<string, unknown>[], ...)`.

- [ ] **Step 3: Add export button in TopBar action**

Update the `action` prop passed to `<TopBar>`:

```tsx
action={
  <div className="flex items-center gap-2">
    <Button size="sm" variant="secondary" onClick={handleExportCsv}>
      <Download className="h-4 w-4" /> Export CSV
    </Button>
    <Button size="sm" onClick={openAdd}>
      <Plus className="h-4 w-4" /> Add Talent
    </Button>
  </div>
}
```

Add `Download` to the lucide-react import line.

### Part B — Saved filters (single slot)

- [ ] **Step 4: Add saved filter helpers inside `Talents()`**

```ts
const FILTER_KEY = 'lation-talent-saved-filter'

function saveFilters() {
  const saved = { search, filterStatus, filterLevel, filterCountry, filterSpecialization }
  localStorage.setItem(FILTER_KEY, JSON.stringify(saved))
  toast.success('Filtros guardados')
}

function loadFilters() {
  try {
    const raw = localStorage.getItem(FILTER_KEY)
    if (!raw) return
    const saved = JSON.parse(raw) as {
      search: string; filterStatus: string; filterLevel: string
      filterCountry: string; filterSpecialization: string
    }
    setSearch(saved.search)
    setFilterStatus(saved.filterStatus)
    setFilterLevel(saved.filterLevel)
    setFilterCountry(saved.filterCountry)
    setFilterSpecialization(saved.filterSpecialization)
    toast.success('Filtros cargados')
  } catch { /* ignore */ }
}

const hasSavedFilter = !!localStorage.getItem(FILTER_KEY)
```

- [ ] **Step 5: Add save/load buttons in filter bar**

After the "Columnas" button's `</div>`, add:

```tsx
<button
  onClick={saveFilters}
  title="Guardar filtros actuales"
  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
>
  <Bookmark className="h-3.5 w-3.5" />
  Guardar filtro
</button>
{hasSavedFilter && (
  <button
    onClick={loadFilters}
    title="Cargar filtros guardados"
    className="flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-400 transition-colors"
  >
    <BookmarkCheck className="h-3.5 w-3.5" />
    Mis filtros
  </button>
)}
```

Add `Bookmark`, `BookmarkCheck`, `Download` to the lucide-react import.

- [ ] **Step 6: Verify**

Set filters, click "Guardar filtro" → toast. Reload page, click "Mis filtros" → filters restored. Click "Export CSV" → `.csv` file downloads.

- [ ] **Step 7: Commit**

```bash
git add src/features/talents/Talents.tsx
git commit -m "feat(talents): CSV export + saved filter preset"
```

---

## Task 4: Animated status badges (pulse dot)

**Files:**
- Modify: `src/components/shared/LationStatusBadge.tsx`

**Context:** `TalentStatusBadge` renders a pill. For `in_process` and `placed` statuses, prepend a small pulsing dot using `animate-pulse`. The dot color matches the badge color.

- [ ] **Step 1: Update `TalentStatusBadge` to include pulse dot**

Read the current file, then update the `TalentStatusBadge` component to:

```tsx
const PULSE_STATUSES: Partial<Record<TalentStatus, string>> = {
  in_process: 'bg-amber-500',
  placed:     'bg-blue-500',
  available:  'bg-emerald-500',
}

export function TalentStatusBadge({ status }: { status: TalentStatus }) {
  const pulseColor = PULSE_STATUSES[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${TALENT_STATUS_STYLES[status]}`}>
      {pulseColor && (
        <span className={`h-1.5 w-1.5 rounded-full ${pulseColor} animate-pulse`} />
      )}
      {TALENT_STATUS_LABELS[status]}
    </span>
  )
}
```

Note: Check what constants (`TALENT_STATUS_STYLES`, `TALENT_STATUS_LABELS`) are defined in the existing file before editing — use those exact names.

- [ ] **Step 2: Verify**

Open `/talents` table. `in_process` and `placed` badges show a pulsing dot. Open `/talents/:id` (TalentDetail) — same badge component renders with dot there too.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/LationStatusBadge.tsx
git commit -m "feat(ui): animated pulse dot on in_process, placed, available status badges"
```

---

## Task 5: Avatar initials on Kanban cards (Applications)

**Files:**
- Modify: `src/features/applications/Applications.tsx`

**Context:** Each kanban `AppCard` shows talent name + position title. Add a small initials avatar (same pattern as Talents table: gradient circle with 2-letter initials from `full_name`).

- [ ] **Step 1: Read Applications.tsx to find the `AppCard` component render**

Look for where `talent?.full_name` is rendered inside the card.

- [ ] **Step 2: Add avatar before the talent name**

Inside `AppCard` (or the inline card render), wrap the top of the card content to include:

```tsx
<div className="flex items-center gap-2 mb-2">
  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-semibold text-white">
    {(app.talent?.full_name ?? '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
  </div>
  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
    {app.talent?.full_name ?? 'Desconocido'}
  </p>
</div>
```

Remove or replace the existing `full_name` text element so it's not duplicated.

- [ ] **Step 3: Verify**

Open `/applications` → Kanban view. Each card shows a blue/indigo avatar circle with initials.

- [ ] **Step 4: Commit**

```bash
git add src/features/applications/Applications.tsx
git commit -m "feat(applications): initials avatar on kanban cards"
```

---

## Task 6: Skeleton loaders on TalentDetail + EmployerDetail

**Files:**
- Modify: `src/features/talents/TalentDetail.tsx`
- Modify: `src/features/employers/EmployerDetail.tsx`

**Context:** When `talent` or `employer` is `undefined` (still loading from Supabase), show a skeleton instead of "not found". `SkeletonTable` and `SkeletonKpi` already exist in `src/components/shared/SkeletonCard.tsx`.

- [ ] **Step 1: Import skeleton in TalentDetail**

```ts
import { SkeletonTable } from '../../components/shared/SkeletonCard'
```

- [ ] **Step 2: Replace the "not found" early return with a loading skeleton**

Current code shows "Talento no encontrado." when `!talent`. The store loads async, so on first render `talent` may be undefined even though it exists in the DB. Distinguish loading from "truly not found" by checking if the store has finished loading. Simpler approach: show skeleton if talents array is empty (store not yet populated):

```tsx
const talents = useLationStore((s) => s.talents)

if (!talent) {
  if (talents.length === 0) {
    // Still loading
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6 space-y-4">
        <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-32 w-full rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <SkeletonTable rows={5} cols={4} />
      </div>
    )
  }
  // Truly not found
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-slate-500">Talento no encontrado.</p>
      <button onClick={() => navigate('/talents')} className="text-sm text-orange-600 hover:underline">
        Volver a Talentos
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Apply same pattern in EmployerDetail**

Read `src/features/employers/EmployerDetail.tsx`. Find the `!employer` early return. Apply the same pattern:

```tsx
const employers = useLationStore((s) => s.employers)

if (!employer) {
  if (employers.length === 0) {
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6 space-y-4">
        <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-32 w-full rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <SkeletonTable rows={5} cols={4} />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-slate-500">Empresa no encontrada.</p>
      <button onClick={() => navigate('/employers')} className="text-sm text-orange-600 hover:underline">
        Volver a Empresas
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/talents/TalentDetail.tsx src/features/employers/EmployerDetail.tsx
git commit -m "feat(detail): skeleton loader while store is populating from Supabase"
```

---

## Task 7: Gmail Compose button

**Files:**
- Modify: `src/features/talents/TalentDetail.tsx`
- Modify: `src/features/employers/EmployerDetail.tsx`

**Context:** A "Contactar por Email" button that opens the user's email client pre-filled via `mailto:` with subject and body. No server-side component needed.

- [ ] **Step 1: Add `buildGmailLink` helper (inline, no new file)**

In TalentDetail, before the `return` statement, add:

```ts
function buildMailtoLink(to: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const talentMailto = talent.email
  ? buildMailtoLink(
      talent.email,
      `Oportunidad laboral – ${talent.specialization} ${talent.level}`,
      `Hola ${talent.full_name.split(' ')[0]},\n\nMe comunico desde LATION para comentarte sobre una oportunidad que podría interesarte.\n\n¿Tienes disponibilidad para una llamada rápida esta semana?\n\nSaludos,\nEquipo LATION`
    )
  : null
```

- [ ] **Step 2: Add the button in TalentDetail header action area**

Find where the Back button and title are rendered. Add the Gmail button nearby (visible only when `talent.email` exists):

```tsx
{talentMailto && (
  <a
    href={talentMailto}
    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
  >
    <Mail className="h-3.5 w-3.5" />
    Contactar por Email
  </a>
)}
```

Ensure `Mail` is already imported from `lucide-react` (it is).

- [ ] **Step 3: Add Gmail Compose to EmployerDetail**

In EmployerDetail, apply same pattern using `employer.contact_email` or `employer.email`:

```ts
const employerMailto = (employer.contact_email || employer.email)
  ? buildMailtoLink(
      employer.contact_email || employer.email,
      `Colaboración de talento – LATION`,
      `Hola ${employer.contact_name || employer.company_name},\n\nDesde LATION queremos exploramos oportunidades de colaboración para cubrir posiciones en ${employer.company_name}.\n\n¿Podemos agendar una llamada?\n\nSaludos,\nEquipo LATION`
    )
  : null
```

Add the same button pattern in the EmployerDetail header area.

- [ ] **Step 4: Verify**

Open a talent detail with an email set → click "Contactar por Email" → mail client opens with pre-filled subject and body. Same for employer detail.

- [ ] **Step 5: Commit**

```bash
git add src/features/talents/TalentDetail.tsx src/features/employers/EmployerDetail.tsx
git commit -m "feat: Gmail Compose button in TalentDetail and EmployerDetail with pre-filled template"
```

---

## Task 8: Pipeline per position in EmployerDetail

**Files:**
- Modify: `src/features/employers/EmployerDetail.tsx`

**Context:** The EmployerDetail already shows a list of positions. Extend it to show, per position, how many applications are at each status stage. Use the existing `applications` array from the store — filter by `position_id`.

- [ ] **Step 1: Read EmployerDetail to understand current positions section**

Find where positions are rendered (likely a `positions.filter(p => p.employer_id === id)` block).

- [ ] **Step 2: Add pipeline breakdown per position**

Replace or extend the positions rendering. For each position, compute a status breakdown:

```tsx
const APP_STATUSES = ['applied', 'screening', 'interview', 'reviewed', 'offer_sent', 'accepted', 'rejected'] as const

const STAGE_COLORS: Record<string, string> = {
  applied:    'bg-blue-500',
  screening:  'bg-yellow-500',
  interview:  'bg-violet-500',
  reviewed:   'bg-slate-400',
  offer_sent: 'bg-orange-500',
  accepted:   'bg-emerald-500',
  rejected:   'bg-red-400',
}
```

Inside the positions map:

```tsx
{employerPositions.map((pos) => {
  const posApps = applications.filter((a) => a.position_id === pos.id)
  const byStatus = APP_STATUSES.reduce((acc, s) => {
    acc[s] = posApps.filter((a) => a.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div key={pos.id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{pos.title}</p>
          <p className="text-xs text-slate-400 capitalize">{pos.status} · {pos.location ?? 'Remote'}</p>
        </div>
        <span className="text-xs font-medium text-slate-500">{posApps.length} aplic.</span>
      </div>
      {posApps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {APP_STATUSES.filter((s) => byStatus[s] > 0).map((s) => (
            <span key={s} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${STAGE_COLORS[s]}`}>
              {byStatus[s]} {s.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}
      {posApps.length === 0 && (
        <p className="text-xs text-slate-400">Sin aplicaciones aún</p>
      )}
    </div>
  )
})}
```

Also ensure `applications` is imported from the store at the top of EmployerDetail:

```ts
const applications = useLationStore((s) => s.applications)
```

- [ ] **Step 3: Verify**

Open an employer detail that has positions with applications → each position card shows colored stage chips. Positions with no applications show "Sin aplicaciones aún".

- [ ] **Step 4: Commit**

```bash
git add src/features/employers/EmployerDetail.tsx
git commit -m "feat(employers): pipeline stage breakdown per position in EmployerDetail"
```

---

## Self-Review Checklist

- [x] **Column expansion**: 8 new ColKeys defined, `ALL_COLUMNS` expanded, all `<td>` cells added
- [x] **Bulk actions**: checkbox column + floating bar + `updateTalent` calls + toast
- [x] **CSV export**: `exportToCsv` wired, `Download` button in TopBar action
- [x] **Saved filters**: `localStorage` save/load, button only shows if saved filter exists
- [x] **Pulse badges**: `TalentStatusBadge` updated with dot for `in_process`, `placed`, `available`
- [x] **Kanban avatars**: `AppCard` shows initials circle
- [x] **Skeleton loaders**: TalentDetail + EmployerDetail distinguish loading from not-found
- [x] **Gmail Compose**: `mailto:` link with pre-filled subject + body in both detail pages
- [x] **Pipeline per position**: `applications` breakdown per `position_id` in EmployerDetail
- [x] **No schema changes**: all features use existing Supabase data

**No placeholders found. All code is complete.**
