import { ImageReveal } from '@/components/motion'
import { MediaFrame } from '@/components/ui'
import { cn } from '@/lib/cn'
import { SHOWCASE_CATEGORIES, type ShowcaseItem } from '../types'
import styles from './ShowcasePiece.module.css'

type ShowcasePieceProps = {
  item: ShowcaseItem
  /** Position in the full showcase list — stays stable when filtering reorders the pieces. */
  number: number
  /** `sizes` for the image (describe the rendered width per breakpoint). */
  sizes: string
  revealFrom?: 'bottom' | 'left' | 'right'
  revealDelay?: number
}

/** One creative: sharp media frame (image or reel) + mono meta, serif title, client/format line. */
export function ShowcasePiece({ item, number, sizes, revealFrom = 'bottom', revealDelay = 0 }: ShowcasePieceProps) {
  const categoryLabel = SHOWCASE_CATEGORIES.find((category) => category.id === item.category)?.label

  return (
    <figure className={cn(styles.piece, 'media-hover')}>
      <ImageReveal from={revealFrom} delay={revealDelay}>
        <MediaFrame
          ratio={item.ratio}
          image={item.image}
          sizes={sizes}
          alt={item.video?.label}
          videoSrc={item.video?.src}
          poster={item.video?.poster}
          art={item.art}
          artTone={item.artTone}
          isVideo={item.isVideo}
          placeholderLabel={item.format.split('·')[0]?.trim()}
        />
      </ImageReveal>
      <figcaption className={styles.caption}>
        <span className={styles.meta}>
          ({String(number).padStart(2, '0')}) {categoryLabel}
        </span>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.client}>
          {item.client} — {item.format}
        </span>
      </figcaption>
    </figure>
  )
}
