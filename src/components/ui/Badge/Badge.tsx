import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './Badge.module.css'

export type BadgeVariant = 'outline' | 'solid' | 'highlight'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** outline: default tag. solid: filled with text color. highlight: orange sticker — use sparingly. */
  variant?: BadgeVariant
  /** Leading dot in the shape color. */
  dot?: boolean
}

/** Pill tag in mono caps — categories, formats, statuses. */
export function Badge({ variant = 'outline', dot, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)} {...props}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  )
}
