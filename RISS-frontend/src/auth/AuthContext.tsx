import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type WalletType = 'evm' | 'solana'
export type UserType = 'developer' | 'organization'

interface AuthState {
  walletAddress?: string
  walletType?: WalletType
  userType?: UserType
}

interface AuthContextValue extends AuthState {
  connectEvm: () => Promise<void>
  connectSolana: () => Promise<void>
  setUserType: (type: UserType) => void
  infoMessage?: string
  errorMessage?: string
  clearMessage: () => void
}

const STORAGE_KEY = 'riss_auth_v1'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({})
  const [infoMessage, setInfoMessage] = useState<string | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  // Hydrate from localStorage once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as AuthState
      setState(parsed)
    } catch {
      // ignore
    }
  }, [])

  // Persist auth state
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const connectEvm = async () => {
    if (typeof window === 'undefined') return
    const anyWindow = window as any
    const provider = anyWindow.ethereum
    if (!provider) {
      setErrorMessage('MetaMask not detected. Install it to connect.')
      return
    }

    try {
      const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        setState((prev) => ({ ...prev, walletAddress: accounts[0], walletType: 'evm' }))
        setInfoMessage('Connected with MetaMask.')
        setErrorMessage(undefined)
      }
    } catch (e) {
      console.warn('EVM wallet connect failed', e)
      setErrorMessage('Wallet connection failed.')
    }
  }

  const connectSolana = async () => {
    if (typeof window === 'undefined') return
    const anyWindow = window as any
    const solana = anyWindow.solana
    if (!solana || !solana.isPhantom) {
      setErrorMessage('Phantom not detected. Install it to connect.')
      return
    }

    try {
      const resp = await solana.connect()
      if (resp?.publicKey) {
        setState((prev) => ({
          ...prev,
          walletAddress: resp.publicKey.toString(),
          walletType: 'solana',
        }))
        setInfoMessage('Connected with Phantom.')
        setErrorMessage(undefined)
      }
    } catch (e) {
      console.warn('Solana wallet connect failed', e)
      setErrorMessage('Wallet connection failed.')
    }
  }

  const setUserType = (type: UserType) => {
    setState((prev) => ({ ...prev, userType: type }))
  }

  const clearMessage = () => {
    setInfoMessage(undefined)
    setErrorMessage(undefined)
  }

  const value: AuthContextValue = {
    ...state,
    connectEvm,
    connectSolana,
    setUserType,
    infoMessage,
    errorMessage,
    clearMessage,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
