import { Button, MediaFrame, Wordmark } from '@/components/ui'
import { cn } from '@/lib/cn'
import { DemoCell } from './DemoCell'
import styles from './HoverDemos.module.css'

/** Signature hover states, live: arrow chip spin, wordmark burst turn, collage lift + media zoom. */
export function HoverDemos() {
  return (
    <div className={styles.grid}>
      <DemoCell title="Arrow spin" meta="Button withArrow · 600ms expo">
        <div className={styles.center}>
          <Button size="lg" withArrow>
            Hover me
          </Button>
        </div>
      </DemoCell>

      <DemoCell title="Burst turn" meta="Wordmark inside a link · 45°">
        <div className={styles.center}>
          <a href="#motion" className={styles.logoLink} aria-label="Adsflux — hover to turn the burst">
            <Wordmark className={styles.wordmark} title="" />
          </a>
        </div>
      </DemoCell>

      <DemoCell title="Collage lift" meta="Offset print shadow + media zoom">
        <figure className={cn(styles.lift, 'media-hover')}>
          <MediaFrame ratio="4/3" art="burst" artTone="blue" className={styles.liftFrame} />
          <figcaption className="label">Hover the piece</figcaption>
        </figure>
      </DemoCell>
    </div>
  )
}
