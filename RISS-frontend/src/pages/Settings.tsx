import { useState } from 'react'
import { Wallet, Shield, Bell, Lock, Trash2, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reputation: true,
    verification: true,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    activityPublic: true,
    showReputation: true,
  })

  const connectedWallets = [
    { address: '0x1234...5678', network: 'Ethereum', connected: true },
    { address: '0xabcd...efgh', network: 'Polygon', connected: false },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
          Settings
        </h1>
        <p className="text-sm text-text-muted">
          Account, privacy, alerts.
        </p>
      </div>

      {/* Wallet Management */}
      <Card variant="glass">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-6 h-6 text-primary-purple" />
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Wallet Management
          </h2>
        </div>
        <div className="space-y-4">
          {connectedWallets.map((wallet, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-bg-secondary rounded-card"
            >
              <div>
                <div className="font-medium text-text-primary">{wallet.address}</div>
                <div className="text-sm text-text-muted">{wallet.network}</div>
              </div>
              <div className="flex items-center gap-2">
                {wallet.connected ? (
                  <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-button">
                    Connected
                  </span>
                ) : (
                  <Button variant="ghost" size="sm">
                    Connect
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="primary">
            <Wallet className="w-4 h-4 mr-2" />
            Connect New Wallet
          </Button>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card variant="glass">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-primary-cyan" />
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Privacy Settings
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Public Profile</div>
              <div className="text-sm text-text-muted">
                Allow others to view your profile
              </div>
            </div>
            <Toggle
              checked={privacy.profilePublic}
              onChange={(e) =>
                setPrivacy({ ...privacy, profilePublic: e.target.checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Public Activity</div>
              <div className="text-sm text-text-muted">
                Show your activity feed publicly
              </div>
            </div>
            <Toggle
              checked={privacy.activityPublic}
              onChange={(e) =>
                setPrivacy({ ...privacy, activityPublic: e.target.checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Show Reputation</div>
              <div className="text-sm text-text-muted">
                Display your reputation score publicly
              </div>
            </div>
            <Toggle
              checked={privacy.showReputation}
              onChange={(e) =>
                setPrivacy({ ...privacy, showReputation: e.target.checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card variant="glass">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary-purple" />
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Notifications
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Email Notifications</div>
              <div className="text-sm text-text-muted">
                Receive updates via email
              </div>
            </div>
            <Toggle
              checked={notifications.email}
              onChange={(e) =>
                setNotifications({ ...notifications, email: e.target.checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Push Notifications</div>
              <div className="text-sm text-text-muted">
                Browser push notifications
              </div>
            </div>
            <Toggle
              checked={notifications.push}
              onChange={(e) =>
                setNotifications({ ...notifications, push: e.target.checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Reputation Updates</div>
              <div className="text-sm text-text-muted">
                Notify when reputation changes
              </div>
            </div>
            <Toggle
              checked={notifications.reputation}
              onChange={(e) =>
                setNotifications({ ...notifications, reputation: e.target.checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Verification Status</div>
              <div className="text-sm text-text-muted">
                Notify about verification updates
              </div>
            </div>
            <Toggle
              checked={notifications.verification}
              onChange={(e) =>
                setNotifications({ ...notifications, verification: e.target.checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card variant="glass">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-error" />
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Account Actions
          </h2>
        </div>
        <div className="space-y-4">
          <Button variant="danger">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect All Wallets
          </Button>
          <Button variant="danger">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}
