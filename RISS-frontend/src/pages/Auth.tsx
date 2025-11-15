import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAppContext } from '@/context/AppContext'
import { Wallet, Key, Fingerprint, Plug, ExternalLink } from 'lucide-react'

export default function Auth(): JSX.Element {
  const navigate = useNavigate()
  const { wallet, did } = useAppContext()
  const [didToken, setDidToken] = useState('')
  const [isBiometric, setIsBiometric] = useState(false)

  const handleWalletConnect = async (): Promise<void> => {
    try {
      await wallet.connect()
      if (wallet.address) {
        // Create DID with wallet address
        await did.createDID(wallet.address)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }

  const handleDIDToken = (): void => {
    // Mock DID token validation
    if (didToken.trim()) {
      navigate('/dashboard')
    }
  }

  const handleBiometric = (): void => {
    // Mock biometric authentication
    setIsBiometric(true)
    setTimeout(() => {
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full space-y-8">
        <StaggerReveal>
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold text-accent mb-2">
                Authenticate
              </h1>
              <p className="font-body text-muted">
                Choose your authentication method
              </p>
            </div>

            {/* KRNL Connect */}
            <div className="bg-panel border-2 border-accent p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Plug size={24} className="text-accent" />
                <h2 className="font-display text-xl font-bold text-accent">
                  KRNL Connect
                </h2>
              </div>
              <p className="font-body text-sm text-muted">
                Connect your wallet through KRNL Protocol for seamless integration
              </p>
              {wallet.isConnected ? (
                <div className="space-y-2">
                  <p className="font-body text-sm text-muted">
                    Connected: {wallet.ensName || wallet.address}
                  </p>
                  <Button onClick={() => navigate('/dashboard')} className="w-full">
                    Continue to Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={wallet.disconnect}
                    className="w-full"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={handleWalletConnect}
                    disabled={wallet.isConnecting}
                    className="w-full"
                  >
                    {wallet.isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" className="w-full" disabled>
                      Phantom
                    </Button>
                    <Button variant="secondary" className="w-full" disabled>
                      Freighter
                    </Button>
                  </div>
                  <p className="font-body text-xs text-muted text-center">
                    More wallets coming soon
                  </p>
                </div>
              )}
              {wallet.error && (
                <p className="text-sm text-red-500" role="alert">
                  {wallet.error}
                </p>
              )}
            </div>

            {/* Connect Wallet (Alternative) */}
            <div className="bg-panel border-2 border-muted/20 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Wallet size={24} className="text-accent" />
                <h2 className="font-display text-xl font-bold text-accent">
                  Direct Wallet Connect
                </h2>
              </div>
              {wallet.isConnected ? (
                <div className="space-y-2">
                  <p className="font-body text-sm text-muted">
                    Connected: {wallet.ensName || wallet.address}
                  </p>
                  <Button onClick={() => navigate('/dashboard')} className="w-full">
                    Continue to Dashboard
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleWalletConnect}
                  disabled={wallet.isConnecting}
                  className="w-full"
                >
                  {wallet.isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </Button>
              )}
            </div>

            {/* DID Token */}
            <div className="bg-panel border-2 border-muted/20 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Key size={24} className="text-accent" />
                <h2 className="font-display text-xl font-bold text-accent">
                  DID Token
                </h2>
              </div>
              <Input
                label="Enter DID Token"
                value={didToken}
                onChange={(e) => setDidToken(e.target.value)}
                placeholder="did:riss:..."
                className="mb-4"
              />
              <Button onClick={handleDIDToken} className="w-full">
                Authenticate
              </Button>
            </div>

            {/* Biometric (Mock) */}
            <div className="bg-panel border-2 border-muted/20 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Fingerprint size={24} className="text-accent" />
                <h2 className="font-display text-xl font-bold text-accent">
                  Biometric
                </h2>
              </div>
              <Button
                onClick={handleBiometric}
                disabled={isBiometric}
                className="w-full"
              >
                {isBiometric ? 'Authenticating...' : 'Authenticate with Biometric'}
              </Button>
            </div>
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}

