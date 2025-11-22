import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './layouts/Layout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import VerificationFlow from './pages/VerificationFlow'
import AdminPanel from './pages/AdminPanel'
import Explore from './pages/Explore'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'
import Developers from './pages/Developers'
import Profile from './pages/Profile'
import Reputation from './pages/Reputation'
import OrganizationDashboard from './pages/OrganizationDashboard'
import Activity from './pages/Activity'
import { KrnlProvider } from './krnl/KrnlContext'
import { AuthProvider } from './auth/AuthContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <KrnlProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/verification" element={<VerificationFlow />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/profile/:did" element={<Profile />} />
              <Route path="/reputation" element={<Reputation />} />
              <Route path="/org" element={<OrganizationDashboard />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </KrnlProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
