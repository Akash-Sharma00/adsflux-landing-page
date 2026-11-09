import { useRef, useState, type ReactNode } from 'react'
import { Parallax } from '@/components/motion'
import type { MediaRatio } from '@/components/ui'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { loadScrollTrigger } from '@/lib/gsap'
import { SHOWCASE_CATEGORIES, type ShowcaseCategory, type ShowcaseItem } from '../types'
import { ShowcasePiece } from './ShowcasePiece'
import styles from './CampaignCollage.module.css'

type CampaignCollageProps = {
  items: readonly ShowcaseItem[]
}

/** Parallax travel per collage slot (px). Varied so the collage moves in layers, never in lockstep. */
const DRIFT = [40, -70, 90, -40, 60, -90, 50, -60, 80] as const

/** Up to this many images use the compact composition; more switch to the 9-piece rhythm. */
const COMPACT_LIMIT = 5

/** Rendered widths per slot (compact composition) — keeps srcset downloads right-sized. */
const COMPACT_SIZES = [
  '(min-width: 1024px) 38vw, 100vw',
  '(min-width: 1024px) 52vw, 100vw',
  '(min-width: 1024px) 30vw, 50vw',
  '(min-width: 1024px) 30vw, 50vw',
  '(min-width: 1024px) 30vw, 100vw',
] as const
const RHYTHM_SIZES = '(min-width: 1024px) 34vw, 50vw'

type RowShape = 'tall' | 'regular' | 'wide'

/** Row-grid span per ratio: reels take 3 of 12 columns, 4:5 stills 4, landscape pieces 6 (full width on mobile). */
function rowShape(ratio: MediaRatio | 'intrinsic'): RowShape {
  if (ratio === '9/16' || ratio === '2/3') return 'tall'
  if (ratio === '16/9' || ratio === '21/9' || ratio === '16/10' || ratio === '3/2') return 'wide'
  return 'regular'
}

const ROW_SIZES: Record<RowShape, string> = {
  tall: '(min-width: 1024px) 24vw, 50vw',
  regular: '(min-width: 1024px) 32vw, 50vw',
  wide: '(min-width: 1024px) 50vw, 100vw',
}

/**
 * Campaign portfolio in two rows of work: a reels row (every video, side by side) and the editorial stills
 * collage (irregular sizes, overlap, layered parallax). Picking a discipline brings its pieces — reels and
 * stills — to the top as a results row; everything else follows, dimmed, under "More work".
 * The chips stay pinned under the header, and choosing one scrolls back up to the results.
 */
export function CampaignCollage({ items }: CampaignCollageProps) {
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Only offer filters for disciplines that actually have work on show.
  const categories = SHOWCASE_CATEGORIES.filter((category) => items.some((item) => item.category === category.id))
  const activeLabel = categories.find((category) => category.id === activeCategory)?.label
  const numberOf = (item: ShowcaseItem) => items.indexOf(item) + 1

  const results = activeCategory ? items.filter((item) => item.category === activeCategory) : []
  const rest = activeCategory ? items.filter((item) => item.category !== activeCategory) : items
  const reels = items.filter((item) => item.video)
  const stills = items.filter((item) => !item.video)

  /** After the layout swaps (next frame): re-measure scroll effects and bring the results into view. */
  const afterLayoutChange = () => {
    // Chips are sticky, so they can be used from deep in the gallery: scroll back up to the results.
    const scrollToResults = () => {
      const root = rootRef.current
      if (root && root.getBoundingClientRect().top < 0) {
        root.scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
    }
    if (prefersReducedMotion) return scrollToResults()
    // The page height changed: re-measure parallax start/end points first — refresh() restores the scroll
    // position it recorded, so scrolling before it would be cancelled.
    void loadScrollTrigger().then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh()
      scrollToResults()
    })
  }

  const selectCategory = (category: ShowcaseCategory | null) => {
    setActiveCategory((current) => (current === category ? null : category))
    requestAnimationFrame(afterLayoutChange)
  }

  return (
    <div ref={rootRef} className={styles.collage}>
      <div className={styles.filters} role="group" aria-label="Filter by discipline">
        <button
          type="button"
          className={styles.chip}
          aria-pressed={activeCategory === null}
          onClick={() => selectCategory(null)}
        >
          All work
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={styles.chip}
            aria-pressed={activeCategory === category.id}
            onClick={() => selectCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {activeLabel ? `Showing ${results.length} ${activeLabel.toLowerCase()} first` : 'Showing all work'}
      </p>

      {activeCategory ? (
        <>
          <PieceGroup title={activeLabel} count={results.length}>
            <PieceRows items={results} numberOf={numberOf} />
          </PieceGroup>
          {rest.length > 0 && (
            <PieceGroup title="More work" count={rest.length}>
              <PieceRows items={rest} numberOf={numberOf} isMuted />
            </PieceGroup>
          )}
        </>
      ) : (
        <>
          {reels.length > 0 && (
            <PieceGroup title="Reels" count={reels.length}>
              <PieceRows items={reels} numberOf={numberOf} />
            </PieceGroup>
          )}
          {stills.length > 0 && (
            <PieceGroup title="Stills" count={stills.length}>
              <StillsCollage items={stills} numberOf={numberOf} />
            </PieceGroup>
          )}
        </>
      )}
    </div>
  )
}

type PieceGroupProps = { title: ReactNode; count: number; children: ReactNode }

function PieceGroup({ title, count, children }: PieceGroupProps) {
  return (
    <section className={styles.group}>
      <h3 className={styles.groupTitle}>
        {title} <span className={styles.groupCount}>({count})</span>
      </h3>
      {children}
    </section>
  )
}

type PiecesProps = { items: readonly ShowcaseItem[]; numberOf: (item: ShowcaseItem) => number }

/** Tidy rows: pieces sized by ratio, top-aligned. Used for the reels row and for filter results. */
function PieceRows({ items, numberOf, isMuted = false }: PiecesProps & { isMuted?: boolean }) {
  return (
    <ul className={styles.rows}>
      {items.map((item, index) => {
        const shape = rowShape(item.ratio)
        return (
          <li key={item.id} className={cn(styles.slot, styles[shape], isMuted && styles.muted)}>
            <ShowcasePiece
              item={item}
              number={numberOf(item)}
              sizes={ROW_SIZES[shape]}
              revealDelay={(index % 4) * 0.06}
            />
          </li>
        )
      })}
    </ul>
  )
}

/** The editorial collage: irregular spans, staggered offsets, layered parallax. */
function StillsCollage({ items, numberOf }: PiecesProps) {
  const isCompact = items.length <= COMPACT_LIMIT

  return (
    <ul className={cn(styles.grid, isCompact ? styles.compact : styles.rhythm)}>
      {items.map((item, index) => (
        <li key={item.id} className={styles.slot}>
          <Parallax distance={DRIFT[index % DRIFT.length]}>
            <ShowcasePiece
              item={item}
              number={numberOf(item)}
              sizes={isCompact ? (COMPACT_SIZES[index] ?? RHYTHM_SIZES) : RHYTHM_SIZES}
              revealFrom={index % 3 === 1 ? 'left' : 'bottom'}
              revealDelay={(index % 3) * 0.08}
            />
          </Parallax>
        </li>
      ))}
    </ul>
  )
}
