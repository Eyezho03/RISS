import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import {
  Wallet,
  Key,
  Bell,
  Shield,
  Globe,
  Trash2,
  Download,
  Link as LinkIcon,
  X,
} from 'lucide-react'

export default function Settings(): JSX.Element {
  const { wallet, did, theme } = useAppContext()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    tasks: true,
    verifications: true,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    scoreVisible: true,
    activityVisible: true,
  })
  const [connectedApps, setConnectedApps] = useState<string[]>(['github', 'twitter'])

  const handleDisconnectApp = (app: string): void => {
    setConnectedApps(connectedApps.filter((a) => a !== app))
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <StaggerReveal>
          <h1 className="font-display text-4xl font-bold text-accent mb-2">Settings</h1>

          {/* Wallet Management */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet size={24} className="text-accent" />
              <h2 className="font-display text-xl font-bold text-accent">Wallet Management</h2>
            </div>
            <div className="space-y-4">
              {wallet.isConnected && wallet.address ? (
                <div className="bg-bg border-2 border-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display font-bold text-accent mb-1">
                        {wallet.ensName || 'MetaMask'}
                      </div>
                      <p className="font-mono text-sm text-muted break-all">{wallet.address}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={wallet.disconnect}>
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={wallet.connect}>Connect Wallet</Button>
              )}
            </div>
          </div>

          {/* DID Management */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key size={24} className="text-accent" />
              <h2 className="font-display text-xl font-bold text-accent">DID Management</h2>
            </div>
            <div className="space-y-4">
              {did.did ? (
                <div className="bg-bg border-2 border-muted/20 p-4">
                  <div className="font-mono text-sm text-muted break-all mb-2">{did.did}</div>
                  <Button variant="ghost" size="sm" onClick={did.clearDID}>
                    Clear DID
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={async () => {
                    if (wallet.address) {
                      await did.createDID(wallet.address)
                    }
                  }}
                >
                  Create DID
                </Button>
              )}
            </div>
          </div>

          {/* Connected Apps */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <LinkIcon size={24} className="text-accent" />
              <h2 className="font-display text-xl font-bold text-accent">Connected Apps</h2>
            </div>
            <div className="space-y-2">
              {connectedApps.map((app) => (
                <div
                  key={app}
                  className="bg-bg border-2 border-muted/20 p-4 flex items-center justify-between"
                >
                  <span className="font-display font-bold text-accent capitalize">{app}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnectApp(app)}
                    aria-label={`Disconnect ${app}`}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              <Button variant="secondary" className="w-full">
                Connect New App
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell size={24} className="text-accent" />
              <h2 className="font-display text-xl font-bold text-accent">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-accent">Email Notifications</div>
                  <div className="font-body text-sm text-muted">Receive updates via email</div>
                </div>
                <Toggle
                  pressed={notifications.email}
                  onPressedChange={(pressed) =>
                    setNotifications({ ...notifications, email: pressed })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-accent">Push Notifications</div>
                  <div className="font-body text-sm text-muted">Browser push notifications</div>
                </div>
                <Toggle
                  pressed={notifications.push}
                  onPressedChange={(pressed) =>
                    setNotifications({ ...notifications, push: pressed })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-accent">Task Updates</div>
                  <div className="font-body text-sm text-muted">KRNL task notifications</div>
                </div>
                <Toggle
                  pressed={notifications.tasks}
                  onPressedChange={(pressed) =>
                    setNotifications({ ...notifications, tasks: pressed })
                  }
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield size={24} className="text-accent" />
              <h2 className="font-display text-xl font-bold text-accent">Privacy & Visibility</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-accent">Profile Visible</div>
                  <div className="font-body text-sm text-muted">Allow others to find your profile</div>
                </div>
                <Toggle
                  pressed={privacy.profileVisible}
                  onPressedChange={(pressed) =>
                    setPrivacy({ ...privacy, profileVisible: pressed })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-accent">Score Visible</div>
                  <div className="font-body text-sm text-muted">Show reputation score publicly</div>
                </div>
                <Toggle
                  pressed={privacy.scoreVisible}
                  onPressedChange={(pressed) =>
                    setPrivacy({ ...privacy, scoreVisible: pressed })
                  }
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Download size={24} className="text-accent" />
              <h2 className="font-display text-xl font-bold text-accent">Data Management</h2>
            </div>
            <div className="space-y-4">
              <Button variant="secondary" className="w-full">
                <Download size={16} className="mr-2" />
                Export Data
              </Button>
              <Button variant="ghost" className="w-full text-red-500 hover:text-red-600">
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}

