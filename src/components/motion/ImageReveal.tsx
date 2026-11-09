import type { ReactNode } from 'react'
import { m, type Variants } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion'
import styles from './ImageReveal.module.css'

export type ImageRevealProps = {
  children: ReactNode
  /** Edge the image wipes in from. */
  from?: 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

const HIDDEN_CLIP = {
  bottom: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
} as const

/**
 * Editorial image reveal: the frame wipes open (clip-path) while the image settles from a slight zoom.
 * Structure matters: the in-view observer is the OUTER, unclipped element — a fully clipped element is
 * never reported as intersecting — and the clip + zoom layers follow via variants.
 * Reduced motion: renders the image directly — MotionConfig only drops transforms, so the clip-path
 * wipe is skipped explicitly here.
 */
export function ImageReveal({ children, from = 'bottom', delay = 0, className }: ImageRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const clipVariants: Variants = {
    hidden: { clipPath: HIDDEN_CLIP[from] },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: DURATION.reveal * 1.1, ease: EASE_OUT_EXPO, delay },
    },
  }
  const zoomVariants: Variants = {
    hidden: { scale: 1.18 },
    visible: { scale: 1, transition: { duration: DURATION.reveal * 1.4, ease: EASE_OUT_EXPO, delay } },
  }

  return (
    <m.div className={className} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
      <m.div className={styles.clip} variants={clipVariants}>
        <m.div className={styles.zoom} variants={zoomVariants}>
          {children}
        </m.div>
      </m.div>
    </m.div>
  )
}
