import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/cn'
import styles from './DemoCell.module.css'

type DemoCellProps = {
  title: string
  meta: string
  /** Offer a Replay button that remounts the demo (entrances only play once per mount). */
  isReplayable?: boolean
  className?: string
  children: ReactNode
}

/** A framed motion demo with a caption and an optional replay. */
export function DemoCell({ title, meta, isReplayable = false, className, children }: DemoCellProps) {
  const [replayCount, setReplayCount] = useState(0)

  return (
    <figure className={cn(styles.cell, className)}>
      <figcaption className={styles.caption}>
        <span className={styles.title}>{title}</span>
        <span className="label">{meta}</span>
      </figcaption>
      <div key={replayCount} className={styles.stage}>
        {children}
      </div>
      {isReplayable && (
        <Button size="sm" variant="secondary" className={styles.replay} onClick={() => setReplayCount((count) => count + 1)}>
          Replay
        </Button>
      )}
    </figure>
  )
}
