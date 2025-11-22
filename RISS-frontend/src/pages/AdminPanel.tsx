import { useState } from 'react'
import { Users, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const verificationRequests = [
    {
      id: '1',
      user: 'did:riss:0x1234...5678',
      type: 'Identity Verification',
      submitted: '2 hours ago',
      status: 'pending',
      documents: 3,
    },
    {
      id: '2',
      user: 'did:riss:0xabcd...efgh',
      type: 'Skill Verification',
      submitted: '5 hours ago',
      status: 'pending',
      documents: 2,
    },
    {
      id: '3',
      user: 'did:riss:0x9876...5432',
      type: 'Project Verification',
      submitted: '1 day ago',
      status: 'approved',
      documents: 5,
    },
    {
      id: '4',
      user: 'did:riss:0x5678...1234',
      type: 'Identity Verification',
      submitted: '2 days ago',
      status: 'rejected',
      documents: 2,
    },
  ]

  const stats = [
    { label: 'Total Users', value: '12,543', change: '+12%' },
    { label: 'Pending Verifications', value: '234', change: '+5%' },
    { label: 'Approved Today', value: '89', change: '+23%' },
    { label: 'Rejected Today', value: '12', change: '-8%' },
  ]

  const filteredRequests = verificationRequests.filter((request) => {
    if (filter !== 'all' && request.status !== filter) return false
    if (searchQuery && !request.user.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-error" />
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />
      default:
        return null
    }
  }

  const handleReview = (id: string, action: 'approve' | 'reject') => {
    // Placeholder for review action
    console.log(`Review ${action} for ${id}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-text-primary mb-1">
          Admin Panel
        </h1>
        <p className="text-sm text-text-muted">
          Verifications & usage.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} variant="glass">
            <div className="space-y-2">
              <div className="text-sm text-text-muted">{stat.label}</div>
              <div className="text-3xl font-display font-bold text-text-primary">
                {stat.value}
              </div>
              <div className={`text-sm ${stat.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                {stat.change} from last week
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Verification Requests */}
      <Card variant="glass">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-purple" />
            Verification Requests
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'approved' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('approved')}
              >
                Approved
              </Button>
              <Button
                variant={filter === 'rejected' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-bg-secondary rounded-card hover:bg-bg-panel transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div>{getStatusIcon(request.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-text-primary">{request.user}</span>
                    <span className="text-xs px-2 py-1 bg-primary-cyan/20 text-primary-cyan rounded-button">
                      {request.type}
                    </span>
                  </div>
                  <div className="text-sm text-text-muted">
                    {request.documents} documents • {request.submitted}
                  </div>
                </div>
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReview(request.id, 'approve')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReview(request.id, 'reject')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              {request.status !== 'pending' && (
                <span
                  className={`text-sm font-medium ${
                    request.status === 'approved' ? 'text-success' : 'text-error'
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
