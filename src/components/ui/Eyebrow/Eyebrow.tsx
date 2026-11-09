import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './Eyebrow.module.css'

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  /** Section number, e.g. "01" — rendered as "(01)". */
  index?: string
}

/** Mono section label: "(01) Services". */
export function Eyebrow({ index, className, children, ...props }: EyebrowProps) {
  return (
    <p className={cn(styles.eyebrow, className)} {...props}>
      {index && <span className={styles.index}>({index})</span>}
      <span>{children}</span>
    </p>
  )
}
