import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { DashboardV2 } from '../features/dashboard/DashboardV2'
import { Talents } from '../features/talents/Talents'
import { Employers } from '../features/employers/Employers'
import { Positions } from '../features/positions/Positions'
import { Applications } from '../features/applications/Applications'
import { Placements } from '../features/placements/Placements'
import { Settings } from '../features/settings/Settings'
import { useTheme } from '../lib/theme'

export default function App() {
  const dark = useTheme((s) => s.dark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardV2 />} />
          <Route path="talents" element={<Talents />} />
          <Route path="employers" element={<Employers />} />
          <Route path="positions" element={<Positions />} />
          <Route path="applications" element={<Applications />} />
          <Route path="placements" element={<Placements />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
