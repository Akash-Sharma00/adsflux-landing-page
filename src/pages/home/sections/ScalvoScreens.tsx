import { useEffect, useRef, useState } from 'react'
import { m, useInView, type Variants } from 'motion/react'
import { scalvoLayers, type ScalvoLayer } from '@/assets/scalvoImages'
import { Parallax } from '@/components/motion'
import { MediaFrame, Stamp } from '@/components/ui'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import { DURATION, EASE_OUT_EXPO, REVEAL_DISTANCE, STAGGER_STEP } from '@/lib/motion'
import styles from './ScalvoScreens.module.css'

type Theme = 'light' | 'dark'
type Offset = { x?: number; y?: number }

const THEMES: readonly Theme[] = ['light', 'dark']
const THEME_CYCLE_MS = 4200

type Piece = {
  name: string
  layer: ScalvoLayer
  className?: string
  sizes: string
  /** Scroll drift in px — cards float against the window for depth. */
  depth: number
  /** Where the piece slides in from. */
  from: Offset
}

const PIECES: readonly Piece[] = [
  { name: 'workspace', layer: scalvoLayers.workspace, className: styles.workspace, sizes: '(min-width: 1024px) 52vw, 90vw', depth: 0, from: { y: REVEAL_DISTANCE } },
  { name: 'approval', layer: scalvoLayers.approval, className: styles.approval, sizes: '(min-width: 1024px) 22vw, 36vw', depth: -60, from: { x: REVEAL_DISTANCE } },
  { name: 'progress', layer: scalvoLayers.progress, className: styles.progress, sizes: '(min-width: 1024px) 20vw, 34vw', depth: 40, from: { y: -REVEAL_DISTANCE } },
]

const stageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_STEP * 2 } },
}

const pieceVariants: Variants = {
  hidden: (from: Offset) => ({ opacity: 0, x: from.x ?? 0, y: from.y ?? 0 }),
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: DURATION.reveal, ease: EASE_OUT_EXPO } },
}

/**
 * Layered Scalvo UI: the workspace window with two cards pasted over it. Pieces slide in, the cards drift on
 * scroll and float, and the whole mock-up wipes between Scalvo's light and dark themes while it's on screen.
 * It opens in the site's current colour mode. Choosing a theme stops the auto-switch; under reduced motion it
 * never auto-switches.
 */
export function ScalvoScreens() {
  const stageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(stageRef, { amount: 0.4 })
  const prefersReducedMotion = usePrefersReducedMotion()
  const { theme: siteTheme } = useTheme()
  const [theme, setPreviewTheme] = useState<Theme>(siteTheme)
  const [isAutoSwitching, setIsAutoSwitching] = useState(true)

  useEffect(() => {
    if (!isAutoSwitching || !isInView || prefersReducedMotion) return
    const timer = window.setInterval(() => setPreviewTheme((current) => (current === 'light' ? 'dark' : 'light')), THEME_CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [isAutoSwitching, isInView, prefersReducedMotion])

  const handleSelect = (next: Theme) => {
    setIsAutoSwitching(false)
    setPreviewTheme(next)
  }

  return (
    <figure className={styles.figure}>
      <m.div
        ref={stageRef}
        className={styles.stage}
        data-theme-preview={theme}
        variants={stageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {PIECES.map((piece) => (
          <Parallax key={piece.name} distance={piece.depth} className={cn(styles.piece, piece.className)}>
            <m.div variants={pieceVariants} custom={piece.from}>
              {/* The workspace's alt describes the whole mock-up, so the two cards are hidden from screen readers. */}
              <div className={styles.float} aria-hidden={piece.name === 'workspace' ? undefined : true}>
                <MediaFrame image={piece.layer.light} ratio="intrinsic" sizes={piece.sizes} />
                <div className={styles.dark} aria-hidden="true">
                  <MediaFrame image={piece.layer.dark} ratio="intrinsic" sizes={piece.sizes} />
                </div>
              </div>
            </m.div>
          </Parallax>
        ))}
        <Parallax distance={-70} rotate={-60} className={styles.stamp}>
          <Stamp className={styles.stampGraphic} text="Scalvo • Brief • Review • Approve • " />
        </Parallax>
      </m.div>

      <figcaption className={styles.caption}>
        <span className="label">Illustrative example data</span>
        <div className={styles.toggle} role="group" aria-label="Preview theme">
          {THEMES.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.toggleButton}
              aria-pressed={theme === option}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </figcaption>
    </figure>
  )
}
