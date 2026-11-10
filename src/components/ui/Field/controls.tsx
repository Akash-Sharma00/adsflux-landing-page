import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './Field.module.css'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(styles.control, className)} {...props} />
}

export function Textarea({ className, rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cn(styles.control, styles.textarea, className)} {...props} />
}
