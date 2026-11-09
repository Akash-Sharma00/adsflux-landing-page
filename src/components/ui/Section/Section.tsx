import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './Section.module.css'

export type SectionTone = 'cream' | 'blue' | 'peach' | 'cobalt' | 'orange' | 'ink'
export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg'

export type SectionProps = HTMLAttributes<HTMLElement> & {
  /**
   * Re-themes everything inside via data-theme. Omit to inherit (cream).
   * Page balance: mostly cream; cobalt for big moments; blue/peach supporting; orange & ink rare.
   */
  tone?: SectionTone
  spacing?: SectionSpacing
  /** Paper fibre texture. */
  texture?: boolean
  /** Hairline rule on top — separates two sections of the same tone. */
  divider?: boolean
}

/** Vertical rhythm + tone wrapper for page sections. Pair with <Container> for width. */
export function Section({
  tone,
  spacing = 'md',
  texture = false,
  divider = false,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      data-theme={tone}
      className={cn(styles.section, styles[spacing], texture && 'paper', divider && styles.divider, className)}
      {...props}
    />
  )
}
