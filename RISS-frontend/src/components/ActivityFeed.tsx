import type { ActivityProof } from '@/types/reputation'
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Award,
  Users,
  Code,
  FileText,
} from 'lucide-react'

interface ActivityFeedProps {
  activities: ActivityProof[]
  onActivityClick?: (activity: ActivityProof) => void
}

const activityIcons: Record<ActivityProof['type'], typeof GitBranch> = {
  github_commit: GitBranch,
  github_pr: GitBranch,
  github_issue: Code,
  krnl_task_completed: CheckCircle2,
  krnl_task_created: FileText,
  dao_vote: Users,
  dao_proposal: FileText,
  transaction: Shield,
  certification: Award,
  course_completion: Award,
  endorsement: Users,
  verification: Shield,
  bounty_completed: Award,
  audit: Shield,
  event_attendance: Users,
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 604800)}w ago`
}

const statusColors = {
  verified: 'text-accent border-accent',
  pending: 'text-muted border-muted',
  rejected: 'text-red-500 border-red-500',
}

export function ActivityFeed({ activities, onActivityClick }: ActivityFeedProps): JSX.Element {
  if (activities.length === 0) {
    return (
      <div className="bg-panel border-2 border-muted/20 p-8 text-center">
        <p className="font-body text-muted">No activities yet. Start building your reputation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type] || FileText
        const statusColor = statusColors[activity.verificationLevel]

        return (
          <div
            key={activity.id}
            className={`bg-panel border-2 ${statusColor} p-4 cursor-pointer transition-colors hover:bg-panel/80`}
            onClick={() => onActivityClick?.(activity)}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 border-2 ${statusColor} bg-bg`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display font-bold text-accent">{activity.title}</h4>
                  {activity.verificationLevel === 'verified' && activity.scoreImpact > 0 && (
                    <span className="font-display text-xs text-accent">
                      +{activity.scoreImpact} pts
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-muted mb-2">{activity.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted">
                  <span>{activity.source}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(new Date(activity.timestamp))}</span>
                  <span>•</span>
                  <span className="capitalize">{activity.verificationLevel}</span>
                </div>
              </div>
              <div className="flex items-center">
                {activity.verificationLevel === 'verified' ? (
                  <CheckCircle2 size={20} className="text-accent" />
                ) : activity.verificationLevel === 'pending' ? (
                  <Clock size={20} className="text-muted" />
                ) : (
                  <XCircle size={20} className="text-red-500" />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

