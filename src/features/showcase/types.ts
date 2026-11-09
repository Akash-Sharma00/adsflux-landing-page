import type { ArtTone, ArtVariant, MediaRatio } from '@/components/ui'
import type { ResponsiveImage, VideoAsset } from '@/types/media'

export type ShowcaseCategory = 'ugc' | 'product' | 'brand' | 'social' | 'performance'

export const SHOWCASE_CATEGORIES: readonly { id: ShowcaseCategory; label: string }[] = [
  { id: 'ugc', label: 'UGC video' },
  { id: 'product', label: 'Product ads' },
  { id: 'brand', label: 'Brand campaigns' },
  { id: 'social', label: 'Social creatives' },
  { id: 'performance', label: 'Performance ads' },
]

export type ShowcaseItem = {
  id: string
  category: ShowcaseCategory
  title: string
  /** Client name or anonymised descriptor. */
  client: string
  /** Format line, e.g. "Reel · 9:16". */
  format: string
  ratio: MediaRatio
  /** Real media from @/assets/assetRegistry. Without it, the placeholder art renders. */
  image?: ResponsiveImage
  video?: VideoAsset
  /** Motion creative (reel, film, UGC). Shows the play marker on placeholders. */
  isVideo?: boolean
  /** Placeholder composition until real media exists. */
  art: ArtVariant
  artTone: ArtTone
}
