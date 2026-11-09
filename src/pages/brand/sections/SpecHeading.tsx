import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './SpecHeading.module.css'

type SpecHeadingProps = {
  /** Short sub-section title. Wrap a word in <em> for the serif accent. */
  title: ReactNode
  /** Mono metadata on the right: a token, a component path, a rule. */
  meta?: string
  className?: string
}

/** Hairline-ruled sub-heading that opens a block inside a brand chapter. */
export function SpecHeading({ title, meta, className }: SpecHeadingProps) {
  return (
    <div className={cn(styles.spec, className)}>
      <h3 className={styles.title}>{title}</h3>
      {meta && <span className={cn('label', styles.meta)}>{meta}</span>}
    </div>
  )
}
