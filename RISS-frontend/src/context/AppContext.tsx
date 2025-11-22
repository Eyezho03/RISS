import { createContext, useContext, ReactNode } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { useDID } from '@/hooks/useDID'
import { useTheme } from '@/hooks/useTheme'
import { useReputation } from '@/hooks/useReputation'
import { useKrnlTasks } from '@/hooks/useKrnlTasks'

interface AppContextType {
  wallet: ReturnType<typeof useWallet>
  did: ReturnType<typeof useDID>
  theme: ReturnType<typeof useTheme>
  reputation: ReturnType<typeof useReputation>
  krnlTasks: ReturnType<typeof useKrnlTasks>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }): JSX.Element {
  const wallet = useWallet()
  const did = useDID()
  const theme = useTheme()
  const reputation = useReputation(wallet.address)
  const krnlTasks = useKrnlTasks()

  return (
    <AppContext.Provider value={{ wallet, did, theme, reputation, krnlTasks }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

