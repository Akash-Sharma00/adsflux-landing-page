import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Field.module.css'

/** Props a form control needs to be wired to its label, hint and error. */
export type FieldControlProps = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  required?: boolean
}

export type FieldProps = {
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  /** Render the control, spreading the given props onto it: {(p) => <Input {...p} />} */
  children: (controlProps: FieldControlProps) => ReactNode
}

/** Label + control + hint/error, with all ARIA relationships handled. */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        required,
      })}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
