import { useId } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { BLOB, DISC, ORBIT_DOTS, ORBIT_LAP, ORBIT_PATH, SPEED_LINES, VIEWBOX } from './geometry'
import styles from './HeroCollage.module.css'

const [discX, discY] = DISC.center
const DISC_TEXT_PATH =
  `M${discX - DISC.textRadius} ${discY}a${DISC.textRadius} ${DISC.textRadius} 0 1 1 ${DISC.textRadius * 2} 0` +
  `a${DISC.textRadius} ${DISC.textRadius} 0 1 1 ${-DISC.textRadius * 2} 0`
const DISC_TEXT_LENGTH = Math.round(2 * Math.PI * DISC.textRadius)
const SPEED_LINE_STAGGER = 0.08

const toOrigin = ([x, y]: readonly [number, number]) => `${x}px ${y}px`

/**
 * Everything behind the cut-out: the cobalt blob, the orange disc with its turning ring text, the orbit
 * and its travelling dots, and the speed marks. Shapes pop in after the image has painted, then idle
 * gently (CSS loops + SMIL orbit). Under reduced motion it renders static, at rest.
 */
export function HeroBackdrop() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const orbitId = useId()
  const discTextId = useId()

  return (
    <svg className={styles.layer} viewBox={VIEWBOX} aria-hidden="true" focusable="false">
      <defs>
        <path id={orbitId} d={ORBIT_PATH} />
        <path id={discTextId} d={DISC_TEXT_PATH} />
      </defs>

      <g className={styles.popBlob}>
        <path className={styles.blob} d={BLOB.path} style={{ transformOrigin: toOrigin(BLOB.origin) }} />
      </g>

      <g className={styles.popDisc}>
        <circle className={styles.disc} cx={discX} cy={discY} r={DISC.radius} />
        <g className={styles.discRing} style={{ transformOrigin: toOrigin(DISC.center) }}>
          <text className={styles.discText}>
            <textPath href={`#${discTextId}`} textLength={DISC_TEXT_LENGTH} lengthAdjust="spacing">
              {DISC.text}
            </textPath>
          </text>
        </g>
      </g>

      <path className={styles.orbit} d={ORBIT_PATH} pathLength={1} />

      {ORBIT_DOTS.map((dot) => {
        // With motion the dot is placed by <animateMotion>; at rest it sits at its own spot.
        const [x, y] = prefersReducedMotion ? dot.at : [0, 0]
        return (
          <circle
            key={dot.phase}
            className={dot.kind === 'ring' ? styles.dotRing : styles.dotSolid}
            cx={x}
            cy={y}
            r={dot.radius}
          >
            {!prefersReducedMotion && (
              <animateMotion dur={`${ORBIT_LAP}s`} begin={`-${dot.phase * ORBIT_LAP}s`} repeatCount="indefinite">
                <mpath href={`#${orbitId}`} />
              </animateMotion>
            )}
          </circle>
        )
      })}

      <g className={styles.speedLines}>
        {SPEED_LINES.map((d, index) => (
          <path
            key={d}
            className={styles.speedLine}
            d={d}
            pathLength={1}
            style={{ animationDelay: `${1 + index * SPEED_LINE_STAGGER}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
