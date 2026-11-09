import type { ArtTone, ArtVariant, MediaRatio } from '@/components/ui'
import type { ResponsiveImage, VideoAsset } from '@/types/media'

type CaseMedia = {
  ratio: MediaRatio
  /** Real media from @/assets/assetRegistry. Without it, the placeholder art renders. */
  image?: ResponsiveImage
  video?: VideoAsset
  /** Placeholder composition until real media exists. */
  art: ArtVariant
  artTone: ArtTone
  isVideo?: boolean
}

export type CaseStudy = {
  slug: string
  brand: string
  category: string
  year: string
  /** One-line headline for the case. */
  headline: string
  challenge: string
  delivered: readonly string[]
  /** ONLY real, client-approved numbers. Omit entirely when there is no verified data. */
  outcomes?: readonly { value: string; label: string }[]
  hero: CaseMedia
  /** Optional smaller detail frame layered over the hero (collage). */
  detail?: CaseMedia
}
