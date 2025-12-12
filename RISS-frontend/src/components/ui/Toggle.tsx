import { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Toggle({ label, className, ...props }: ToggleProps) {
  return (
    <label className={clsx('flex items-center gap-3 cursor-pointer', className)}>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 bg-bg-panel border border-border rounded-full peer peer-checked:bg-accent peer-checked:border-accent transition-colors duration-200" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-200" />
      </div>
      {label && (
        <span className="text-sm text-text-primary">{label}</span>
      )}
    </label>
  )
}
