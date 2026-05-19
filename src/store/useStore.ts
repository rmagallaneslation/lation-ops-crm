import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Company, HiringNeed, Candidate, Interview, Scorecard, Activity } from '../types'
import {
  mockCompanies,
  mockHiringNeeds,
  mockCandidates,
  mockInterviews,
  mockScorecards,
  mockActivities,
} from '../data/mockData'
import { generateId } from '../lib/utils'

type State = {
  companies: Company[]
  hiringNeeds: HiringNeed[]
  candidates: Candidate[]
  interviews: Interview[]
  scorecards: Scorecard[]
  activities: Activity[]
}

type Actions = {
  // Companies
  addCompany: (c: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCompany: (id: string, patch: Partial<Company>) => void
  deleteCompany: (id: string) => void

  // HiringNeeds
  addHiringNeed: (h: Omit<HiringNeed, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateHiringNeed: (id: string, patch: Partial<HiringNeed>) => void
  deleteHiringNeed: (id: string) => void

  // Candidates
  addCandidate: (c: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCandidate: (id: string, patch: Partial<Candidate>) => void
  deleteCandidate: (id: string) => void

  // Interviews
  addInterview: (i: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateInterview: (id: string, patch: Partial<Interview>) => void
  deleteInterview: (id: string) => void

  // Scorecards
  addScorecard: (s: Omit<Scorecard, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateScorecard: (id: string, patch: Partial<Scorecard>) => void
  deleteScorecard: (id: string) => void

  // Activities
  addActivity: (a: Omit<Activity, 'id' | 'createdAt'>) => void
  updateActivity: (id: string, patch: Partial<Activity>) => void
  deleteActivity: (id: string) => void

  // Utility
  resetToMockData: () => void
  exportData: () => string
  importData: (json: string) => void
}

const now = () => new Date().toISOString()

const initialState: State = {
  companies: mockCompanies,
  hiringNeeds: mockHiringNeeds,
  candidates: mockCandidates,
  interviews: mockInterviews,
  scorecards: mockScorecards,
  activities: mockActivities,
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addCompany: (c) =>
        set((s) => ({
          companies: [
            ...s.companies,
            { ...c, id: generateId('co'), createdAt: now(), updatedAt: now() },
          ],
        })),
      updateCompany: (id, patch) =>
        set((s) => ({
          companies: s.companies.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: now() } : c
          ),
        })),
      deleteCompany: (id) =>
        set((s) => ({ companies: s.companies.filter((c) => c.id !== id) })),

      addHiringNeed: (h) =>
        set((s) => ({
          hiringNeeds: [
            ...s.hiringNeeds,
            { ...h, id: generateId('hn'), createdAt: now(), updatedAt: now() },
          ],
        })),
      updateHiringNeed: (id, patch) =>
        set((s) => ({
          hiringNeeds: s.hiringNeeds.map((h) =>
            h.id === id ? { ...h, ...patch, updatedAt: now() } : h
          ),
        })),
      deleteHiringNeed: (id) =>
        set((s) => ({ hiringNeeds: s.hiringNeeds.filter((h) => h.id !== id) })),

      addCandidate: (c) =>
        set((s) => ({
          candidates: [
            ...s.candidates,
            { ...c, id: generateId('ca'), createdAt: now(), updatedAt: now() },
          ],
        })),
      updateCandidate: (id, patch) =>
        set((s) => ({
          candidates: s.candidates.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: now() } : c
          ),
        })),
      deleteCandidate: (id) =>
        set((s) => ({ candidates: s.candidates.filter((c) => c.id !== id) })),

      addInterview: (i) =>
        set((s) => ({
          interviews: [
            ...s.interviews,
            { ...i, id: generateId('int'), createdAt: now(), updatedAt: now() },
          ],
        })),
      updateInterview: (id, patch) =>
        set((s) => ({
          interviews: s.interviews.map((i) =>
            i.id === id ? { ...i, ...patch, updatedAt: now() } : i
          ),
        })),
      deleteInterview: (id) =>
        set((s) => ({ interviews: s.interviews.filter((i) => i.id !== id) })),

      addScorecard: (s) =>
        set((st) => ({
          scorecards: [
            ...st.scorecards,
            { ...s, id: generateId('sc'), createdAt: now(), updatedAt: now() },
          ],
        })),
      updateScorecard: (id, patch) =>
        set((s) => ({
          scorecards: s.scorecards.map((sc) =>
            sc.id === id ? { ...sc, ...patch, updatedAt: now() } : sc
          ),
        })),
      deleteScorecard: (id) =>
        set((s) => ({ scorecards: s.scorecards.filter((sc) => sc.id !== id) })),

      addActivity: (a) =>
        set((s) => ({
          activities: [
            { ...a, id: generateId('act'), createdAt: now() },
            ...s.activities,
          ],
        })),
      updateActivity: (id, patch) =>
        set((s) => ({
          activities: s.activities.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        })),
      deleteActivity: (id) =>
        set((s) => ({ activities: s.activities.filter((a) => a.id !== id) })),

      resetToMockData: () => set(initialState),

      exportData: () => JSON.stringify(get(), null, 2),

      importData: (json) => {
        try {
          const data = JSON.parse(json) as Partial<State>
          set((s) => ({ ...s, ...data }))
        } catch {
          // invalid JSON — ignore
        }
      },
    }),
    {
      name: 'lation-crm-v2',
    }
  )
)
