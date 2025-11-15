import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import VerificationFlow from '../VerificationFlow'
import { AppProvider } from '@/context/AppContext'

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AppProvider>{ui}</AppProvider>
    </BrowserRouter>
  )
}

describe('VerificationFlow', () => {
  it('renders upload step initially', () => {
    renderWithProviders(<VerificationFlow />)
    expect(screen.getByText(/Upload Document/i)).toBeInTheDocument()
  })

  it('allows entering document hash', async () => {
    const user = userEvent.setup()
    renderWithProviders(<VerificationFlow />)
    
    const input = screen.getByPlaceholderText(/Enter document hash/i)
    await user.type(input, 'test-hash-123')
    
    expect(input).toHaveValue('test-hash-123')
  })

  it('shows document type selector', () => {
    renderWithProviders(<VerificationFlow />)
    const select = screen.getByDisplayValue(/passport/i)
    expect(select).toBeInTheDocument()
  })

  it('has continue button on upload step', () => {
    renderWithProviders(<VerificationFlow />)
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
  })
})

