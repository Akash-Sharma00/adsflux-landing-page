import type { ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './PlatformLogo.module.css'

export type Platform = 'instagram' | 'linkedin' | 'youtube' | 'behance' | 'whatsapp'

export type PlatformLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  platform: Platform
}

/**
 * A third-party platform's official logo, from public/platforms/<platform>.svg (static files, so no JS cost).
 *
 * The one documented exception to the two-palette rule: trademarks appear in their owners' colours
 * (WhatsApp #25D366, LinkedIn #0A66C2, YouTube #FF0000, Behance #1769FF, Instagram's gradient), never recoloured,
 * and only next to a link to that platform. Glyph outlines: Bootstrap Icons 1.11.3 (MIT).
 * Decorative (alt=""): always pair it with a visible label or an aria-label on the link.
 */
export function PlatformLogo({ platform, className, ...props }: PlatformLogoProps) {
  return (
    <img
      src={`/platforms/${platform}.svg`}
      alt=""
      width={20}
      height={20}
      decoding="async"
      className={cn(styles.logo, className)}
      {...props}
    />
  )
}
