import { create } from 'zustand'
import { getSupabase } from '../lib/supabase'
import type { Talent, Employer, Position, Application, Placement } from '../types/lation'

const emptyToNull = (value: string | null | undefined) => value?.trim() ? value : null

type State = {
  talents: Talent[]
  employers: Employer[]
  positions: Position[]
  applications: Application[]
  placements: Placement[]
  loading: boolean
  error: string | null
}

type Actions = {
  loadLationData: () => Promise<void>
  subscribeRealtime: () => () => void

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

type TalentInput = Omit<Talent, 'id' | 'created_at' | 'updated_at'>
type EmployerInput = Omit<Employer, 'id' | 'created_at' | 'updated_at'>
type PositionInput = Omit<Position, 'id' | 'created_at' | 'updated_at'>
type ApplicationInput = Omit<Application, 'id' | 'created_at' | 'updated_at'>
type PlacementInput = Omit<Placement, 'id' | 'created_at' | 'updated_at'>

function isSupabaseError(error: unknown): error is { message?: string; code?: string; details?: string; hint?: string } {
  return typeof error === 'object' && error !== null
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message
  if (!isSupabaseError(error)) return 'Unexpected Supabase error'

  const parts = [error.message, error.code, error.details, error.hint].filter(Boolean)
  return parts.length > 0 ? parts.join(' | ') : 'Unexpected Supabase error'
}

function normalizeTalent(t: TalentInput): TalentInput {
  return {
    ...t,
    phone: emptyToNull(t.phone),
    timezone: emptyToNull(t.timezone),
    cv_url: emptyToNull(t.cv_url),
    linkedin_url: emptyToNull(t.linkedin_url),
    available_from: emptyToNull(t.available_from),
    created_by: emptyToNull(t.created_by),
    preferred_salary_min: t.preferred_salary_min ?? null,
    preferred_salary_max: t.preferred_salary_max ?? null,
  }
}

function normalizeEmployer(e: EmployerInput): EmployerInput {
  return {
    ...e,
    phone: emptyToNull(e.phone),
    website: emptyToNull(e.website),
    contact_phone: emptyToNull(e.contact_phone),
  }
}

function normalizePosition(p: PositionInput): PositionInput {
  return {
    ...p,
    description: emptyToNull(p.description),
    deadline: emptyToNull(p.deadline),
    salary_min: p.salary_min ?? null,
    salary_max: p.salary_max ?? null,
  }
}

function normalizeApplication(a: ApplicationInput): ApplicationInput {
  return {
    ...a,
    interview_scheduled_at: emptyToNull(a.interview_scheduled_at),
    notes: emptyToNull(a.notes),
  }
}

function normalizePlacement(p: PlacementInput): PlacementInput {
  return {
    ...p,
    end_date: emptyToNull(p.end_date),
    notes: emptyToNull(p.notes),
  }
}

export const useLationStore = create<State & Actions>()((set) => {
  const fail = (error: unknown) => {
    set({ error: formatError(error), loading: false })
  }

  return {
    talents: [],
    employers: [],
    positions: [],
    applications: [],
    placements: [],
    loading: false,
    error: null,

    loadLationData: async () => {
      set({ loading: true, error: null })
      try {
        const [talents, employers] = await Promise.all([
          getSupabase().from('talents').select('*').order('created_at', { ascending: false }),
          getSupabase().from('employers').select('*').order('created_at', { ascending: false }),
        ])
        if (talents.error) throw talents.error
        if (employers.error) throw employers.error

        const positions = await getSupabase().from('positions').select('*').order('created_at', { ascending: false })
        if (positions.error) throw positions.error

        const applications = await getSupabase().from('applications').select('*').order('created_at', { ascending: false })
        if (applications.error) throw applications.error

        const placements = await getSupabase().from('placements').select('*').order('created_at', { ascending: false })
        if (placements.error) throw placements.error

        set({
          talents: talents.data ?? [],
          employers: employers.data ?? [],
          positions: positions.data ?? [],
          applications: applications.data ?? [],
          placements: placements.data ?? [],
          loading: false,
        })
      } catch (error) {
        fail(error)
      }
    },

    subscribeRealtime: () => {
      const supabase = getSupabase()
      const channel = supabase
        .channel('lation-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'talents' }, async () => {
          const { data } = await supabase.from('talents').select('*').order('created_at', { ascending: false })
          if (data) set({ talents: data })
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'employers' }, async () => {
          const { data } = await supabase.from('employers').select('*').order('created_at', { ascending: false })
          if (data) set({ employers: data })
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'positions' }, async () => {
          const { data } = await supabase.from('positions').select('*').order('created_at', { ascending: false })
          if (data) set({ positions: data })
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, async () => {
          const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
          if (data) set({ applications: data })
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'placements' }, async () => {
          const { data } = await supabase.from('placements').select('*').order('created_at', { ascending: false })
          if (data) set({ placements: data })
        })
        .subscribe()
      return () => { void supabase.removeChannel(channel) }
    },

    addTalent: (t) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('talents').insert(normalizeTalent(t)).select().single()
        if (error) throw error
        if (data) set((s) => ({ talents: [data, ...s.talents] }))
      })().catch(fail)
    },
    updateTalent: (tid, patch) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('talents').update(normalizeTalent({ ...patch } as TalentInput)).eq('id', tid).select().single()
        if (error) throw error
        if (data) set((s) => ({ talents: s.talents.map((t) => t.id === tid ? data : t) }))
      })().catch(fail)
    },
    deleteTalent: (tid) => {
      void (async () => {
        set({ error: null })
        const { error } = await getSupabase().from('talents').delete().eq('id', tid)
        if (error) throw error
        set((s) => ({ talents: s.talents.filter((t) => t.id !== tid) }))
      })().catch(fail)
    },

    addEmployer: (e) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('employers').insert(normalizeEmployer(e)).select().single()
        if (error) throw error
        if (data) set((s) => ({ employers: [data, ...s.employers] }))
      })().catch(fail)
    },
    updateEmployer: (eid, patch) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('employers').update(normalizeEmployer({ ...patch } as EmployerInput)).eq('id', eid).select().single()
        if (error) throw error
        if (data) set((s) => ({ employers: s.employers.map((e) => e.id === eid ? data : e) }))
      })().catch(fail)
    },
    deleteEmployer: (eid) => {
      void (async () => {
        set({ error: null })
        const { error } = await getSupabase().from('employers').delete().eq('id', eid)
        if (error) throw error
        set((s) => ({ employers: s.employers.filter((e) => e.id !== eid) }))
      })().catch(fail)
    },

    addPosition: (p) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('positions').insert(normalizePosition(p)).select().single()
        if (error) throw error
        if (data) set((s) => ({ positions: [data, ...s.positions] }))
      })().catch(fail)
    },
    updatePosition: (pid, patch) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('positions').update(normalizePosition({ ...patch } as PositionInput)).eq('id', pid).select().single()
        if (error) throw error
        if (data) set((s) => ({ positions: s.positions.map((p) => p.id === pid ? data : p) }))
      })().catch(fail)
    },
    deletePosition: (pid) => {
      void (async () => {
        set({ error: null })
        const { error } = await getSupabase().from('positions').delete().eq('id', pid)
        if (error) throw error
        set((s) => ({ positions: s.positions.filter((p) => p.id !== pid) }))
      })().catch(fail)
    },

    addApplication: (a) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('applications').insert(normalizeApplication(a)).select().single()
        if (error) throw error
        if (data) set((s) => ({ applications: [data, ...s.applications] }))
      })().catch(fail)
    },
    updateApplication: (aid, patch) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('applications').update(normalizeApplication({ ...patch } as ApplicationInput)).eq('id', aid).select().single()
        if (error) throw error
        if (data) set((s) => ({ applications: s.applications.map((a) => a.id === aid ? data : a) }))
      })().catch(fail)
    },
    deleteApplication: (aid) => {
      void (async () => {
        set({ error: null })
        const { error } = await getSupabase().from('applications').delete().eq('id', aid)
        if (error) throw error
        set((s) => ({ applications: s.applications.filter((a) => a.id !== aid) }))
      })().catch(fail)
    },

    addPlacement: (p) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('placements').insert(normalizePlacement(p)).select().single()
        if (error) throw error
        if (data) set((s) => ({ placements: [data, ...s.placements] }))
      })().catch(fail)
    },
    updatePlacement: (plid, patch) => {
      void (async () => {
        set({ error: null })
        const { data, error } = await getSupabase().from('placements').update(normalizePlacement({ ...patch } as PlacementInput)).eq('id', plid).select().single()
        if (error) throw error
        if (data) set((s) => ({ placements: s.placements.map((p) => p.id === plid ? data : p) }))
      })().catch(fail)
    },
    deletePlacement: (plid) => {
      void (async () => {
        set({ error: null })
        const { error } = await getSupabase().from('placements').delete().eq('id', plid)
        if (error) throw error
        set((s) => ({ placements: s.placements.filter((p) => p.id !== plid) }))
      })().catch(fail)
    },
  }
})
