import type { ArtTone, ArtVariant } from '@/components/ui'
import type { ResponsiveImage } from '@/types/media'

/**
 * SAMPLE CONTENT — illustrative only. Replace with real, attributable client quotes (with written
 * permission) before launch. Never invent quotes or attribute them to real people.
 */
export const IS_SAMPLE_TESTIMONIALS = true

export type Testimonial = {
  quote: string
  /** Optional emphasised phrase inside the quote — rendered in serif italic. Must appear verbatim. */
  emphasis?: string
  role: string
  company: string
  /** Real client portrait (with permission) from @/assets/assetRegistry. Placeholder art until provided. */
  portrait?: ResponsiveImage
  art: ArtVariant
  artTone: ArtTone
}

export const testimonials: readonly Testimonial[] = [
  {
    quote: 'Adsflux didn’t just run our ads. They rebuilt how our brand shows up — and the numbers followed.',
    emphasis: 'rebuilt how our brand shows up',
    role: 'Founder',
    company: 'D2C skincare brand',
    art: 'arch',
    artTone: 'peach',
  },
  {
    quote: 'One team for strategy, creative and media. Fewer meetings, sharper work, faster growth.',
    emphasis: 'sharper work',
    role: 'Head of Marketing',
    company: 'Fintech app',
    art: 'halftone',
    artTone: 'blue',
  },
  {
    quote: 'The first agency that pushed back on our brief — and they were right.',
    emphasis: 'pushed back',
    role: 'CMO',
    company: 'Lifestyle retailer',
    art: 'sun',
    artTone: 'cobalt',
  },
]
