import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-display font-semibold transition-all duration-200 rounded-button disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-purple text-white hover:bg-purple-600 hover:shadow-neon-purple active:scale-95',
    secondary: 'bg-primary-cyan text-white hover:bg-cyan-500 hover:shadow-neon-cyan active:scale-95',
    ghost: 'bg-transparent border border-border text-text-primary hover:bg-bg-panel hover:border-primary-purple',
    danger: 'bg-error text-white hover:bg-red-600 active:scale-95',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  
  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⟳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
