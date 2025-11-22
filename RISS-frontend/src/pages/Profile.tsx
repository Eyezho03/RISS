import { useParams } from 'react-router-dom'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { ReputationScore } from '@/components/ReputationScore'
import { ActivityFeed } from '@/components/ActivityFeed'
import { Button } from '@/components/ui/Button'
import { Shield, Award, Users, TrendingUp, Share2, Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { RISS_REPUTATION_ADDRESS, RISS_REPUTATION_ABI } from '@/lib/contracts'
import type { UserProfile, ActivityProof, Badge } from '@/types/reputation'

interface ScoreProofMeta {
  onChain: boolean
  engineVersion: string
  lastUpdated: string | null
  ipfsCid: string | null
  proofHash: string | null
}

export default function Profile(): JSX.Element {
  const { did } = useParams<{ did: string }>()
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<ActivityProof[]>([])
  const [proof, setProof] = useState<ScoreProofMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [onChainStatus, setOnChainStatus] = useState<'idle' | 'checking' | 'match' | 'mismatch' | 'error'>('idle')
  const [onChainScore, setOnChainScore] = useState<number | null>(null)

  // Load profile + reputation + proof from backend
  useEffect(() => {
    const load = async () => {
      if (!did) return
      try {
        setLoading(true)
        setLoadError(null)

        const userRes = await fetch(`/api/user/${encodeURIComponent(did)}`)
        if (!userRes.ok) {
          throw new Error('Failed to load user')
        }
        const userJson = await userRes.json()
        const address: string | undefined = userJson.walletAddress

        let breakdown: any | null = null
        let reputationPayload: any | null = null

        if (address) {
          const [breakdownRes, repRes] = await Promise.all([
            fetch(`/api/reputation/${encodeURIComponent(address)}/breakdown`),
            fetch(`/api/reputation/${encodeURIComponent(address)}`),
          ])

          if (breakdownRes.ok) {
            breakdown = await breakdownRes.json()
          }
          if (repRes.ok) {
            reputationPayload = await repRes.json()
          }
        }

        const effectiveScore = breakdown?.score ?? userJson.reputationScore ?? {
          total: 0,
          identity: 0,
          contribution: 0,
          trust: 0,
          social: 0,
          engagement: 0,
        }

        const badges: Badge[] = []
        if (userJson.verificationLevel === 'verified' || userJson.verificationLevel === 'premium') {
          badges.push({
            id: 'identity',
            name: 'Identity Verified',
            description: 'On-chain / off-chain identity checks approved',
            icon: 'shield',
            earnedAt: new Date().toISOString(),
            category: 'identity',
          })
        }
        if ((effectiveScore.total ?? 0) >= 80) {
          badges.push({
            id: 'top-contributor',
            name: 'Top Contributor',
            description: 'In the top cohort of RISS scores',
            icon: 'award',
            earnedAt: new Date().toISOString(),
            category: 'contribution',
          })
        }

        const profile: UserProfile = {
          did: userJson.did,
          username:
            userJson.username ||
            (userJson.walletAddress
              ? `${userJson.walletAddress.slice(0, 6)}...${userJson.walletAddress.slice(-4)}`
              : userJson.did),
          walletAddresses: userJson.walletAddress ? [userJson.walletAddress] : [],
          reputation: effectiveScore,
          badges,
          activityCount: breakdown?.stats?.totalActivities ?? 0,
          verificationLevel: userJson.verificationLevel || 'unverified',
          joinedAt: userJson.createdAt ?? new Date().toISOString(),
          socialAccounts: userJson.socialAccounts,
        }

        const mappedActivities: ActivityProof[] = (breakdown?.activities ?? []).map((a: any) => ({
          id: a.id,
          type: a.type,
          title: a.title,
          description: a.description ?? '',
          source: a.source,
          timestamp:
            typeof a.timestamp === 'string'
              ? a.timestamp
              : new Date(a.timestamp).toISOString(),
          verificationLevel: a.verificationLevel ?? 'pending',
          scoreImpact: a.scoreImpact ?? 0,
          metadata: a.metadata,
        }))

        setUser(profile)
        setActivities(mappedActivities)
        if (reputationPayload?.proof) {
          setProof(reputationPayload.proof as ScoreProofMeta)
        }
      } catch (err) {
        console.error('Failed to load profile', err)
        setLoadError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [did])

  const effectiveUser: UserProfile =
    user || {
      did: did || 'did:riss:sample',
      username: 'sample.dev',
      walletAddresses: [],
      reputation: {
        total: 80,
        identity: 80,
        contribution: 80,
        trust: 80,
        social: 80,
        engagement: 80,
      },
      badges: [],
      activityCount: activities.length,
      verificationLevel: 'unverified',
      joinedAt: new Date().toISOString(),
    }

  const handleShare = async (): Promise<void> => {
    const url = `${window.location.origin}/profile/${effectiveUser.did}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyOnChain = async (): Promise<void> => {
    try {
      if (!effectiveUser.walletAddresses.length || !RISS_REPUTATION_ADDRESS) {
        setOnChainStatus('error')
        return
      }

      const userAddress = effectiveUser.walletAddresses[0]
      const anyWindow = window as any
      const ethProvider = anyWindow.ethereum
      if (!ethProvider) {
        setOnChainStatus('error')
        return
      }

      setOnChainStatus('checking')

      const provider = new ethers.BrowserProvider(ethProvider)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        RISS_REPUTATION_ADDRESS,
        RISS_REPUTATION_ABI,
        signer,
      )

      const score = await contract.getReputationScore(userAddress)
      const total = Number(score.total ?? score[0])
      setOnChainScore(total)
      setOnChainStatus(total === effectiveUser.reputation.total ? 'match' : 'mismatch')
    } catch (err) {
      console.error('Failed to verify on-chain', err)
      setOnChainStatus('error')
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {loadError && (
            <div className="bg-panel border-2 border-error/60 p-4 mb-4">
              <p className="font-body text-xs text-error">
                {loadError} – showing a fallback sample profile.
              </p>
            </div>
          )}
          {/* Profile Header */}
          <div className="bg-panel border-2 border-accent p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-accent/20 border-2 border-accent flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-accent">
                    {effectiveUser.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-accent mb-1">
                    {effectiveUser.username}
                  </h1>
                  <p className="font-mono text-sm text-muted break-all">{effectiveUser.did}</p>
                  {effectiveUser.walletAddresses.length > 0 && (
                    <p className="font-mono text-xs text-muted mt-1">
                      {effectiveUser.walletAddresses[0].slice(0, 6)}...{effectiveUser.walletAddresses[0].slice(-4)}
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
                {effectiveUser.reputation.total}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Activities</div>
              <div className="font-display text-2xl font-bold text-accent">
                {effectiveUser.activityCount}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Badges</div>
              <div className="font-display text-2xl font-bold text-accent">
                {effectiveUser.badges.length}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Status</div>
              <div className="font-display text-xl font-bold text-accent capitalize">
                {effectiveUser.verificationLevel}
              </div>
            </div>
          </div>

          {/* Reputation Score */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">Reputation Score</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ReputationScore score={effectiveUser.reputation} size="lg" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Identity</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {effectiveUser.reputation.identity}/100
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Contribution</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {effectiveUser.reputation.contribution}/100
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Trust</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {effectiveUser.reputation.trust}/100
                    </div>
                  </div>
                  <div className="bg-bg border-2 border-muted/20 p-4">
                    <div className="font-body text-sm text-muted mb-1">Social</div>
                    <div className="font-display text-2xl font-bold text-accent">
                      {effectiveUser.reputation.social}/100
                    </div>
                  </div>
                </div>
                <div className="bg-bg border-2 border-accent/40 p-4 mt-2">
                  <h3 className="font-display text-sm font-bold text-accent mb-2">
                    AI scoring explanation
                  </h3>
                  <p className="font-body text-xs text-muted mb-2">
                    RISS uses a rule-based AI engine to combine your identity, contribution,
                    trust, social and engagement signals into a 0 13100 score. The weights are fixed
                    and transparent so DAOs and protocols can audit how this score was produced.
                  </p>
                  <ul className="list-disc list-inside font-body text-xs text-muted space-y-1">
                    <li>Identity: documents + DID verifications anchored on KRNL.</li>
                    <li>Contribution: GitHub, KRNL tasks, hackathons and DAO bounty history.</li>
                    <li>Trust: peer attestations, on-chain reviews and cross-DAO reputation.</li>
                    <li>Social: ecosystem presence and community impact.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Verifiable score proof */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-4">Verifiable score proof</h2>
            <p className="font-body text-sm text-muted mb-4">
              Every RISS score can be backed by an IPFS-stored proof generated by the KRNL
              proof engine. Any smart contract or dApp can independently verify this proof.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-body">
              <div className="bg-bg border-2 border-muted/20 p-3">
                <div className="text-xs text-muted mb-1">Score proof hash</div>
                <div className="font-mono text-accent text-xs break-all">
                  {proof?.proofHash ?? 'Not generated yet'}
                </div>
              </div>
              <div className="bg-bg border-2 border-muted/20 p-3">
                <div className="text-xs text-muted mb-1">IPFS CID</div>
                <div className="font-mono text-accent text-xs break-all">
                  {proof?.ipfsCid ?? 'IPFS proof not generated yet'}
                </div>
              </div>
              <div className="bg-bg border-2 border-muted/20 p-3">
                <div className="text-xs text-muted mb-1">Last updated</div>
                <div className="text-accent text-sm">
                  {proof?.lastUpdated ? new Date(proof.lastUpdated).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleVerifyOnChain}
                  disabled={onChainStatus === 'checking' || !effectiveUser.walletAddresses.length}
                >
                  {onChainStatus === 'checking' ? 'Verifying…' : 'Verify on-chain'}
                </Button>
                {onChainScore !== null && (
                  <span className="text-text-muted">
                    On-chain total: <span className="text-accent font-mono">{onChainScore}</span>
                  </span>
                )}
              </div>
              {onChainStatus === 'match' && (
                <span className="text-success">
                  On-chain score matches backend / AI-computed score.
                </span>
              )}
              {onChainStatus === 'mismatch' && (
                <span className="text-warning">
                  On-chain score does not match backend score — re-sync recommended.
                </span>
              )}
              {onChainStatus === 'error' && (
                <span className="text-error">
                  Could not verify on-chain (wallet or contract not configured).
                </span>
              )}
            </div>
          </div>

          {/* Badges */}
          {effectiveUser.badges.length > 0 && (
            <div className="bg-panel border-2 border-muted/20 p-6">
              <h2 className="font-display text-2xl font-bold text-accent mb-6">Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {effectiveUser.badges.map((badge) => (
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
          {effectiveUser.socialAccounts && (
            <div className="bg-panel border-2 border-muted/20 p-6">
              <h2 className="font-display text-2xl font-bold text-accent mb-4">Connected Accounts</h2>
              <div className="space-y-2">
                {effectiveUser.socialAccounts.github && (
                  <div className="bg-bg border-2 border-muted/20 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-display font-bold text-accent">GitHub</span>
                      <span className="font-body text-sm text-muted">{effectiveUser.socialAccounts.github}</span>
                    </div>
                  </div>
                )}
                {effectiveUser.socialAccounts.twitter && (
                  <div className="bg-bg border-2 border-muted/20 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-display font-bold text-accent">Twitter</span>
                      <span className="font-body text-sm text-muted">{effectiveUser.socialAccounts.twitter}</span>
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

