# Lation Ops CRM

Internal operations and CRM platform for Lation — a technical interview outsourcing company.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

| Page | Description |
|------|-------------|
| Dashboard | KPIs, pipeline chart, upcoming interviews, active clients |
| Prospects | Company cards with search, status, priority filters |
| Pipeline | Kanban-style sales funnel |
| Clients | Active client list (status: closed_won) |
| Client Detail | Per-client overview, hiring needs, candidates, interviews |
| Hiring Needs | Role configuration per client |
| Candidates | Candidate pipeline table with CRUD |
| Interviews | Upcoming and past interview tracking |
| Scorecards | 6-dimension scoring with recommendations |
| Reports | Per-client summary with copy-to-clipboard markdown |
| Activities | CRM activity log (calls, emails, meetings, etc.) |
| Settings | Reset demo data, export/import JSON |

## Stack

React 18 · Vite · TypeScript · Tailwind CSS · Zustand · React Router · Recharts · Lucide

## Notes

- Local-first: all data stored in `localStorage`
- No authentication required (internal tool)
- No external integrations (no Supabase, Gmail, Calendar, etc.)
- Demo data uses fictional company names only
