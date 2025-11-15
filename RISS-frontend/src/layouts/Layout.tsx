import { ReactNode, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import Navbar from '@/components/Navbar'
import MobileBottomBar from '@/components/MobileBottomBar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { theme } = useAppContext()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.theme)
  }, [theme.theme])

  return (
    <div className="min-h-screen bg-bg text-muted">
      <Navbar />
      <main className="relative z-10">{children}</main>
      <MobileBottomBar />
    </div>
  )
}

