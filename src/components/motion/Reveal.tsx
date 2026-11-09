import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { DURATION, EASE_OUT_EXPO, REVEAL_DISTANCE } from '@/lib/motion'

export type RevealProps = {
  children: ReactNode
  /** Seconds. Use small values (≤ 0.3) to sequence adjacent blocks. */
  delay?: number
  className?: string
}

/** Fades + lifts content in once when it scrolls into view. The default entrance for blocks. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: REVEAL_DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </m.div>
  )
}
