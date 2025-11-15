import { useParams } from 'react-router-dom'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { ReputationScore } from '@/components/ReputationScore'
import { ActivityFeed } from '@/components/ActivityFeed'
import { Shield, Award, Users, TrendingUp, Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { UserProfile } from '@/types/reputation'

export default function Profile(): JSX.Element {
  const { did } = useParams<{ did: string }>()
  const [copied, setCopied] = useState(false)

  // Mock user data - in production, fetch by DID
  const user: UserProfile = {
    did: did || 'did:riss:user1',
    username: 'alice.eth',
    walletAddresses: ['0x1234567890123456789012345678901234567890'],
    reputation: {
      total: 85,
      identity: 90,
      contribution: 80,
      trust: 75,
      social: 70,
      engagement: 65,
    },
    badges: [
      { id: '1', name: 'Identity Verified', description: 'Verified identity', icon: 'shield', earnedAt: new Date().toISOString(), category: 'identity' },
      { id: '2', name: 'Top Contributor', description: 'Top 10% contributor', icon: 'award', earnedAt: new Date().toISOString(), category: 'contribution' },
    ],
    activityCount: 42,
    verificationLevel: 'verified',
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    socialAccounts: {
      github: 'alice-dev',
      twitter: '@alice_eth',
    },
  }

  const handleShare = async (): Promise<void> => {
    const url = `${window.location.origin}/profile/${user.did}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Mock activities
  const activities = [
    {
      id: '1',
      type: 'github_commit' as const,
      title: 'Fixed authentication bug',
      description: 'Resolved issue with token refresh mechanism',
      source: 'GitHub',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      verificationLevel: 'verified' as const,
      scoreImpact: 10,
    },
    {
      id: '2',
      type: 'krnl_task_completed' as const,
      title: 'Completed RISS Dashboard task',
      description: 'Built comprehensive dashboard with reputation breakdown',
      source: 'KRNL',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      verificationLevel: 'verified' as const,
      scoreImpact: 25,
    },
  ]

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Profile Header */}
          <div className="bg-panel border-2 border-accent p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-accent/20 border-2 border-accent flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-accent">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-accent mb-1">
                    {user.username}
                  </h1>
                  <p className="font-mono text-sm text-muted break-all">{user.did}</p>
                  {user.walletAddresses.length > 0 && (
                    <p className="font-mono text-xs text-muted mt-1">
                      {user.walletAddresses[0].slice(0, 6)}...{user.walletAddresses[0].slice(-4)}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                {copied ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="mr-2" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">RISS Score</div>
              <div className="font-display text-2xl font-bold text-accent">
                {user.reputation.total}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Activities</div>
              <div className="font-display text-2xl font-bold text-accent">
                {user.activityCount}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Badges</div>
              <div className="font-display text-2xl font-bold text-accent">
                {user.badges.length}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Status</div>
              <div className="font-display text-xl font-bold text-accent capitalize">
                {user.verificationLevel}
              </div>
            </div>
          </div>

          {/* Reputation Score */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">Reputation Score</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ReputationScore score={user.reputation} size="lg" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Identity</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {user.reputation.identity}/100
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Contribution</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {user.reputation.contribution}/100
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Trust</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {user.reputation.trust}/100
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Social</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {user.reputation.social}/100
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="bg-panel border-2 border-muted/20 p-6">
              <h2 className="font-display text-2xl font-bold text-accent mb-6">Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-bg border-2 border-accent p-4 flex items-center space-x-3"
                  >
                    <div className="p-2 border-2 border-accent bg-accent/20">
                      <Award size={24} className="text-accent" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-accent">{badge.name}</div>
                      <div className="font-body text-xs text-muted">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Accounts */}
          {user.socialAccounts && (
            <div className="bg-panel border-2 border-muted/20 p-6">
              <h2 className="font-display text-2xl font-bold text-accent mb-4">Connected Accounts</h2>
              <div className="space-y-2">
                {user.socialAccounts.github && (
                  <div className="bg-bg border-2 border-muted/20 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-display font-bold text-accent">GitHub</span>
                      <span className="font-body text-sm text-muted">{user.socialAccounts.github}</span>
                    </div>
                  </div>
                )}
                {user.socialAccounts.twitter && (
                  <div className="bg-bg border-2 border-muted/20 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-display font-bold text-accent">Twitter</span>
                      <span className="font-body text-sm text-muted">{user.socialAccounts.twitter}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Feed */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">Recent Activity</h2>
            <ActivityFeed activities={activities} />
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}

