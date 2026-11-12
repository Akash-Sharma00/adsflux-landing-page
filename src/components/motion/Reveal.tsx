import type { CSSProperties, ReactNode } from 'react'
import { m } from 'motion/react'
import { cn } from '@/lib/cn'
import { DURATION, EASE_OUT_EXPO, REVEAL_DISTANCE } from '@/lib/motion'
import styles from './Reveal.module.css'

export type RevealProps = {
  children: ReactNode
  /** inView: when scrolled into view. mount: from the first paint, before JS loads — for above-the-fold heroes. */
  trigger?: 'inView' | 'mount'
  /** Seconds. Use small values (≤ 0.3) to sequence adjacent blocks. */
  delay?: number
  className?: string
}

/** Fades + lifts content in once. The default entrance for blocks. */
export function Reveal({ children, trigger = 'inView', delay = 0, className }: RevealProps) {
  if (trigger === 'mount') {
    // Plain CSS: hero copy (often the LCP element) must not wait for the bundle and the motion engine to load.
    const timing = delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined
    return (
      <div className={cn(styles.mount, className)} style={timing}>
        {children}
      </div>
    )
  }

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
