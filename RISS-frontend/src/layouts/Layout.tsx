import { ReactNode, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/auth/AuthContext'
import { useTheme } from '@/hooks/useTheme'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { infoMessage, errorMessage, clearMessage } = useAuth()
  // Initialize theme on app load
  useTheme()

  // Auto-clear messages after a short delay
  useEffect(() => {
    if (!infoMessage && !errorMessage) return
    const id = setTimeout(() => {
      clearMessage()
    }, 4000)
    return () => clearTimeout(id)
  }, [infoMessage, errorMessage, clearMessage])

  const hasMessage = infoMessage || errorMessage

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      {hasMessage && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-2">
          <div
            className={`inline-flex items-center px-3 py-2 rounded-button text-xs border ${
              errorMessage
                ? 'bg-error/10 border-error/60 text-error'
                : 'bg-success/10 border-success/60 text-success'
            }`}
          >
            <span>{errorMessage || infoMessage}</span>
          </div>
        </div>
      )}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
