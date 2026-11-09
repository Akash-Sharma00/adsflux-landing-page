import type { SVGAttributes } from 'react'
import { cn } from '@/lib/cn'
import { WORDMARK_BURST, WORDMARK_LETTERS, WORDMARK_VIEWBOX } from './geometry'
import styles from './Logo.module.css'

export type WordmarkProps = SVGAttributes<SVGSVGElement> & {
  /** Accessible name. Pass '' when visible "Adsflux" text sits next to it. */
  title?: string
}

/**
 * The Adsflux wordmark: Instrument Serif "Ads" roman + "flux" italic, with the orange signal burst.
 * Outlined vectors (not live text), so it renders identically everywhere. Colors follow the tone via
 * --color-logo-mark / --color-logo-burst. Size with height or CSS; never stretch.
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
      <path className={styles.mark} d={WORDMARK_LETTERS} />
      <path className={styles.burst} d={WORDMARK_BURST} />
    </svg>
  )
}
