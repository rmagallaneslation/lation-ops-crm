import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Talent, Employer, Position, Application, Placement } from '../types/lation'
import { mockTalents, mockEmployers, mockPositions, mockApplications, mockPlacements } from '../data/lationMockData'

const now = () => new Date().toISOString()
const id = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

type State = {
  talents: Talent[]
  employers: Employer[]
  positions: Position[]
  applications: Application[]
  placements: Placement[]
}

type Actions = {
  addTalent: (t: Omit<Talent, 'id' | 'created_at' | 'updated_at'>) => void
  updateTalent: (id: string, patch: Partial<Talent>) => void
  deleteTalent: (id: string) => void

  addEmployer: (e: Omit<Employer, 'id' | 'created_at' | 'updated_at'>) => void
  updateEmployer: (id: string, patch: Partial<Employer>) => void
  deleteEmployer: (id: string) => void

  addPosition: (p: Omit<Position, 'id' | 'created_at' | 'updated_at'>) => void
  updatePosition: (id: string, patch: Partial<Position>) => void
  deletePosition: (id: string) => void

  addApplication: (a: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => void
  updateApplication: (id: string, patch: Partial<Application>) => void
  deleteApplication: (id: string) => void

  addPlacement: (p: Omit<Placement, 'id' | 'created_at' | 'updated_at'>) => void
  updatePlacement: (id: string, patch: Partial<Placement>) => void
  deletePlacement: (id: string) => void
}

const initialState: State = {
  talents: mockTalents,
  employers: mockEmployers,
  positions: mockPositions,
  applications: mockApplications,
  placements: mockPlacements,
}

export const useLationStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,

      addTalent: (t) => set((s) => ({ talents: [...s.talents, { ...t, id: id('t'), created_at: now(), updated_at: now() }] })),
      updateTalent: (tid, patch) => set((s) => ({ talents: s.talents.map((t) => t.id === tid ? { ...t, ...patch, updated_at: now() } : t) })),
      deleteTalent: (tid) => set((s) => ({ talents: s.talents.filter((t) => t.id !== tid) })),

      addEmployer: (e) => set((s) => ({ employers: [...s.employers, { ...e, id: id('e'), created_at: now(), updated_at: now() }] })),
      updateEmployer: (eid, patch) => set((s) => ({ employers: s.employers.map((e) => e.id === eid ? { ...e, ...patch, updated_at: now() } : e) })),
      deleteEmployer: (eid) => set((s) => ({ employers: s.employers.filter((e) => e.id !== eid) })),

      addPosition: (p) => set((s) => ({ positions: [...s.positions, { ...p, id: id('p'), created_at: now(), updated_at: now() }] })),
      updatePosition: (pid, patch) => set((s) => ({ positions: s.positions.map((p) => p.id === pid ? { ...p, ...patch, updated_at: now() } : p) })),
      deletePosition: (pid) => set((s) => ({ positions: s.positions.filter((p) => p.id !== pid) })),

      addApplication: (a) => set((s) => ({ applications: [...s.applications, { ...a, id: id('a'), created_at: now(), updated_at: now() }] })),
      updateApplication: (aid, patch) => set((s) => ({ applications: s.applications.map((a) => a.id === aid ? { ...a, ...patch, updated_at: now() } : a) })),
      deleteApplication: (aid) => set((s) => ({ applications: s.applications.filter((a) => a.id !== aid) })),

      addPlacement: (p) => set((s) => ({ placements: [...s.placements, { ...p, id: id('pl'), created_at: now(), updated_at: now() }] })),
      updatePlacement: (plid, patch) => set((s) => ({ placements: s.placements.map((p) => p.id === plid ? { ...p, ...patch, updated_at: now() } : p) })),
      deletePlacement: (plid) => set((s) => ({ placements: s.placements.filter((p) => p.id !== plid) })),
    }),
    { name: 'lation-v2' }
  )
)
