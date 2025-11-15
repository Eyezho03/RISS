import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './layouts/Layout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import VerificationFlow from './pages/VerificationFlow'
import AdminPanel from './pages/AdminPanel'
import Tasks from './pages/Tasks'
import Activity from './pages/Activity'
import Explore from './pages/Explore'
import Settings from './pages/Settings'
import Reputation from './pages/Reputation'
import OrganizationDashboard from './pages/OrganizationDashboard'
import ApiIntegrations from './pages/ApiIntegrations'
import VerificationRequests from './pages/VerificationRequests'
import Profile from './pages/Profile'

function App(): JSX.Element {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/verify" element={<VerificationFlow />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reputation" element={<Reputation />} />
            <Route path="/org/:id" element={<OrganizationDashboard />} />
            <Route path="/api" element={<ApiIntegrations />} />
            <Route path="/verifications" element={<VerificationRequests />} />
            <Route path="/profile/:did" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App

