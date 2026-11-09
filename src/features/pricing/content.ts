import { homeAnchor } from '@/config/routes'

/**
 * SAMPLE CONTENT — tier names, prices and inclusions are placeholders for layout only.
 * Confirm real engagement models and pricing before publishing.
 */
export type PricingTier = {
  name: string
  description: string
  price: string
  period?: string
  features: readonly string[]
  cta: { label: string; href: string }
  featured?: boolean
}

export const pricingTiers: readonly PricingTier[] = [
  {
    name: 'Launch',
    description: 'For brands getting their first growth engine right.',
    price: '₹1.5L',
    period: '/ month',
    features: ['Strategy sprint', 'One paid channel', 'Monthly creative pack', 'Monthly reporting'],
    cta: { label: 'Start with Launch', href: homeAnchor('contact') },
  },
  {
    name: 'Growth',
    description: 'Full-funnel strategy, creative and performance under one roof.',
    price: '₹3.5L',
    period: '/ month',
    features: ['Everything in Launch', 'Multi-channel performance', 'UGC & creator programme', 'Weekly optimisation'],
    cta: { label: 'Start with Growth', href: homeAnchor('contact') },
    featured: true,
  },
  {
    name: 'Partner',
    description: 'An embedded team for ambitious brands scaling across markets.',
    price: 'Custom',
    features: ['Everything in Growth', 'Brand & campaign production', 'International markets', 'Dedicated pod'],
    cta: { label: 'Talk to us', href: homeAnchor('contact') },
  },
]
