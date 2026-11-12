import type { SVGAttributes } from 'react'
import { cn } from '@/lib/cn'
import { WORDMARK_MARK, WORDMARK_SIGNAL, WORDMARK_VIEWBOX } from './geometry'
import styles from './Logo.module.css'

export type WordmarkProps = SVGAttributes<SVGSVGElement> & {
  /** Accessible name. Pass '' when visible "Adsflux" text sits next to it. */
  title?: string
}

/**
 * The Adsflux "Breakout" logo: a frame with the signal block breaking out of its corner, then "adsflux" in
 * Space Grotesk Bold. Outlined vectors (not live text), so it renders identically everywhere. Colors follow
 * the tone via --color-logo-mark / --color-logo-signal. Size with height or CSS; never stretch.
 */
export function Wordmark({ title = 'Adsflux', className, ...props }: WordmarkProps) {
  const isDecorative = title === ''

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={cn(styles.wordmark, className)}
      role={isDecorative ? undefined : 'img'}
      aria-hidden={isDecorative || undefined}
      aria-label={isDecorative ? undefined : title}
      focusable="false"
      {...props}
    >
      <path className={styles.mark} d={WORDMARK_MARK} />
      <path className={styles.signal} d={WORDMARK_SIGNAL} />
    </svg>
  )
}
