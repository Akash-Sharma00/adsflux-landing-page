import { useId } from 'react'
import { HERO_CUTOUT_SIZE } from '@/assets/generated/heroCutoutPieces'
import { buildBrush } from './brush'
import { BRUSH_STROKES, VIEWBOX } from './geometry'
import styles from './HeroCollage.module.css'

const BRUSHES = BRUSH_STROKES.map(buildBrush)
/** When each stroke starts painting, and how long it takes. */
const PAINT = [
  { animationDelay: '0.55s', animationDuration: '0.8s' },
  { animationDelay: '0.95s', animationDuration: '1.15s' },
] as const
/** The reveal line is wider than the stroke, so the rough edges are never clipped. */
const REVEAL_WIDTH_FACTOR = 2.4

const { width, height } = HERO_CUTOUT_SIZE

/**
 * The orange brush strokes, painted on after load: a widening line in a mask uncovers each textured
 * stroke along its centre line. HeroCollage layers them in front of the phone and behind the cards, as in
 * the original collage. Fully painted, without animation, under reduced motion.
 */
export function HeroBrushStrokes() {
  const baseId = useId()
  const roughId = `${baseId}rough`
  const paintMaskId = (index: number) => `${baseId}paint${index}`

  return (
    <svg className={styles.layer} viewBox={VIEWBOX} aria-hidden="true" focusable="false">
      <defs>
        {/* Rough, dry-brush edges. */}
        <filter id={roughId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {BRUSHES.map((brush, index) => (
          <mask key={brush.spine} id={paintMaskId(index)} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
            <path
              className={styles.paintReveal}
              d={brush.spine}
              pathLength={1}
              strokeWidth={brush.width * REVEAL_WIDTH_FACTOR}
              style={PAINT[index]}
            />
          </mask>
        ))}
      </defs>

      {BRUSHES.map((brush, index) => (
        <g key={brush.spine} mask={`url(#${paintMaskId(index)})`}>
          <g filter={`url(#${roughId})`}>
            <path className={styles.brush} d={brush.outline} />
            {brush.streaks.map((streak) => (
              <path
                key={streak.d}
                className={styles.streak}
                d={streak.d}
                strokeWidth={streak.width}
                strokeDasharray={streak.dash}
              />
            ))}
          </g>
        </g>
      ))}
    </svg>
  )
}
