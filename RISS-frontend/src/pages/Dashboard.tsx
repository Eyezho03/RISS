import {
  User, Shield, Award, TrendingUp,
  CheckCircle, Clock, XCircle, ExternalLink,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { useKrnl } from '@/krnl/KrnlContext'
import { TrustGraph } from '@/components/TrustGraph'
import { ScoringPipeline } from '@/components/ScoringPipeline'

export default function Dashboard() {
  const { state, loading } = useKrnl()

  const fallbackState = {
    profile: {
      did: 'did:riss:0x1234...5678',
      wallets: ['0x1234...5678'],
      identityStrength: 85,
      badges: ['Verified Identity', 'KRNL Contributor', 'Trust Builder'],
    },
    reputation: {
      score: 78,
      identity: 25,
      contribution: 28,
      trust: 15,
      social: 7,
      engagement: 3,
    },
    tasks: [],
  }

  const effectiveState = state ?? fallbackState

  const reputationScore = effectiveState.reputation.score
  const identityStrength = effectiveState.profile.identityStrength

  const reputationBreakdown = [
    { label: 'Identity', value: effectiveState.reputation.identity, max: 25, color: 'purple' as const },
    { label: 'Contribution', value: effectiveState.reputation.contribution, max: 35, color: 'cyan' as const },
    { label: 'Trust', value: effectiveState.reputation.trust, max: 20, color: 'success' as const },
    { label: 'Social', value: effectiveState.reputation.social, max: 10, color: 'warning' as const },
    { label: 'Engagement', value: effectiveState.reputation.engagement, max: 10, color: 'purple' as const },
  ]

  const badges = effectiveState.profile.badges.map((name) => ({
    name,
    icon: name === 'Verified Identity' ? Shield : name === 'KRNL Contributor' ? Award : TrendingUp,
    color:
      name === 'Verified Identity'
        ? 'text-primary-purple'
        : name === 'KRNL Contributor'
        ? 'text-primary-cyan'
        : 'text-success',
  }))

  const activities = [
    {
      id: '1',
      type: 'KRNL Task',
      title: 'Completed Smart Contract Audit',
      source: 'KRNL Protocol',
      timestamp: '2 hours ago',
      status: 'verified',
      score: '+15',
    },
    {
      id: '2',
      type: 'Verification',
      title: 'Identity Verification Approved',
      source: 'RISS Verifier',
      timestamp: '1 day ago',
      status: 'verified',
      score: '+10',
    },
    {
      id: '3',
      type: 'Contribution',
      title: 'GitHub PR Merged',
      source: 'github.com',
      timestamp: '3 days ago',
      status: 'verified',
      score: '+8',
    },
    {
      id: '4',
      type: 'Verification',
      title: 'Skill Verification Pending',
      source: 'RISS Verifier',
      timestamp: '5 days ago',
      status: 'pending',
      score: 'Pending',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-error" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-text-muted">
            Score, identity, activity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/verification">
            <Button variant="primary">
              Start Verification
            </Button>
          </Link>
          <Link to="/reputation">
            <Button variant="ghost" size="sm">
              View AI score breakdown
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid - 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* DID Profile Card */}
          <Card variant="glass">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-purple to-primary-cyan rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  {state?.profile.did ?? 'did:riss:loading...'}
                </h3>
                <p className="text-sm text-text-muted">
                  Identity Strength: {identityStrength}%
                </p>
              </div>
            </div>
            <Progress
              value={identityStrength}
              variant="linear"
              color="purple"
              size="md"
            />
          </Card>

          {/* Reputation Score Card */}
          <Card variant="glass">
            <div className="text-center mb-6">
              <div className="text-5xl font-display font-bold text-primary-cyan mb-2">
                {loading ? '—' : reputationScore}
              </div>
              <div className="text-text-muted">Reputation Score</div>
            </div>
            <Progress
              value={reputationScore}
              variant="radial"
              size="lg"
              color="cyan"
            />
          </Card>

          {/* Badges */}
          <Card variant="glass">
            <h3 className="font-display text-lg font-bold text-text-primary mb-4">
              Badges
            </h3>
            <div className="space-y-3">
              {loading && badges.length === 0 && (
                <p className="text-sm text-text-muted">Loading badges...</p>
              )}
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex items-center gap-3 p-3 bg-bg-secondary rounded-button"
                >
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="text-sm text-text-primary">{badge.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Breakdown, Scoring Engine, Trust Graph & Activity */}
        <div className="lg:col-span-8 space-y-6">
          {/* Reputation Breakdown */}
          <Card variant="glass">
            <h3 className="font-display text-xl font-bold text-text-primary mb-6">
              Reputation Breakdown
            </h3>
            <div className="space-y-4">
              {reputationBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      {item.label}
                    </span>
                    <span className="text-sm text-text-muted">
                      {item.value} / {item.max}
                    </span>
                  </div>
                  <Progress
                    value={(item.value / item.max) * 100}
                    variant="linear"
                    color={item.color}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Scoring Engine Overview */}
          <Card variant="glass">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl font-bold text-text-primary">
                Scoring flow
              </h3>
              <span className="text-xs text-text-muted">From DID to on-chain proof</span>
            </div>
            <ScoringPipeline />
          </Card>

          {/* Trust Graph */}
          <TrustGraph />

          {/* Activity Feed */}
          <Card variant="glass">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-text-primary">
                Activity Feed
              </h3>
              <Link to="/activity">
                <Button variant="ghost" size="sm">
                  View All
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-bg-secondary rounded-button hover:bg-bg-panel transition-colors"
                >
                  <div className="mt-1">{getStatusIcon(activity.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary-cyan uppercase">
                            {activity.type}
                          </span>
                        </div>
                        <h4 className="font-medium text-text-primary mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-text-muted">
                          {activity.source} • {activity.timestamp}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-bold ${
                            activity.status === 'verified'
                              ? 'text-success'
                              : activity.status === 'pending'
                              ? 'text-warning'
                              : 'text-error'
                          }`}
                        >
                          {activity.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
