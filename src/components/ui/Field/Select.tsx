import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import type { FieldControlProps } from './Field'
import fieldStyles from './Field.module.css'
import styles from './Select.module.css'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = Partial<FieldControlProps> & {
  name: string
  value: string
  options: readonly SelectOption[]
  /** Shown while nothing is chosen. */
  placeholder: string
  onValueChange: (value: string, name: string) => void
  className?: string
}

const NO_OPTION = -1
const TYPEAHEAD_RESET_MS = 500

/**
 * Brand-styled single select (WAI-ARIA select-only combobox). The native <select> popup is drawn
 * by the OS and ignores the brand tokens, so the list is ours: sharp frame, offset shadow,
 * highlight fill, and it follows the surrounding tone in both colour modes.
 */
export function Select({
  id,
  name,
  value,
  options,
  placeholder,
  onValueChange,
  className,
  required,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: SelectProps) {
  const fallbackId = useId()
  const controlId = id ?? fallbackId
  const listboxId = `${controlId}-listbox`
  const optionId = (index: number) => `${controlId}-option-${index}`

  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const typeahead = useRef({ query: '', timer: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(NO_OPTION)

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = options[selectedIndex]

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || activeIndex === NO_OPTION) return
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex])

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), [])

  const open = (index = selectedIndex === NO_OPTION ? 0 : selectedIndex) => {
    setActiveIndex(index)
    setIsOpen(true)
  }

  const choose = (index: number) => {
    const option = options[index]
    if (option) onValueChange(option.value, name)
    setIsOpen(false)
  }

  const findByTypeahead = (key: string) => {
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.query += key.toLowerCase()
    state.timer = window.setTimeout(() => {
      state.query = ''
    }, TYPEAHEAD_RESET_MS)
    return options.findIndex((option) => option.label.toLowerCase().startsWith(state.query))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    const { key } = event

    if (key.length === 1 && key !== ' ' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const match = findByTypeahead(key)
      if (match === NO_OPTION) return
      if (isOpen) setActiveIndex(match)
      else onValueChange(options[match]?.value ?? '', name)
      return
    }

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault()
        open()
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault()
        open(key === 'Home' ? 0 : last)
      }
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => Math.min(index + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (event.altKey) choose(activeIndex)
        else setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Home':
      case 'PageUp':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
      case 'PageDown':
        event.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(activeIndex)
        break
      case 'Tab':
        choose(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        break
    }
  }

  /** Options only take focus from assistive tech (focus normally stays on the combobox). */
  const handleOptionKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    choose(index)
    rootRef.current?.querySelector('button')?.focus()
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setIsOpen(false)
  }

  return (
    <div ref={rootRef} className={cn(styles.root, className)} onBlur={handleBlur}>
      <input type="hidden" name={name} value={value} />
      <button
        id={controlId}
        type="button"
        role="combobox"
        className={cn(fieldStyles.control, styles.trigger)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && activeIndex !== NO_OPTION ? optionId(activeIndex) : undefined}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-required={required}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
      >
        <span className={cn(styles.value, !selected && styles.placeholder)}>{selected?.label ?? placeholder}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </button>

      <div ref={listRef} id={listboxId} role="listbox" tabIndex={-1} className={styles.panel} data-open={isOpen}>
        {options.map((option, index) => (
          <div
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={index === selectedIndex}
            className={styles.option}
            data-active={index === activeIndex}
            tabIndex={-1}
            onPointerMove={() => setActiveIndex(index)}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
            onKeyDown={(event) => handleOptionKeyDown(event, index)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}
