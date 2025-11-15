import { Link, useLocation } from 'react-router-dom'
import { LogoSVG } from '@/assets/LogoSVG'
import { useAppContext } from '@/context/AppContext'
import { Toggle } from '@/components/ui/Toggle'
import { Moon, Sun } from 'lucide-react'

export default function Navbar(): JSX.Element {
  const location = useLocation()
  const { theme, wallet } = useAppContext()

  return (
    <nav className="sticky top-0 z-50 bg-panel/80 backdrop-blur-md border-b-2 border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center" aria-label="RISS Home">
            <LogoSVG className="h-8" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {wallet.isConnected && (
              <>
                <Link
                  to="/dashboard"
                  className={`font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-accent'
                      : 'text-muted hover:text-accent'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className={`font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                    location.pathname === '/tasks'
                      ? 'text-accent'
                      : 'text-muted hover:text-accent'
                  }`}
                >
                  Tasks
                </Link>
                <Link
                  to="/explore"
                  className={`font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                    location.pathname === '/explore'
                      ? 'text-accent'
                      : 'text-muted hover:text-accent'
                  }`}
                >
                  Explore
                </Link>
                <Link
                  to="/verify"
                  className={`font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                    location.pathname === '/verify'
                      ? 'text-accent'
                      : 'text-muted hover:text-accent'
                  }`}
                >
                  Verify
                </Link>
              </>
            )}
            <Link
              to="/verifications"
              className={`font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                location.pathname === '/verifications'
                  ? 'text-accent'
                  : 'text-muted hover:text-accent'
              }`}
            >
              Verifications
            </Link>
            <Link
              to="/api"
              className={`font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                location.pathname === '/api'
                  ? 'text-accent'
                  : 'text-muted hover:text-accent'
              }`}
            >
              API
            </Link>
            <Link
              to="/admin"
              className={`font-display font-bold text-sm uppercase tracking-wider transition-colors ${
                location.pathname === '/admin'
                  ? 'text-accent'
                  : 'text-muted hover:text-accent'
              }`}
            >
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {theme.theme === 'dark' ? (
                <Sun size={18} className="text-muted" />
              ) : (
                <Moon size={18} className="text-muted" />
              )}
              <Toggle
                pressed={theme.theme === 'light'}
                onPressedChange={() => theme.toggleTheme()}
                aria-label="Toggle theme"
              >
                {theme.theme === 'dark' ? 'Light' : 'Dark'}
              </Toggle>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

