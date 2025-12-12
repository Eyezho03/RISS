import { Link, useLocation } from 'react-router-dom'
import { Wallet, Menu, X, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/Button'
import { clsx } from 'clsx'
import { useAuth } from '@/auth/AuthContext'
import { useTheme } from '@/hooks/useTheme'

export function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { walletAddress, userType, connectEvm } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/explore', label: 'Explore' },
    { path: '/verification', label: 'Verification' },
    { path: '/developers', label: 'Developers' },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleWalletConnect = () => {
    void connectEvm()
  }

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-border">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 pl-4 pr-4 sm:pl-6 sm:pr-6">
          {/* Logo - Far Left */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-accent rounded-button flex items-center justify-center">
              <span className="text-text-on-accent font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-bold text-xl text-text-primary">
              RISS
            </span>
          </Link>

          {/* Desktop Navigation & Wallet - Far Right */}
          <div className="hidden md:flex items-center gap-8 flex-shrink-0">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Wallet Connect & Actions */}
            <div className="flex items-center gap-4 ml-4">
              {userType && (
                <span className="text-[11px] px-2 py-1 rounded-button border border-border text-text-muted">
                  {userType === 'developer' ? 'Dev' : 'Org'}
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-button border border-border hover:bg-bg-panel transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-text-primary" />
                ) : (
                  <Moon className="w-4 h-4 text-text-primary" />
                )}
              </button>
              <Button
                variant={walletAddress ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleWalletConnect}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : 'Connect Wallet'}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-muted hover:text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'text-sm font-medium px-2 py-1',
                    isActive(link.path)
                      ? 'text-accent'
                      : 'text-text-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-button hover:bg-bg-panel transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                )}
              </button>
              <Button
                variant={walletAddress ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleWalletConnect}
                className="mt-2"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
