import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeState = {
  dark: boolean
  sidebarCollapsed: boolean
  toggleDark: () => void
  toggleSidebar: () => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      sidebarCollapsed: false,
      // Pure state toggle — DOM sync lives in App.tsx useEffect
      toggleDark: () => set({ dark: !get().dark }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'lation-theme' }
  )
)
