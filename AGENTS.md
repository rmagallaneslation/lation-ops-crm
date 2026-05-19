# AGENTS.md — Lation Ops CRM

## Project Overview

Internal CRM and operations platform for Lation, a technical interview outsourcing company.
Used by: Roberto, Reynaldo, Santiago.

## Tech Stack

- React 18 + Vite + TypeScript (strict)
- Tailwind CSS v3
- shadcn/ui design system (custom, not CLI-installed)
- Radix UI primitives
- Zustand v5 with persist (localStorage)
- React Router v6
- Recharts (dashboard charts)
- Lucide React (icons)
- date-fns (formatting)

## Architecture

```
src/
  app/           App.tsx — root router
  features/      One folder per feature (dashboard, prospects, pipeline, clients, ...)
  components/
    ui/          Primitive UI components (button, card, badge, input, dialog, ...)
    layout/      Sidebar, TopBar, Layout
    shared/      EmptyState, StatusBadge
  lib/           utils.ts, formatters.ts, status.ts
  types/         index.ts — all TypeScript types
  data/          mockData.ts — demo data (fictional companies only)
  store/         useStore.ts — Zustand store
```

## Key Entities

- **Company** — can be a prospect or a client (status: closed_won = active client)
- **HiringNeed** — a role to fill, linked to a Company
- **Candidate** — evaluated person, linked to Company + HiringNeed
- **Interview** — evaluation session, linked to Candidate
- **Scorecard** — 6-dimension scoring (1-5 each), linked to Interview
- **Activity** — CRM interaction log (call, email, meeting, etc.), linked to Company

## Rules

- No real client names in mock data. Fictional companies only.
- No Supabase, authentication, Google Calendar, Gmail, WhatsApp, AI, PDF generation.
- No backend dependencies. localStorage-first.
- No `any`. Keep TypeScript strict.
- Do not add unused imports (tsconfig has noUnusedLocals/noUnusedParameters).
- Do not add comments unless the WHY is non-obvious.
- Prefer editing existing files over creating new ones.
- Run `npx tsc --noEmit` before declaring work done.

## Commands

```bash
npm install     # install dependencies
npm run dev     # start dev server at localhost:5173
npm run build   # production build (tsc + vite)
npx tsc --noEmit  # type check only
```

## Component Patterns

- UI components: CVA + `cn()` utility for variants
- Forms: controlled state with `set<K extends keyof Form>(k, v)` pattern
- Dialogs: `<Dialog open={} onClose={}>` — uses createPortal + Escape key
- Empty states: `<EmptyState title="" action={{}} />`
- Status badges: use `<CompanyStatusBadge status={} />` etc. from shared/StatusBadge.tsx
- All status colors/labels come from `src/lib/status.ts`

## localStorage Key

`lation-crm-v2` — Zustand persist key. Increment if schema changes.
