import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { cn } from '@/lib/cn'
import { AppLink } from '../AppLink'
import styles from './Dropdown.module.css'

export type DropdownItem = {
  label: string
  /** Omit for an entry that isn't available yet: it renders as plain text, not a link. */
  href?: string
  description?: string
  /** Short status beside the label, e.g. "Soon". */
  tag?: string
}

export type DropdownProps = {
  label: string
  items: readonly DropdownItem[]
  align?: 'start' | 'end'
  /** Two-column panel for long lists (e.g. services). */
  columns?: 1 | 2
  className?: string
}

/**
 * Navigation disclosure (button + panel of links). Follows the WAI-ARIA disclosure pattern,
 * which is the recommended pattern for site navigation (not role="menu").
 * Closes on Escape (returning focus), outside click, focus leaving, and link selection.
 */
export function Dropdown({ label, items, align = 'start', columns = 1, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setIsOpen(false)
  }

  return (
    <div ref={rootRef} className={cn(styles.root, className)} onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {label}
        <span className={styles.chevron} aria-hidden="true" />
      </button>

      <div
        id={panelId}
        className={cn(styles.panel, styles[align], columns === 2 && styles.twoColumns)}
        data-open={isOpen}
      >
        <ul className={styles.list}>
          {items.map((item) => {
            const content = (
              <>
                <span className={styles.linkLabel}>
                  {item.label}
                  {item.tag && <span className={styles.tag}>{item.tag}</span>}
                </span>
                {item.description && <span className={styles.linkDescription}>{item.description}</span>}
              </>
            )
            return (
              <li key={item.label}>
                {item.href === undefined ? (
                  <span className={cn(styles.link, styles.static)}>{content}</span>
                ) : (
                  <AppLink href={item.href} className={styles.link} onClick={() => setIsOpen(false)}>
                    {content}
                  </AppLink>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
