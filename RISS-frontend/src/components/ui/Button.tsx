import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ButtonRect Component
 * Rigid geometric button (rectangular) with anti-slop aesthetic
 * No soft rounded corners
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'font-display font-bold uppercase tracking-wider transition-colors duration-200'
    
    const variants = {
      primary: 'bg-accent text-bg hover:bg-accent/90 active:bg-accent/80',
      secondary: 'bg-panel text-accent border-2 border-accent hover:bg-panel/80',
      ghost: 'bg-transparent text-accent hover:bg-glass',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

