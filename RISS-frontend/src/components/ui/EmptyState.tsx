import { ReactNode } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import {
  Inbox,
  Search,
  FileQuestion,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from 'lucide-react'
import { clsx } from 'clsx'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'minimal' | 'bordered'
  className?: string
}

const defaultIcons = {
  default: Inbox,
  search: Search,
  tasks: FolderOpen,
  activity: TrendingUp,
  verified: CheckCircle2,
  error: AlertCircle,
  question: FileQuestion,
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const IconComponent = typeof icon === 'function' ? icon : null
  const CustomIcon = typeof icon !== 'function' ? icon : null

  const variants = {
    default: 'p-12',
    minimal: 'p-6',
    bordered: 'p-12 border-2 border-dashed border-border',
  }

  return (
    <Card
      variant={variant === 'bordered' ? 'bordered' : 'glass'}
      className={clsx(
        'text-center',
        variants[variant],
        variant !== 'minimal' && 'border-2 border-dashed border-border/50',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {(IconComponent || CustomIcon || icon) && (
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted mb-2">
            {IconComponent ? (
              <IconComponent className="w-8 h-8" />
            ) : CustomIcon ? (
              CustomIcon
            ) : (
              <Inbox className="w-8 h-8" />
            )}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-text-primary">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-text-muted max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {action && (
              <Button
                variant={action.variant || 'primary'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

// Predefined empty states for common use cases
export function EmptyTasks({ onCreateTask }: { onCreateTask?: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No tasks yet"
      description="Start by creating or accepting a task to build your reputation score."
      action={
        onCreateTask
          ? {
              label: 'Create Task',
              onClick: onCreateTask,
              variant: 'primary',
            }
          : undefined
      }
    />
  )
}

export function EmptyActivity() {
  return (
    <EmptyState
      icon={TrendingUp}
      title="No activity yet"
      description="Complete tasks, verify your identity, or connect your accounts to start building your reputation."
      action={{
        label: 'Start Verification',
        onClick: () => window.location.href = '/verification',
        variant: 'primary',
      }}
    />
  )
}

export function EmptySearch({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title={query ? `No results for "${query}"` : 'No results found'}
      description="Try adjusting your search terms or filters to find what you're looking for."
      variant="minimal"
    />
  )
}

export function EmptyDevelopers() {
  return (
    <EmptyState
      icon={Search}
      title="No developers found"
      description="No developers match your search criteria. Try adjusting your filters."
      variant="minimal"
    />
  )
}

// Export default icons for convenience
EmptyState.icons = defaultIcons

