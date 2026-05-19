import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  mockClients,
  mockProspects,
  mockHiringRoles,
  mockCandidates,
  mockInterviews,
  mockScorecards,
} from '../data/mockData'
import type { Client, Prospect, HiringRole, Candidate, Interview, Scorecard } from '../types'

interface StoreState {
  clients: Client[]
  prospects: Prospect[]
  hiringRoles: HiringRole[]
  candidates: Candidate[]
  interviews: Interview[]
  scorecards: Scorecard[]

  // Prospect actions
  addProspect: (prospect: Prospect) => void
  updateProspect: (id: string, data: Partial<Prospect>) => void
  deleteProspect: (id: string) => void

  // Client actions
  addClient: (client: Client) => void
  updateClient: (id: string, data: Partial<Client>) => void

  // HiringRole actions
  addHiringRole: (role: HiringRole) => void
  updateHiringRole: (id: string, data: Partial<HiringRole>) => void
  deleteHiringRole: (id: string) => void

  // Candidate actions
  addCandidate: (candidate: Candidate) => void
  updateCandidate: (id: string, data: Partial<Candidate>) => void

  // Interview actions
  addInterview: (interview: Interview) => void
  updateInterview: (id: string, data: Partial<Interview>) => void

  // Scorecard actions
  addScorecard: (scorecard: Scorecard) => void
  updateScorecard: (id: string, data: Partial<Scorecard>) => void
  deleteScorecard: (id: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      clients: mockClients,
      prospects: mockProspects,
      hiringRoles: mockHiringRoles,
      candidates: mockCandidates,
      interviews: mockInterviews,
      scorecards: mockScorecards,

      addProspect: (prospect) =>
        set((state) => ({ prospects: [...state.prospects, prospect] })),
      updateProspect: (id, data) =>
        set((state) => ({
          prospects: state.prospects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      deleteProspect: (id) =>
        set((state) => ({
          prospects: state.prospects.filter((p) => p.id !== id),
        })),

      addClient: (client) =>
        set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, data) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      addHiringRole: (role) =>
        set((state) => ({ hiringRoles: [...state.hiringRoles, role] })),
      updateHiringRole: (id, data) =>
        set((state) => ({
          hiringRoles: state.hiringRoles.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteHiringRole: (id) =>
        set((state) => ({
          hiringRoles: state.hiringRoles.filter((r) => r.id !== id),
        })),

      addCandidate: (candidate) =>
        set((state) => ({ candidates: [...state.candidates, candidate] })),
      updateCandidate: (id, data) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      addInterview: (interview) =>
        set((state) => ({ interviews: [...state.interviews, interview] })),
      updateInterview: (id, data) =>
        set((state) => ({
          interviews: state.interviews.map((i) =>
            i.id === id ? { ...i, ...data } : i
          ),
        })),

      addScorecard: (scorecard) =>
        set((state) => ({ scorecards: [...state.scorecards, scorecard] })),
      updateScorecard: (id, data) =>
        set((state) => ({
          scorecards: state.scorecards.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),
      deleteScorecard: (id) =>
        set((state) => ({
          scorecards: state.scorecards.filter((s) => s.id !== id),
        })),
    }),
    { name: 'lation-crm-v1' }
  )
)
