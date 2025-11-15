import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: ReactNode
  className?: string
}

/**
 * Modal Component
 * Editorial modal with strong typographic hierarchy
 * Rigid geometric design
 */
export function Modal({ open, onOpenChange, title, children, className }: ModalProps): JSX.Element {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'bg-panel border-2 border-accent p-8 z-50',
            'max-w-lg w-full max-h-[90vh] overflow-y-auto',
            'focus:outline-none',
            className
          )}
          aria-label={title || 'Modal'}
        >
          {title && (
            <Dialog.Title className="font-display text-2xl font-bold text-accent mb-4">
              {title}
            </Dialog.Title>
          )}
          <Dialog.Close
            className="absolute top-4 right-4 text-muted hover:text-accent transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

