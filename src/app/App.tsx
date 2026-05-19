import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Dashboard } from '../features/dashboard/Dashboard'
import { Prospects } from '../features/prospects/Prospects'
import { Pipeline } from '../features/pipeline/Pipeline'
import { Clients } from '../features/clients/Clients'
import { ClientDetail } from '../features/clients/ClientDetail'
import { HiringNeeds } from '../features/hiring-needs/HiringNeeds'
import { Candidates } from '../features/candidates/Candidates'
import { Interviews } from '../features/interviews/Interviews'
import { Scorecards } from '../features/scorecards/Scorecards'
import { Reports } from '../features/reports/Reports'
import { Activities } from '../features/activities/Activities'
import { Settings } from '../features/settings/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="hiring-needs" element={<HiringNeeds />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="scorecards" element={<Scorecards />} />
          <Route path="reports" element={<Reports />} />
          <Route path="activities" element={<Activities />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
