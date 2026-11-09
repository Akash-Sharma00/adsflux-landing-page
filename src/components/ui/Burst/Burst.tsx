import type { SVGAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './Burst.module.css'

export type BurstProps = SVGAttributes<SVGSVGElement> & {
  /** shape-1 (orange on light tones), shape-2 (cobalt on light tones), or currentColor. */
  color?: 'shape-1' | 'shape-2' | 'current'
  rays?: 8 | 12
  /** Slow continuous rotation (stops under reduced motion). */
  spin?: boolean
}

const COLOR_CLASS = { 'shape-1': styles.shape1, 'shape-2': styles.shape2, current: styles.current } as const

/** The brand's signal burst as a graphic element. Decorative only — always aria-hidden. */
export function Burst({ color = 'shape-1', rays = 8, spin = false, className, ...props }: BurstProps) {
  const points = Array.from({ length: rays * 2 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / rays
    const radius = i % 2 === 0 ? 50 : 20
    return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(styles.burst, COLOR_CLASS[color], spin && styles.spin, className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <polygon points={points} />
    </svg>
  )
}
