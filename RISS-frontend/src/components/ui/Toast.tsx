import { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { clsx } from 'clsx'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  type: ToastType
  title: string
  message?: string
  onClose: () => void
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: {
    container: 'bg-success/10 border-success/60 text-success',
    icon: 'text-success',
    progress: 'bg-success',
  },
  error: {
    container: 'bg-error/10 border-error/60 text-error',
    icon: 'text-error',
    progress: 'bg-error',
  },
  warning: {
    container: 'bg-warning/10 border-warning/60 text-warning',
    icon: 'text-warning',
    progress: 'bg-warning',
  },
  info: {
    container: 'bg-accent/10 border-accent/60 text-accent',
    icon: 'text-accent',
    progress: 'bg-accent',
  },
}

export function Toast({ type, title, message, onClose, action, duration = 5000 }: ToastProps) {
  const [progress, setProgress] = useState(100)
  const Icon = icons[type]
  const style = styles[type]

  useEffect(() => {
    if (duration <= 0) return

    const interval = 50 // Update every 50ms for smooth animation
    const decrement = (100 / duration) * interval

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement
        if (next <= 0) {
          clearInterval(timer)
          return 0
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [duration])

  return (
    <div
      className={clsx(
        'relative pointer-events-auto bg-bg-panel border rounded-card shadow-lg p-4 min-w-[300px] max-w-md',
        'animate-slide-in-right',
        style.container
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', style.icon)} />
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-sm">{title}</div>
          {message && (
            <div className="mt-1 text-xs opacity-90 line-clamp-2">{message}</div>
          )}
          {action && (
            <button
              onClick={() => {
                action.onClick()
                onClose()
              }}
              className="mt-2 text-xs font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-bg-secondary rounded-button transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-secondary overflow-hidden rounded-b-card">
          <div
            className={clsx('h-full transition-all ease-linear', style.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

