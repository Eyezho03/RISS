import { useAppContext } from '@/context/AppContext'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { ActivityFeed } from '@/components/ActivityFeed'
import { Filter } from 'lucide-react'
import { useState } from 'react'

export default function Activity(): JSX.Element {
  const { reputation } = useAppContext()
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all')

  const filteredActivities =
    filter === 'all'
      ? reputation.activities
      : reputation.activities.filter((activity) => activity.verificationLevel === filter)

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-accent mb-2">Activity Feed</h1>
              <p className="font-body text-muted">
                All your proof of action activities and their verification status
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-muted" />
              <select
                className="bg-bg border-2 border-muted/20 p-2 font-body text-sm text-muted focus:border-accent focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
              >
                <option value="all">All Activities</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Total Activities</div>
              <div className="font-display text-2xl font-bold text-accent">
                {reputation.activities.length}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Verified</div>
              <div className="font-display text-2xl font-bold text-accent">
                {reputation.activities.filter((a) => a.verificationLevel === 'verified').length}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Pending</div>
              <div className="font-display text-2xl font-bold text-accent">
                {reputation.activities.filter((a) => a.verificationLevel === 'pending').length}
              </div>
            </div>
            <div className="bg-panel border-2 border-muted/20 p-4">
              <div className="font-body text-sm text-muted mb-1">Total Points</div>
              <div className="font-display text-2xl font-bold text-accent">
                {reputation.activities
                  .filter((a) => a.verificationLevel === 'verified')
                  .reduce((sum, a) => sum + (a.scoreImpact || 0), 0)}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <ActivityFeed activities={filteredActivities} />
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}

