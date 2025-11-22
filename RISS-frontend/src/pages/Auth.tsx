import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, Globe, Fingerprint, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/auth/AuthContext'

export default function Auth() {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showInternetIdentityModal, setShowInternetIdentityModal] = useState(false)
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [savingUsername, setSavingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState<string | undefined>()
  const [roleHint, setRoleHint] = useState<string | undefined>()
  const [pendingRedirectRole, setPendingRedirectRole] = useState<'developer' | 'organization' | undefined>()
  const navigate = useNavigate()
  const { connectEvm, connectSolana, walletAddress, userType, setUserType } = useAuth()

  // After wallet + role are set, ensure user exists and, if needed, prompt for username
  useEffect(() => {
    if (!walletAddress || !userType) return

    const ensureProfile = async (): Promise<void> => {
      try {
        setUsernameError(undefined)
        const identifier = encodeURIComponent(walletAddress)

        // Try to load existing user by wallet
        let res = await fetch(`/api/user/${identifier}`)
        let userJson: any | null = null

        if (res.status === 404) {
          // Register minimal user on first connect
          const did = `did:riss:${walletAddress.toLowerCase()}`
          const registerRes = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ did, walletAddress }),
          })
          if (!registerRes.ok) {
            throw new Error('Failed to register user')
          }
          userJson = await registerRes.json()
        } else if (res.ok) {
          userJson = await res.json()
        }

        if (userJson?.username) {
          navigate(userType === 'developer' ? '/dashboard' : '/explore')
        } else {
          setPendingRedirectRole(userType)
          setShowUsernameModal(true)
        }
      } catch (error) {
        console.error('Failed to ensure user profile', error)
        // Fallback: still navigate so user is not stuck
        navigate(userType === 'developer' ? '/dashboard' : '/explore')
      }
    }

    void ensureProfile()
  }, [walletAddress, userType, navigate])

  const authMethods = [
    {
      id: 'wallet',
      title: 'Connect Wallet',
      description: 'Connect with MetaMask, WalletConnect, or other Web3 wallets',
      icon: Wallet,
      color: 'text-primary-purple',
      bgColor: 'bg-primary-purple/20',
      onClick: () => setShowWalletModal(true),
    },
    {
      id: 'internet-identity',
      title: 'Internet Identity',
      description: 'Sign in with Internet Computer Identity',
      icon: Globe,
      color: 'text-primary-cyan',
      bgColor: 'bg-primary-cyan/20',
      onClick: () => setShowInternetIdentityModal(true),
    },
    {
      id: 'biometric',
      title: 'Biometric Auth',
      description: 'Use fingerprint or face recognition',
      icon: Fingerprint,
      color: 'text-success',
      bgColor: 'bg-success/20',
      onClick: () => console.log('Biometric auth'),
    },
  ]

  const wallets = [
    { name: 'MetaMask (EVM)', icon: '🦊', type: 'evm' as const },
    { name: 'Phantom (Solana)', icon: '👻', type: 'solana' as const },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold text-text-primary">
          Sign in to RISS
        </h1>
        <p className="text-sm text-text-muted">
          Connect a wallet or identity.
        </p>
      </div>

      {/* Role selection */}
      <div className="flex justify-center gap-3">
        <Button
          variant={userType === 'developer' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => {
            setUserType('developer')
            setRoleHint(undefined)
          }}
        >
          Builder / Developer
        </Button>
        <Button
          variant={userType === 'organization' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => {
            setUserType('organization')
            setRoleHint(undefined)
          }}
        >
          Organization / Client
        </Button>
      </div>
      {roleHint && (
        <p className="text-[11px] text-error text-center mt-1">{roleHint}</p>
      )}

      {/* Auth Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {authMethods.map((method) => {
          const Icon = method.icon
          return (
            <Card
              key={method.id}
              variant="glass"
              hover
              className="text-center cursor-pointer"
              onClick={method.onClick}
            >
              <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-8 h-8 ${method.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                {method.title}
              </h3>
              <p className="text-sm text-text-muted">{method.description}</p>
            </Card>
          )
        })}
      </div>

      {/* Wallet Connect Modal */}
      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Connect Wallet"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-muted text-sm">
            Select a wallet to connect.
          </p>
          <div className="space-y-2">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                className="w-full flex items-center justify-between p-4 bg-bg-secondary rounded-card hover:bg-bg-panel transition-colors"
                onClick={async () => {
                  if (!userType) {
                    setRoleHint('Pick a role first.')
                    return
                  }
                  if (wallet.type === 'evm') {
                    await connectEvm()
                  } else {
                    await connectSolana()
                  }
                  setShowWalletModal(false)
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="font-medium text-text-primary">{wallet.name}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted" />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Username Modal - first time after wallet connect */}
      <Modal
        isOpen={showUsernameModal}
        // Do not allow closing without picking a username to keep the flow simple
        onClose={() => undefined}
        title="Choose a username"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-muted text-sm">
            Pick a handle for your RISS profile. You can change this later in Settings.
          </p>
          <Input
            label="Username"
            placeholder="e.g. gilly.dev"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          {usernameError && (
            <p className="text-[11px] text-error">{usernameError}</p>
          )}
          <Button
            variant="primary"
            className="w-full"
            disabled={savingUsername || !usernameInput.trim()}
            onClick={async () => {
              if (!walletAddress) return
              const trimmed = usernameInput.trim()
              if (!trimmed) return
              setSavingUsername(true)
              setUsernameError(undefined)
              try {
                const res = await fetch(`/api/user/${encodeURIComponent(walletAddress)}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: trimmed }),
                })
                if (!res.ok) {
                  let message = 'Failed to save username'
                  try {
                    const data = await res.json()
                    if (data?.error) message = data.error
                  } catch {
                    // ignore json parse errors
                  }
                  setUsernameError(message)
                  return
                }
                setShowUsernameModal(false)
                setSavingUsername(false)
                const role = pendingRedirectRole || userType || 'developer'
                navigate(role === 'developer' ? '/dashboard' : '/explore')
              } catch (error) {
                console.error('Failed to save username', error)
                setUsernameError('Failed to save username')
              } finally {
                setSavingUsername(false)
              }
            }}
          >
            {savingUsername ? 'Saving…' : 'Continue'}
          </Button>
        </div>
      </Modal>

      {/* Internet Identity Modal */}
      <Modal
        isOpen={showInternetIdentityModal}
        onClose={() => setShowInternetIdentityModal(false)}
        title="Internet Identity"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-muted">
            Sign in with your Internet Computer Identity
          </p>
          <Input
            label="Identity Principal"
            placeholder="Enter your principal ID"
          />
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              console.log('Internet Identity login')
              setShowInternetIdentityModal(false)
            }}
          >
            Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Modal>
    </div>
  )
}
