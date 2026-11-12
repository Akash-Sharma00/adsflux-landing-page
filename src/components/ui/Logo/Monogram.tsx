import type { SVGAttributes } from 'react'
import { cn } from '@/lib/cn'
import { MONOGRAM_FRAME, MONOGRAM_SIGNAL } from './geometry'
import styles from './Logo.module.css'

export type MonogramVariant = 'cobalt' | 'cream' | 'orange'

export type MonogramProps = SVGAttributes<SVGSVGElement> & {
  /** cobalt: default (favicon, avatars). cream: on photography. orange: stickers & merch only. */
  variant?: MonogramVariant
  title?: string
}

/** The Breakout mark on a square tile. Carries its own background, so it works on any surface. */
export function Monogram({ variant = 'cobalt', title = 'Adsflux', className, ...props }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn(styles.monogram, styles[variant], className)}
      role="img"
      aria-label={title}
      focusable="false"
      {...props}
    >
      <rect className={styles.tile} width="64" height="64" />
      <path className={styles.frame} d={MONOGRAM_FRAME} />
      <path className={styles.monogramSignal} d={MONOGRAM_SIGNAL} />
    </svg>
  )
}
