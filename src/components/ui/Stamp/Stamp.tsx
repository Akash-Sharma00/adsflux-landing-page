import { useId } from 'react'
import { cn } from '@/lib/cn'
import { Burst } from '../Burst'
import styles from './Stamp.module.css'

export type StampProps = {
  /** Text set around the circle. Keep to ~40 characters; use " • " separators. */
  text: string
  className?: string
}

/**
 * Circular rotating text with a burst at the centre — an editorial "sticker". Decorative: the text
 * must repeat information available elsewhere. Rotation stops under reduced motion.
 */
export function Stamp({ text, className }: StampProps) {
  const pathId = useId()

  return (
    <div className={cn(styles.stamp, className)} aria-hidden="true">
      <svg className={styles.ring} viewBox="0 0 200 200" focusable="false">
        <defs>
          <path id={pathId} d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1 -156 0" />
        </defs>
        <text className={styles.text}>
          <textPath href={`#${pathId}`} textLength="486">
            {text}
          </textPath>
        </text>
      </svg>
      <Burst className={styles.burst} color="current" />
    </div>
  )
}
