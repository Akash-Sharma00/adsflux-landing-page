import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Marquee.module.css'

export type MarqueeProps = {
  items: readonly ReactNode[]
  /** Seconds per loop. Higher = calmer. */
  duration?: number
  className?: string
}

/**
 * Infinite horizontal ticker, CSS-only (no JS cost). Pauses on hover; under reduced motion it
 * stops and wraps. The duplicate track is aria-hidden so content is announced once.
 */
export function Marquee({ items, duration = 40, className }: MarqueeProps) {
  const track = (isDuplicate: boolean) => (
    <ul className={styles.track} aria-hidden={isDuplicate || undefined}>
      {items.map((item, index) => (
        <li key={index} className={styles.item}>
          {item}
          <span className={styles.separator} aria-hidden="true" />
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn(styles.marquee, className)} style={{ '--marquee-duration': `${duration}s` } as CSSProperties}>
      {track(false)}
      {track(true)}
    </div>
  )
}
