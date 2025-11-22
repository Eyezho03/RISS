import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { Card } from './Card'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <Card
        variant="glass"
        className={clsx(
          'relative z-10 w-full',
          sizes[size],
          'max-h-[90vh] overflow-y-auto'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 className="text-2xl font-display font-bold text-text-primary">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-panel rounded-button transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        {children}
      </Card>
    </div>
  )
}
