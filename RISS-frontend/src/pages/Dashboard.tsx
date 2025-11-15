import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { ReputationScore } from '@/components/ReputationScore'
import { ActivityFeed } from '@/components/ActivityFeed'
import { Shield, Share2, Copy, Check, QrCode, TrendingUp, Award, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard(): JSX.Element {
  const { wallet, did, reputation } = useAppContext()
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleShareProfile = async (): Promise<void> => {
    const url = `${window.location.origin}/profile/${did.did || 'anonymous'}`
    setShareUrl(url)
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const badges = [
    { id: '1', name: 'Identity Verified', icon: Shield, earned: true },
    { id: '2', name: 'First Contribution', icon: Award, earned: reputation.activities.length > 0 },
    { id: '3', name: 'Trust Builder', icon: TrendingUp, earned: reputation.score.trust > 20 },
  ]

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Profile Header */}
          <div className="bg-panel border-2 border-accent p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-accent/20 border-2 border-accent flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-accent">
                      {wallet.address?.slice(2, 4).toUpperCase() || 'R'}
                    </span>
                  </div>
                  <div>
                    <h1 className="font-display text-3xl font-bold text-accent">
                      {wallet.ensName || wallet.address?.slice(0, 6) + '...' + wallet.address?.slice(-4) || 'Anonymous'}
                    </h1>
                    {did.did && (
                      <p className="font-mono text-sm text-muted break-all">{did.did}</p>
                    )}
                  </div>
                </div>
                {wallet.isConnected && wallet.address && (
                  <p className="font-mono text-xs text-muted break-all">{wallet.address}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleShareProfile}>
                  <QrCode size={16} className="mr-2" />
                  Share
                </Button>
                {copied && (
                  <span className="font-body text-xs text-accent flex items-center">
                    <Check size={14} className="mr-1" />
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RISS Score - Prominent */}
          <div className="bg-panel border-2 border-muted/20 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-accent">Reputation Score</h2>
              <Link to="/reputation">
                <Button variant="ghost" size="sm">
                  View Breakdown
                </Button>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <ReputationScore score={reputation.score} size="lg" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Total Activities</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {reputation.activities.length}
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Verified</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {reputation.activities.filter((a) => a.verificationLevel === 'verified').length}
                    </div>
                  </div>
                </div>
                <div className="bg-bg border-2 border-muted/20 p-4">
                  <div className="font-body text-sm text-muted mb-2">Score Breakdown</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-muted">Identity</span>
                      <span className="font-display font-bold text-accent">
                        {reputation.score.identity}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-muted">Contribution</span>
                      <span className="font-display font-bold text-accent">
                        {reputation.score.contribution}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-muted">Trust</span>
                      <span className="font-display font-bold text-accent">
                        {reputation.score.trust}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h3 className="font-display text-xl font-bold text-accent mb-4">Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.id}
                    className={`bg-bg border-2 ${
                      badge.earned ? 'border-accent' : 'border-muted/20'
                    } p-4`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 border-2 ${
                          badge.earned ? 'border-accent bg-accent/20' : 'border-muted/20'
                        }`}
                      >
                        <Icon
                          size={20}
                          className={badge.earned ? 'text-accent' : 'text-muted'}
                        />
                      </div>
                      <div>
                        <div
                          className={`font-display font-bold ${
                            badge.earned ? 'text-accent' : 'text-muted'
                          }`}
                        >
                          {badge.name}
                        </div>
                        {badge.earned && (
                          <div className="font-body text-xs text-muted">Earned</div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-accent">Activity Feed</h3>
              <Link to="/activity">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <ActivityFeed
              activities={reputation.activities.slice(0, 5)}
              onActivityClick={(activity) => {
                console.log('Activity clicked:', activity)
              }}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h3 className="font-display text-xl font-bold text-accent mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/verify">
                <Button variant="secondary" className="w-full">
                  <Shield size={16} className="mr-2" />
                  Verify Identity
                </Button>
              </Link>
              <Link to="/tasks">
                <Button variant="secondary" className="w-full">
                  <Award size={16} className="mr-2" />
                  View Tasks
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" className="w-full">
                  <Users size={16} className="mr-2" />
                  Explore
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" className="w-full">
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}
