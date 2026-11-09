import type { ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonContentProps = {
  children: ReactNode
  withArrow?: boolean
}

export function ButtonContent({ children, withArrow }: ButtonContentProps) {
  return (
    <>
      <span className={styles.label}>{children}</span>
      {withArrow && (
        <span className={styles.arrowWrap} aria-hidden="true">
          <svg className={styles.arrow} viewBox="0 0 16 16" focusable="false">
            <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      )}
    </>
  )
}
