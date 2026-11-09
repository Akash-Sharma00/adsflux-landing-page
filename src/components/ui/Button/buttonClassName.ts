import { cn } from '@/lib/cn'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonStyleProps = {
  /** primary: tone CTA (cobalt on light tones, cream on cobalt). secondary: outlined pill. ghost: underlined text. */
  variant?: ButtonVariant
  size?: ButtonSize
  /** Adds the ↗ arrow chip that spins on hover. Use for forward-moving CTAs. */
  withArrow?: boolean
}

export function buttonClassName(
  { variant = 'primary', size = 'md' }: ButtonStyleProps,
  className?: string,
): string {
  return cn(styles.button, styles[variant], styles[size], className)
}
