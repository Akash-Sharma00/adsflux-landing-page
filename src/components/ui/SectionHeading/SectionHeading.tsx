import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Eyebrow } from '../Eyebrow'
import styles from './SectionHeading.module.css'

export type SectionHeadingProps = {
  title: ReactNode
  eyebrow?: string
  index?: string
  description?: ReactNode
  /** Rendered under the description (e.g. a ButtonLink). */
  actions?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  /** split: title left, description bottom-right (asymmetric, default). stacked: everything left. */
  layout?: 'split' | 'stacked'
  className?: string
}

/** Editorial section header: eyebrow, large title, short supporting copy. */
export function SectionHeading({
  title,
  eyebrow,
  index,
  description,
  actions,
  as: Heading = 'h2',
  layout = 'split',
  className,
}: SectionHeadingProps) {
  const hasAside = Boolean(description || actions)

  return (
    <header className={cn(styles.heading, styles[layout], className)}>
      {eyebrow && (
        <Eyebrow index={index} className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
      )}
      <Heading className={styles.title}>{title}</Heading>
      {hasAside && (
        <div className={styles.aside}>
          {description && <p className={styles.description}>{description}</p>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
    </header>
  )
}
