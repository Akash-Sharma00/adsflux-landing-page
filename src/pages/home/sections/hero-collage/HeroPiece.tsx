import type { CSSProperties } from 'react'
import { heroImages } from '@/assets/assetRegistry'
import { HERO_CUTOUT_PIECES, HERO_CUTOUT_SIZE } from '@/assets/generated/heroCutoutPieces'
import { MediaFrame } from '@/components/ui'
import type { PieceMotion } from './pieces'
import styles from './HeroCollage.module.css'

const IMAGE = heroImages.servicesCollage
/** Same file, no alt: only the primary piece is announced. */
const DECORATIVE_IMAGE = { ...IMAGE, alt: '' }
const SIZES = '(min-width: 1024px) 64vw, 100vw'

const toPercent = (value: number, total: number) => `${((value / total) * 100).toFixed(2)}%`

type HeroPieceProps = {
  motion: PieceMotion
  clipId: string
  isPrimary: boolean
}

/**
 * One piece of the cut-out (the phone or a card): the full image, clipped to that piece, so each piece
 * can settle in, float and follow the pointer on its own. Every piece uses the same file, so it downloads
 * once. Three wrappers keep the three motions from overriding each other: pointer depth (translate),
 * entrance (transform, once) and idle float (transform, looping).
 */
export function HeroPiece({ motion, clipId, isPrimary }: HeroPieceProps) {
  const [x, y] = HERO_CUTOUT_PIECES[motion.piece].center
  const style = {
    '--depth': motion.depth,
    '--enter-delay': `${motion.enter}s`,
    // The primary piece is the LCP image: it moves into place but is never hidden on the way.
    '--enter-opacity': isPrimary ? 1 : 0,
    '--float': `${motion.float}s`,
    '--sway': `${motion.sway}deg`,
    '--origin': `${toPercent(x, HERO_CUTOUT_SIZE.width)} ${toPercent(y, HERO_CUTOUT_SIZE.height)}`,
  } as CSSProperties

  return (
    <div className={styles.depth} style={style} aria-hidden={isPrimary ? undefined : true}>
      <div className={styles.settle}>
        <div className={styles.float} style={{ clipPath: `url(#${clipId})` }}>
          <MediaFrame ratio="3/2" image={isPrimary ? IMAGE : DECORATIVE_IMAGE} sizes={SIZES} priority />
        </div>
      </div>
    </div>
  )
}
