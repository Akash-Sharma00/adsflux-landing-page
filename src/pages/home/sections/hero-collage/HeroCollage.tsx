import { lazy, Suspense, useId, useRef, type CSSProperties } from 'react'
import { HERO_CUTOUT_PIECES, HERO_CUTOUT_SIZE } from '@/assets/generated/heroCutoutPieces'
import { Parallax } from '@/components/motion'
import { HeroPiece } from './HeroPiece'
import {
  BACKDROP_DEPTH,
  PIECES_BEHIND_STROKES,
  PIECES_OVER_STROKES,
  PRIMARY_PIECE,
  STROKES_DEPTH,
  type PieceMotion,
} from './pieces'
import styles from './HeroCollage.module.css'

// Decorative SVG layers and the pointer effect are code-split: they start after the image paints anyway,
// and keeping them out of the initial bundle protects the JS budget. Layers are absolutely positioned,
// so loading them causes no shift.
const HeroBackdrop = lazy(() => import('./HeroBackdrop').then((module) => ({ default: module.HeroBackdrop })))
const HeroBrushStrokes = lazy(() =>
  import('./HeroBrushStrokes').then((module) => ({ default: module.HeroBrushStrokes })),
)
const HeroPointerDepth = lazy(() =>
  import('./HeroPointerDepth').then((module) => ({ default: module.HeroPointerDepth })),
)

const PIECE_NAMES = Object.keys(HERO_CUTOUT_PIECES) as (keyof typeof HERO_CUTOUT_PIECES)[]
/** Maps the source-pixel outlines into the 0–1 box clip-path expects. */
const TO_UNIT_BOX = `scale(${1 / HERO_CUTOUT_SIZE.width} ${1 / HERO_CUTOUT_SIZE.height})`

const depthStyle = (depth: number) => ({ '--depth': depth }) as CSSProperties

/**
 * The hero visual, in aligned layers sharing one 3:2 coordinate space (the cut-out's pixels):
 *   backdrop (blob, disc, orbit, dots) → Brand Strategy → phone → brush strokes → the other five cards.
 * Every piece settles in, floats on its own rhythm and shifts with the pointer by its depth; on scroll the
 * backdrop drifts further than the pieces. The phone is the LCP image and is visible from the first paint.
 */
export function HeroCollage() {
  const stageRef = useRef<HTMLDivElement>(null)
  const clipBaseId = useId()
  const clipId = (piece: string) => `${clipBaseId}${piece}`

  const renderPiece = (motion: PieceMotion) => (
    <HeroPiece
      key={motion.piece}
      motion={motion}
      clipId={clipId(motion.piece)}
      isPrimary={motion.piece === PRIMARY_PIECE}
    />
  )

  return (
    <div ref={stageRef} className={styles.stage}>
      <Suspense fallback={null}>
        <HeroPointerDepth target={stageRef} />
      </Suspense>
      <svg className={styles.clipDefs} aria-hidden="true" focusable="false">
        <defs>
          {PIECE_NAMES.map((piece) => (
            <clipPath key={piece} id={clipId(piece)} clipPathUnits="objectBoundingBox">
              <path d={HERO_CUTOUT_PIECES[piece].outline} transform={TO_UNIT_BOX} />
            </clipPath>
          ))}
        </defs>
      </svg>

      <Parallax distance={90} className={styles.plane}>
        <div className={styles.depth} style={depthStyle(BACKDROP_DEPTH)}>
          <Suspense fallback={null}>
            <HeroBackdrop />
          </Suspense>
        </div>
      </Parallax>

      <Parallax distance={40} className={styles.plane}>
        {PIECES_BEHIND_STROKES.map(renderPiece)}
        <div className={styles.depth} style={depthStyle(STROKES_DEPTH)}>
          <Suspense fallback={null}>
            <HeroBrushStrokes />
          </Suspense>
        </div>
        {PIECES_OVER_STROKES.map(renderPiece)}
      </Parallax>
    </div>
  )
}
