import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, KeyRound, Webhook, ExternalLink, Users, Search, TrendingUp, Shield, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScoringPipeline } from '@/components/ScoringPipeline'
import { Progress } from '@/components/ui/Progress'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'
import { EmptyState, EmptySearch, EmptyDevelopers } from '@/components/ui/EmptyState'

const exampleCurl = `curl -X GET \
  https://api.riss.xyz/v1/reputation/{did} \
  -H "Authorization: Bearer <YOUR_API_KEY>"`

const exampleJson = `{
  "did": "did:riss:0x1234...5678",
  "score": 78,
  "breakdown": {
    "identity": 25,
    "contribution": 28,
    "trust": 15,
    "social": 7,
    "engagement": 3
  }
}`

type TabType = 'directory' | 'api'

export default function Developers() {
  const [activeTab, setActiveTab] = useState<TabType>('directory')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const fakeApiKey = 'riss_test_********************'

  // Mock developers data - in production, fetch from API
  const developers = [
    {
      id: '1',
      did: 'did:riss:0x1234...5678',
      username: 'alice.dev',
      reputation: 95,
      badges: ['Verified', 'KRNL Contributor', 'Top Builder'],
      activities: 234,
      verified: true,
      specialties: ['Smart Contracts', 'Frontend'],
    },
    {
      id: '2',
      did: 'did:riss:0xabcd...efgh',
      username: 'bob.builds',
      reputation: 89,
      badges: ['Verified', 'Trust Builder'],
      activities: 189,
      verified: true,
      specialties: ['DeFi', 'Security'],
    },
    {
      id: '3',
      did: 'did:riss:0x9876...5432',
      username: 'charlie.code',
      reputation: 87,
      badges: ['Verified'],
      activities: 156,
      verified: true,
      specialties: ['Full Stack', 'Web3'],
    },
    {
      id: '4',
      did: 'did:riss:0x5678...1234',
      username: 'diana.dapp',
      reputation: 82,
      badges: ['Verified', 'KRNL Contributor'],
      activities: 142,
      verified: true,
      specialties: ['UI/UX', 'React'],
    },
  ]

  const filteredDevelopers = developers.filter((dev) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      dev.username.toLowerCase().includes(query) ||
      dev.did.toLowerCase().includes(query) ||
      dev.specialties.some((s) => s.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
            Developers
          </h1>
          <p className="text-sm text-text-muted max-w-md">
            Browse developers on RISS or integrate our API into your app.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Users className="w-6 h-6 text-accent" />
          <Code2 className="w-6 h-6 text-text-muted" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'directory'
              ? 'text-accent border-accent'
              : 'text-text-muted border-transparent hover:text-text-primary'
          }`}
        >
          <Users className="w-4 h-4 inline-block mr-2" />
          Developer Directory
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'api'
              ? 'text-accent border-accent'
              : 'text-text-muted border-transparent hover:text-text-primary'
          }`}
        >
          <Code2 className="w-4 h-4 inline-block mr-2" />
          API & Integration
        </button>
      </div>

      {/* Developer Directory Tab */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Search */}
          <Card variant="glass">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search developers by name, DID, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Developers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredDevelopers.length === 0 ? (
            searchQuery ? (
              <EmptySearch query={searchQuery} />
            ) : (
              <EmptyDevelopers />
            )
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  {filteredDevelopers.length} developer{filteredDevelopers.length !== 1 ? 's' : ''} found
                </p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <TrendingUp className="w-4 h-4" />
                  <span>Sorted by reputation score</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevelopers.map((dev) => (
                  <Card
                    key={dev.id}
                    variant="glass"
                    hover
                    className="cursor-pointer"
                    onClick={() => navigate(`/profile/${encodeURIComponent(dev.did)}`)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-accent/20 border-2 border-accent rounded-full flex items-center justify-center">
                            <span className="font-display text-xl font-bold text-accent">
                              {dev.username[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-bold text-text-primary">
                              {dev.username}
                            </h3>
                            <p className="font-mono text-xs text-text-muted">
                              {dev.did}
                            </p>
                          </div>
                        </div>
                        {dev.verified && (
                          <Shield className="w-5 h-5 text-accent flex-shrink-0" />
                        )}
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-text-muted">Reputation</span>
                          <span className="text-sm font-bold text-accent">
                            {dev.reputation}
                          </span>
                        </div>
                        <Progress value={dev.reputation} variant="linear" color="accent" size="sm" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {dev.badges.slice(0, 2).map((badge) => (
                          <span
                            key={badge}
                            className="text-xs px-2 py-1 bg-accent-soft text-accent rounded-button"
                          >
                            {badge}
                          </span>
                        ))}
                        {dev.badges.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-bg-secondary text-text-muted rounded-button">
                            +{dev.badges.length - 2}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {dev.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-[10px] px-2 py-1 bg-bg-secondary text-text-muted rounded-button"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border">
                        <span>{dev.activities} activities</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/profile/${encodeURIComponent(dev.did)}`)
                          }}
                        >
                          View Profile
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* API & Integration Tab */}
      {activeTab === 'api' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass">
          <div className="flex items-center gap-3 mb-4">
            <KeyRound className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl font-bold text-text-primary">
              API Keys
            </h2>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Use API keys to access the RISS reputation API from server-side or trusted environments.
          </p>
          <Input
            label="Test API Key"
            value={fakeApiKey}
            readOnly
          />
          <p className="mt-2 text-xs text-text-muted">
            In production, generate and manage keys from the RISS dashboard. Never expose secrets in client-side code.
          </p>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-4">
            <Webhook className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl font-bold text-text-primary">
              Reputation & Proof Webhooks
            </h2>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Subscribe to reputation changes, verification events, AI score recomputations and KRNL
            task completions so your product can react in real time.
          </p>
          <ul className="text-sm text-text-muted space-y-1 mb-3 list-disc list-inside">
            <li><code className="text-accent">reputation.updated</code></li>
            <li><code className="text-accent">verification.completed</code></li>
            <li><code className="text-accent">task.verified</code></li>
          </ul>
          <Button variant="ghost" size="sm">
            Manage webhooks
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        <Card variant="glass">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-5 h-5 text-success" />
            <h2 className="font-display text-xl font-bold text-text-primary">
              SDKs
            </h2>
          </div>
          <p className="text-sm text-text-muted mb-4">
            Client libraries for TypeScript/JavaScript, Rust, and Motoko make it easy to query RISS from EVM, ICP, and KRNL modules.
          </p>
          <Button variant="ghost" size="sm">
            View SDK docs
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>

      {/* Scoring & proof flow */}
      <Card variant="glass">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Scoring & proof flow
          </h2>
          <span className="text-xs text-text-muted">For integrators</span>
        </div>
        <ScoringPipeline />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">
            Example: Fetch Developer Score by DID
          </h2>
          <pre className="bg-bg-panel rounded-card p-4 text-xs text-text-muted overflow-x-auto">
            <code>{exampleCurl}</code>
          </pre>
          <p className="mt-3 text-xs text-text-muted">
            Replace <code>&lt;YOUR_API_KEY&gt;</code> with a real key and <code>{'{did}'}</code> with a valid RISS DID.
          </p>
        </Card>

        <Card variant="glass">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">
            Example Scoring Payload
          </h2>
          <pre className="bg-bg-panel rounded-card p-4 text-xs text-text-muted overflow-x-auto">
            <code>{exampleJson}</code>
          </pre>
        </Card>
          </div>
        </div>
      )}
    </div>
  )
}