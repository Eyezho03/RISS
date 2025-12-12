import { clsx } from 'clsx'

interface ProgressProps {
  value: number
  max?: number
  variant?: 'linear' | 'radial'
  size?: 'sm' | 'md' | 'lg'
  color?: 'accent' | 'success' | 'warning' | 'error'
  label?: string
  showValue?: boolean
}

export function Progress({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  color = 'accent',
  label,
  showValue = true,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  if (variant === 'radial') {
    const radius = size === 'sm' ? 40 : size === 'md' ? 60 : 80
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={radius * 2 + 20}
          height={radius * 2 + 20}
        >
          <circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-bg-panel"
          />
          <circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={clsx(colors[color], 'transition-all duration-500')}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-display font-bold text-text-primary">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-text-primary">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-text-muted">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={clsx('w-full bg-bg-panel rounded-full overflow-hidden', sizes[size])}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

