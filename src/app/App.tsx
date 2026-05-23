import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from '../components/layout/Layout'
import { DashboardV2 } from '../features/dashboard/DashboardV2'
import { Talents } from '../features/talents/Talents'
import { TalentDetail } from '../features/talents/TalentDetail'
import { Employers } from '../features/employers/Employers'
import { EmployerDetail } from '../features/employers/EmployerDetail'
import { Positions } from '../features/positions/Positions'
import { Applications } from '../features/applications/Applications'
import { Placements } from '../features/placements/Placements'
import { Settings } from '../features/settings/Settings'
import { useTheme } from '../lib/theme'
import { useLationStore } from '../store/useLationStore'

export default function App() {
  const dark = useTheme((s) => s.dark)
  const loadLationData = useLationStore((s) => s.loadLationData)
  const subscribeRealtime = useLationStore((s) => s.subscribeRealtime)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    void loadLationData()
  }, [loadLationData])

  useEffect(() => {
    const unsubscribe = subscribeRealtime()
    return unsubscribe
  }, [subscribeRealtime])

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: dark ? '#1e293b' : '#fff',
            color: dark ? '#f1f5f9' : '#0f172a',
            border: dark ? '1px solid #334155' : '1px solid #e2e8f0',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardV2 />} />
          <Route path="talents" element={<Talents />} />
          <Route path="talents/:id" element={<TalentDetail />} />
          <Route path="employers" element={<Employers />} />
          <Route path="employers/:id" element={<EmployerDetail />} />
          <Route path="positions" element={<Positions />} />
          <Route path="applications" element={<Applications />} />
          <Route path="placements" element={<Placements />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
