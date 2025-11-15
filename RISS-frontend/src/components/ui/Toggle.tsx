import * as TogglePrimitive from '@radix-ui/react-toggle'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> {
  variant?: 'default' | 'accent'
}

/**
 * Toggle Component
 * Minimal mechanical toggle for dark/light mode
 */
export const Toggle = forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        'px-4 py-2 bg-panel border-2 border-muted/20 text-muted',
        'font-display font-bold uppercase text-xs tracking-wider',
        'hover:bg-glass hover:text-accent transition-colors',
        'data-[state=on]:bg-accent data-[state=on]:text-bg data-[state=on]:border-accent',
        variant === 'accent' && 'border-accent text-accent',
        className
      )}
      {...props}
    />
  )
})

Toggle.displayName = 'Toggle'

