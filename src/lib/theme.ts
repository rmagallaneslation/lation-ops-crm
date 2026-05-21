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
      toggleDark: () => {
        const next = !get().dark
        set({ dark: next })
        document.documentElement.classList.toggle('dark', next)
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: 'lation-theme',
      onRehydrateStorage: () => (state) => {
        // Apply dark class on hydration so it's set before first paint
        if (state?.dark) {
          document.documentElement.classList.add('dark')
        }
      },
    }
  )
)
