import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './Container.module.css'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl'

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** sm: forms & prose. md: focused content. lg: default page width. xl: full-bleed editorial. */
  size?: ContainerSize
}

/** Centers content horizontally with a max width and responsive side gutters. */
export function Container({ size = 'lg', className, ...props }: ContainerProps) {
  return <div className={cn(styles.container, styles[size], className)} {...props} />
}
