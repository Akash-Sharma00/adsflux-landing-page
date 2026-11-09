import { cn } from '@/lib/cn'
import styles from './PlaceholderArt.module.css'

export type ArtVariant = 'sun' | 'arch' | 'stripes' | 'halftone' | 'burst' | 'stack'
export type ArtTone = 'cream' | 'blue' | 'peach' | 'cobalt' | 'orange' | 'ink'

type PlaceholderArtProps = {
  variant: ArtVariant
  tone: ArtTone
  /** Large serif italic label, e.g. the creative format ("UGC reel"). */
  label?: string
  /** Small mono line top-left, e.g. "Placeholder — campaign still". */
  meta?: string
  isVideo?: boolean
  className?: string
}

const BURST_POINTS = Array.from({ length: 24 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * Math.PI) / 12
  const radius = i % 2 === 0 ? 100 : 46
  return `${(250 + radius * Math.cos(angle)).toFixed(1)},${(300 + radius * Math.sin(angle)).toFixed(1)}`
}).join(' ')

/**
 * Art-directed stand-in for campaign photography: a poster-like geometric composition in brand
 * tones. Deliberately NOT stock imagery. Replace by passing real media to <MediaFrame>.
 */
export function PlaceholderArt({ variant, tone, label, meta, isVideo, className }: PlaceholderArtProps) {
  return (
    <div className={cn(styles.art, className)} data-theme={tone} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" focusable="false">
        {variant === 'sun' && (
          <>
            <circle className={styles.shape1} cx="270" cy="170" r="110" />
            <rect className={styles.shape2} x="0" y="330" width="400" height="34" />
            <rect className={styles.shape2} x="0" y="390" width="400" height="10" />
          </>
        )}
        {variant === 'arch' && (
          <>
            <path className={styles.shape2} d="M190 500V250a90 90 0 0 1 180 0v250Z" />
            <circle className={styles.shape1} cx="110" cy="130" r="44" />
          </>
        )}
        {variant === 'stripes' && (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} className={styles.shape2} x={-200 + i * 110} y="-50" width="44" height="700" transform="rotate(-24 200 250)" />
            ))}
            <circle className={styles.shape1} cx="140" cy="300" r="78" />
          </>
        )}
        {variant === 'halftone' && (
          <>
            {Array.from({ length: 11 * 13 }, (_, i) => {
              const col = i % 11
              const row = Math.floor(i / 11)
              const r = Math.max(0.6, (row / 13) * 13)
              return <circle key={i} className={styles.shape2} cx={20 + col * 36} cy={20 + row * 38} r={r} />
            })}
            <circle className={styles.shape1} cx="290" cy="130" r="64" />
          </>
        )}
        {variant === 'burst' && (
          <>
            <rect className={styles.shape2} x="40" y="60" width="320" height="130" />
            <polygon className={styles.shape1} points={BURST_POINTS} />
          </>
        )}
        {variant === 'stack' && (
          <>
            <rect className={styles.shape2} x="70" y="90" width="220" height="280" />
            <rect className={styles.shape1} x="140" y="170" width="200" height="250" />
            <rect className={styles.outline} x="30" y="40" width="200" height="250" />
          </>
        )}
      </svg>
      {isVideo && <span className={styles.play} />}
      {meta && <span className={styles.meta}>{meta}</span>}
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}
