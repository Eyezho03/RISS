import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { KrnlClient, KrnlState, KrnlTask, KrnlTaskStatus } from './KrnlClient'

interface KrnlContextValue {
  loading: boolean
  error: string | null
  state: KrnlState | null
  refresh: () => Promise<void>
  updateTaskStatus: (id: string, status: KrnlTaskStatus) => Promise<void>
}

const KrnlContext = createContext<KrnlContextValue | undefined>(undefined)

const client = new KrnlClient()

export function KrnlProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KrnlState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await client.getState()
      setState(data)
    } catch (err) {
      console.warn('Failed to load KRNL state', err)
      setError('Failed to load KRNL state')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const updateTaskStatus = async (id: string, status: KrnlTaskStatus) => {
    try {
      const updated = await client.updateTaskStatus(id, status)
      setState((prev) => {
        if (!prev) return prev
        const tasks = prev.tasks.map((t) => (t.id === updated.id ? updated : t))
        return { ...prev, tasks }
      })
    } catch (err) {
      console.warn('Failed to update task status', err)
    }
  }

  const value: KrnlContextValue = {
    loading,
    error,
    state,
    refresh: load,
    updateTaskStatus,
  }

  return <KrnlContext.Provider value={value}>{children}</KrnlContext.Provider>
}

export function useKrnl() {
  const ctx = useContext(KrnlContext)
  if (!ctx) throw new Error('useKrnl must be used within KrnlProvider')
  return ctx
}