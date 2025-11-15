import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { DesignTokens } from '@/design-tokens'

interface StaggerRevealProps {
  children: ReactNode
  className?: string
}

/**
 * StaggerReveal Component
 * Reveals children with bottom-to-top motion, 40ms stagger, 360ms duration, ease-out-cubic
 * Only use for major page load reveals
 */
export function StaggerReveal({ children, className = '' }: StaggerRevealProps): JSX.Element {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: DesignTokens.animation.stagger / 1000, // Convert to seconds
        delayChildren: 0,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DesignTokens.animation.duration / 1000,
        ease: [0.33, 1, 0.68, 1], // ease-out-cubic
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  )
}

