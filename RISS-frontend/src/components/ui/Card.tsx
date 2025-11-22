import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'glass' | 'bordered'
  hover?: boolean
}

export function Card({
  children,
  variant = 'default',
  hover = false,
  className,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-card p-6 transition-all duration-200'
  
  const variants = {
    default: 'bg-bg-panel border border-border',
    glass: 'glass-panel',
    bordered: 'bg-bg-secondary border-2 border-primary-purple/30',
  }
  
  const hoverStyles = hover ? 'hover:border-primary-purple/50 hover:shadow-neon-purple cursor-pointer' : ''
  
  return (
    <div
      className={clsx(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  )
}

