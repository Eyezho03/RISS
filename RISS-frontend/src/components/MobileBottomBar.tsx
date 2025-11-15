import { Link, useLocation } from 'react-router-dom'
import { Shield, Award, User, Search } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'

export default function MobileBottomBar(): JSX.Element {
  const location = useLocation()
  const { wallet } = useAppContext()

  if (!wallet.isConnected) {
    return <></>
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-panel border-t-2 border-accent/20">
      <div className="flex items-center justify-around h-16">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            location.pathname === '/dashboard' ? 'text-accent' : 'text-muted'
          }`}
          aria-label="Dashboard"
        >
          <User size={20} />
          <span className="text-xs font-display font-bold uppercase mt-1">Dashboard</span>
        </Link>
        <Link
          to="/tasks"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            location.pathname === '/tasks' ? 'text-accent' : 'text-muted'
          }`}
          aria-label="Tasks"
        >
          <Award size={20} />
          <span className="text-xs font-display font-bold uppercase mt-1">Tasks</span>
        </Link>
        <Link
          to="/explore"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            location.pathname === '/explore' ? 'text-accent' : 'text-muted'
          }`}
          aria-label="Explore"
        >
          <Search size={20} />
          <span className="text-xs font-display font-bold uppercase mt-1">Explore</span>
        </Link>
        <Link
          to="/verify"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            location.pathname === '/verify' ? 'text-accent' : 'text-muted'
          }`}
          aria-label="Verify"
        >
          <Shield size={20} />
          <span className="text-xs font-display font-bold uppercase mt-1">Verify</span>
        </Link>
      </div>
    </nav>
  )
}

