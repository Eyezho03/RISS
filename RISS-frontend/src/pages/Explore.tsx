import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, Building2, TrendingUp, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'users' | 'daos'>('all')
  const navigate = useNavigate()

  const topUsers = [
    {
      id: '1',
      did: 'did:riss:0x1234...5678',
      reputation: 95,
      badges: ['Verified', 'KRNL Contributor'],
      activities: 234,
    },
    {
      id: '2',
      did: 'did:riss:0xabcd...efgh',
      reputation: 89,
      badges: ['Verified', 'Trust Builder'],
      activities: 189,
    },
    {
      id: '3',
      did: 'did:riss:0x9876...5432',
      reputation: 87,
      badges: ['Verified'],
      activities: 156,
    },
  ]

  const topDAOs = [
    {
      id: '1',
      name: 'KRNL Protocol DAO',
      members: 1250,
      reputation: 98,
      description: 'Leading decentralized task protocol',
    },
    {
      id: '2',
      name: 'RISS Governance',
      members: 890,
      reputation: 92,
      description: 'RISS platform governance and development',
    },
    {
      id: '3',
      name: 'Web3 Builders',
      members: 567,
      reputation: 85,
      description: 'Community of Web3 developers and contributors',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
          Explore
        </h1>
        <p className="text-sm text-text-muted">
          Find builders and DAOs.
        </p>
      </div>

      {/* Search & Filters */}
      <Card variant="glass">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by DID, address, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
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
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button
              variant={filter === 'daos' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('daos')}
            >
              <Building2 className="w-4 h-4 mr-2" />
              DAOs
            </Button>
          </div>
        </div>
      </Card>

      {/* Top Users Section */}
      {(filter === 'all' || filter === 'users') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-cyan" />
              Top Contributors
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topUsers.map((user) => (
              <Card key={user.id} variant="glass" hover>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                      {user.did}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      {user.badges.map((badge) => (
                        <span
                          key={badge}
                          className="text-xs px-2 py-1 bg-primary-purple/20 text-primary-purple rounded-button"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-text-muted">Reputation</span>
                      <span className="text-sm font-bold text-primary-cyan">
                        {user.reputation}
                      </span>
                    </div>
                    <Progress value={user.reputation} variant="linear" color="cyan" size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-muted">
                    <span>{user.activities} activities</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/profile/${encodeURIComponent(user.did)}`)}
                    >
                      View Profile
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Top DAOs Section */}
      {(filter === 'all' || filter === 'daos') && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-purple" />
            Top DAOs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topDAOs.map((dao) => (
              <Card key={dao.id} variant="glass" hover>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                      {dao.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-4">{dao.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Reputation Score</span>
                      <span className="text-sm font-bold text-primary-purple">
                        {dao.reputation}
                      </span>
                    </div>
                    <Progress value={dao.reputation} variant="linear" color="purple" size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">
                      {dao.members.toLocaleString()} members
                    </span>
                    <Button variant="ghost" size="sm">
                      View DAO
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
