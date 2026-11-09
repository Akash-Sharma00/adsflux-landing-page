type ClassValue = string | false | null | undefined

/** Joins class names, skipping falsy values: cn(styles.root, isActive && styles.active). */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
