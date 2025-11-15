import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import { AppProvider } from '@/context/AppContext'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AppProvider>{ui}</AppProvider>
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  it('renders dashboard with DID block', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText(/Your Digital Identity/i)).toBeInTheDocument()
  })

  it('displays verification status section', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText(/Verification Status/i)).toBeInTheDocument()
    expect(screen.getByText(/Documents Verified/i)).toBeInTheDocument()
  })

  it('renders credentials section', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText(/Credentials/i)).toBeInTheDocument()
  })

  it('shows activity grid', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument()
  })
})

