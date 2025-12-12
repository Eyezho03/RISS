import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-bg-panel rounded-button'
  
  const variants = {
    text: 'rounded-button h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-button',
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  }

  const customStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  }

  return (
    <div
      className={clsx(baseStyles, variants[variant], animations[animation], className)}
      style={customStyle}
      {...props}
    />
  )
}

// Predefined skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="space-y-4 p-6 bg-bg-panel border border-border rounded-card">
      <Skeleton variant="rectangular" height={24} width="60%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="rectangular" height={40} width="40%" />
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={64} height={64} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    </div>
  )
}

export function SkeletonAvatar() {
  return <Skeleton variant="circular" width={48} height={48} />
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonButton({ width = 120 }: { width?: number }) {
  return <Skeleton variant="rectangular" height={40} width={width} />
}

export function SkeletonScoreCard() {
  return (
    <div className="space-y-6 p-6 bg-bg-panel border border-border rounded-card">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={120} />
        <Skeleton variant="circular" width={20} height={20} />
      </div>
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width={80} />
          <Skeleton variant="rectangular" height={48} width={120} />
        </div>
        <div className="space-y-2 w-32">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="75%" />
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="rectangular" height={6} width="100%" className="mt-2" />
      </div>
    </div>
  )
}

