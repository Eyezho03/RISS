import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Zap, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ScoringPipeline } from '@/components/ScoringPipeline'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { useAuth } from '@/auth/AuthContext'
import { useWallet } from '@/hooks/useWallet'
import { useReputation } from '@/hooks/useReputation'

type LandingStats = {
  activeBuilders: number
  reputationPoints: number
  verifiedIdentities: number
  krnlTasks: number
}

export default function Landing() {
  const { setUserType } = useAuth()
  const navigate = useNavigate()
  const { address, isConnected, isConnecting } = useWallet()
  const { score, isLoading } = useReputation(isConnected && address ? address : undefined)
  const [stats, setStats] = useState<LandingStats | null>(null)

  useEffect(() => {
    const loadStats = async (): Promise<void> => {
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) return
        const data = await res.json()
        setStats({
          activeBuilders: data.activeBuilders ?? 0,
          reputationPoints: data.reputationPoints ?? 0,
          verifiedIdentities: data.verifiedIdentities ?? 0,
          krnlTasks: data.krnlTasks ?? 0,
        })
      } catch {
        // ignore, fall back to defaults
      }
    }

    void loadStats()
  }, [])

  const features = [
    {
      icon: Shield,
      title: 'DIDs anchored on KRNL',
      description:
        'Developers create decentralized identifiers (DIDs) through RISS, anchored on KRNL, so identity and verification are trustless and portable.',
    },
    {
      icon: TrendingUp,
      title: 'On-chain Dev Scoring Engine',
      description:
        'A transparent scoring engine combines identity, contribution, trust and social signals into a verifiable 0–100 score for builders.',
    },
    {
      icon: Zap,
      title: 'Verifiable Hiring for DAOs',
      description:
        'Protocols, DAOs and clients can query RISS and hire or fund contributors based on cryptographic proofs of their score.',
    },
    {
      icon: Users,
      title: 'Data Aggregation & IPFS Storage',
      description:
        'RISS aggregates GitHub, hackathons, DAOs, LinkedIn, X and on-chain proofs, storing verified credentials securely via IPFS.',
    },
  ]

  const statsStateToDisplay = (n?: number): string => {
    if (typeof n !== 'number') return '0'
    if (n < 1000) return String(n)
    if (n < 1000000) return `${(n / 1000).toFixed(1)}K`
    return `${(n / 1000000).toFixed(1)}M`
  }

  const statsDisplayData = [
    {
      label: 'Active builders',
      value: statsStateToDisplay(stats?.activeBuilders),
    },
    {
      label: 'Reputation points',
      value: statsStateToDisplay(stats?.reputationPoints),
    },
    {
      label: 'Verified identities',
      value: statsStateToDisplay(stats?.verifiedIdentities),
    },
    {
      label: 'KRNL tasks',
      value: statsStateToDisplay(stats?.krnlTasks),
    },
  ]

  return (
    <div className="relative space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-card border border-border bg-bg-panel px-4 py-16 md:py-24">
        <div className="landing-hero-grid" />
        <div className="landing-orb" />
        <StaggerReveal>
          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] items-center">
            {/* Left column: narrative + primary CTAs */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-secondary border border-accent/40 text-[11px] uppercase tracking-[0.2em] text-text-muted mb-2 floating-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>On-chain dev reputation</span>
              </div>
              <div className="space-y-3">
                <h1 className="font-display text-3xl md:text-5xl font-bold text-text-primary leading-tight">
                  Prove your work. Own your score.
                </h1>
                <p className="text-sm md:text-base text-text-muted max-w-md">
                  Connect a wallet, mint a DID, and turn real contributions into a verifiable builder score.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => {
                    setUserType('developer')
                    navigate('/auth')
                  }}
                >
                  Get my score
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    setUserType('organization')
                    navigate('/auth')
                  }}
                >
                  Screen builders
                </Button>
                <div className="text-[11px] text-text-muted/80">
                  No forms. Just wallet, DID and proofs.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted mt-6">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-border bg-bg-panel/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  EVM chains
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-border bg-bg-panel/40">
                  KRNL Protocol
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-border bg-bg-panel/40">
                  IPFS proofs
                </span>
              </div>
            </div>

            {/* Right column: live score card */}
            <div className="flex justify-center">
              <Card variant="glass" className="relative w-full max-w-md border border-accent/30 bg-bg-panel">
                <div className="absolute inset-0 rounded-card border border-accent/10 pointer-events-none" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-text-muted mb-1">
                        Current wallet
                      </div>
                      <div className="font-mono text-xs text-text-primary">
                        {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                      <span
                        className={`w-2 h-2 rounded-full ${isConnected && address ? 'bg-success' : 'bg-error'}`}
                      />
                      <span>{isConnected && address ? 'Live' : 'Awaiting connection'}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-text-muted mb-1">
                        RISS score
                      </div>
                      <div className="font-display text-5xl font-bold text-accent">
                        {isConnected && address ? score.total : '--'}
                      </div>
                      <div className="mt-2 text-[11px] text-text-muted max-w-[16rem]">
                        {isLoading || isConnecting
                          ? 'Fetching reputation from contracts and backend...'
                          : isConnected && address
                            ? 'Weighted score derived from verified activity, KRNL tasks and identity proofs.'
                            : 'Connect your wallet to compute a score from your activity and proofs.'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-[11px] min-w-[7rem]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted">Identity</span>
                        <span className="font-mono text-accent">
                          {score.identity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted">Contribution</span>
                        <span className="font-mono text-accent">
                          {score.contribution}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted">Trust</span>
                        <span className="font-mono text-accent">
                          {score.trust}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-muted">Social</span>
                        <span className="font-mono text-accent">
                          {score.social}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-4 text-[11px] text-text-muted">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span>Next milestone</span>
                        <span className="font-mono text-accent">
                          {isConnected && address ? `${Math.min(100, score.total + 5)}+` : '—'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-500"
                          style={{ width: `${Math.min(100, score.total)}%` }}
                        />
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-[10px] text-text-muted">Backed by</span>
                      <span className="text-[11px] text-text-primary">RISSReputation.sol</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </StaggerReveal>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statsDisplayData.map((stat) => (
          <Card key={stat.label} variant="glass" className="text-center">
            <div className="text-3xl font-display font-bold text-accent mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-text-muted">{stat.label}</div>
          </Card>
        ))}
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-semibold text-text-primary">
            How it works
          </h2>
          <div className="flex justify-center">
            <ScoringPipeline />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} variant="glass" hover>
              <feature.icon className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-muted text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-card">
        <div className="absolute inset-0 bg-accent-soft" />
        <Card variant="bordered" className="relative text-center space-y-4 py-10">
          <h2 className="font-display text-2xl font-semibold text-text-primary">
            Get your RISS score
          </h2>
          <p className="text-sm text-text-muted max-w-sm mx-auto">
            Create a DID, link profiles, and start building a verifiable on-chain reputation.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="primary">
              Connect Wallet & Start
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}
