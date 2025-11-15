import { useState } from 'react'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ReputationScore } from '@/components/ReputationScore'
import { Search, TrendingUp, Users, Award, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { UserProfile, Organization } from '@/types/reputation'

export default function Explore(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'users' | 'organizations'>('all')

  // Mock data
  const mockUsers: UserProfile[] = [
    {
      did: 'did:riss:user1',
      username: 'alice.eth',
      walletAddresses: ['0x1234...5678'],
      reputation: { total: 85, identity: 90, contribution: 80, trust: 75, social: 70, engagement: 65 },
      badges: [],
      activityCount: 42,
      verificationLevel: 'verified',
      joinedAt: new Date().toISOString(),
    },
    {
      did: 'did:riss:user2',
      username: 'bob.dev',
      walletAddresses: ['0xabcd...efgh'],
      reputation: { total: 72, identity: 75, contribution: 70, trust: 65, social: 60, engagement: 55 },
      badges: [],
      activityCount: 28,
      verificationLevel: 'verified',
      joinedAt: new Date().toISOString(),
    },
  ]

  const mockOrgs: Organization[] = [
    {
      id: 'org1',
      name: 'Web3 Builders DAO',
      type: 'dao',
      description: 'A community of Web3 developers building the future',
      reputation: { total: 95, identity: 100, contribution: 90, trust: 95, social: 85, engagement: 90 },
      memberCount: 150,
      taskCount: 45,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'org2',
      name: 'Open Source Grants',
      type: 'grant_program',
      description: 'Funding open source projects',
      reputation: { total: 88, identity: 90, contribution: 85, trust: 90, social: 80, engagement: 85 },
      memberCount: 75,
      taskCount: 20,
      createdAt: new Date().toISOString(),
    },
  ]

  const filteredUsers = mockUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredOrgs = mockOrgs.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Header */}
          <div>
            <h1 className="font-display text-4xl font-bold text-accent mb-2">Explore</h1>
            <p className="font-body text-muted">
              Discover top contributors, verified experts, and organizations
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                <Input
                  className="pl-10"
                  placeholder="Search users, organizations, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'users' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('users')}
                >
                  <Users size={16} className="mr-2" />
                  Users
                </Button>
                <Button
                  variant={filter === 'organizations' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('organizations')}
                >
                  <Building2 size={16} className="mr-2" />
                  Orgs
                </Button>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          {(filter === 'all' || filter === 'users') && (
            <div className="bg-panel border-2 border-muted/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-accent">Top Contributors</h2>
                <TrendingUp size={24} className="text-accent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                  <Link
                    key={user.did}
                    to={`/profile/${user.did}`}
                    className="bg-bg border-2 border-muted/20 p-4 hover:border-accent transition-colors"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <span className="font-display text-lg font-bold text-accent">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-accent">{user.username}</h3>
                        <p className="font-mono text-xs text-muted">{user.did.slice(0, 20)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-body text-xs text-muted">RISS Score</div>
                        <div className="font-display text-xl font-bold text-accent">
                          {user.reputation.total}
                        </div>
                      </div>
                      <div>
                        <div className="font-body text-xs text-muted">Activities</div>
                        <div className="font-display text-xl font-bold text-accent">
                          {user.activityCount}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Organizations */}
          {(filter === 'all' || filter === 'organizations') && (
            <div className="bg-panel border-2 border-muted/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-accent">Organizations</h2>
                <Building2 size={24} className="text-accent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrgs.map((org) => (
                  <Link
                    key={org.id}
                    to={`/org/${org.id}`}
                    className="bg-bg border-2 border-muted/20 p-6 hover:border-accent transition-colors block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-xl font-bold text-accent mb-1">
                          {org.name}
                        </h3>
                        <p className="font-body text-sm text-muted mb-2">{org.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted">
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {org.memberCount} members
                          </span>
                          <span className="flex items-center">
                            <Award size={14} className="mr-1" />
                            {org.taskCount} tasks
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-body text-xs text-muted mb-1">Reputation</div>
                        <div className="font-display text-2xl font-bold text-accent">
                          {org.reputation.total}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </StaggerReveal>
      </div>
    </div>
  )
}

