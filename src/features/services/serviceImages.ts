import { stockImages } from '@/assets/stockImages'
import type { ResponsiveImage } from '@/types/media'

/**
 * Preview photo per service (keyed by slug from @/config/services). These are licensed STOCK stand-ins
 * (see src/assets/stockImages.ts), not Adsflux work. Swap in real campaign media when it exists. A service
 * missing from this map falls back to its placeholder art.
 */
const SERVICE_IMAGES: Readonly<Record<string, ResponsiveImage>> = {
  'ugc-influencer-marketing': stockImages.creatorPhone,
  'creative-video-production': stockImages.cinematographer,
  'digital-marketing-strategy': stockImages.planningWhiteboard,
  'performance-marketing': stockImages.laptopTopDown,
  branding: stockImages.sketchingWireframes,
  'social-media-marketing': stockImages.filmingOnPhone,
  'seo-content-marketing': stockImages.writingNotebook,
  'ai-creative': stockImages.filmCameraPhone,
}

export const imageForService = (slug: string): ResponsiveImage | undefined => SERVICE_IMAGES[slug]
