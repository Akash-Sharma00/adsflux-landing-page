import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import styles from './ThemeToggle.module.css'

type ThemeToggleProps = {
  className?: string
}

/**
 * Light / dark switch for the site header (visible at every breakpoint, so it also serves the mobile menu).
 * A pill control with a half-filled disc that turns over when the lights go down. Pressed = dark mode.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={cn(styles.toggle, className)}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <circle className={styles.ring} cx="10" cy="10" r="7.25" />
        <path className={styles.half} d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" />
      </svg>
      <span className="visually-hidden">Dark mode</span>
    </button>
  )
}
