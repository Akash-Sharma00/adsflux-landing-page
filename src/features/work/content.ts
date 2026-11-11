import { stockImages } from '@/assets/stockImages'
import type { CaseStudy } from './types'

/**
 * SAMPLE CONTENT — illustrative only. Replace with real, approved case studies before launch.
 * `outcomes` is intentionally absent: add it only with verified, client-approved numbers.
 * Media is licensed STOCK (src/assets/stockImages.ts), not footage from these projects.
 */
export const IS_SAMPLE_WORK = true

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'skincare-launch',
    brand: 'D2C skincare brand',
    category: 'Brand launch',
    year: '2026',
    headline: 'A first drop people queued for.',
    challenge: 'A new brand in a crowded category, with no audience and a fixed launch date.',
    delivered: ['Brand identity', 'Launch film', 'Creator programme', 'Paid social'],
    hero: { ratio: '16/10', image: stockImages.serumPeach, art: 'sun', artTone: 'peach' },
    detail: { ratio: '9/16', image: stockImages.serumPortrait, art: 'arch', artTone: 'cobalt' },
  },
  {
    slug: 'fintech-growth',
    brand: 'Fintech app',
    category: 'Performance & UGC',
    year: '2026',
    headline: 'Making a money app feel human.',
    challenge: 'Rising acquisition costs and ads that all looked like every other finance app.',
    delivered: ['Creative strategy', 'UGC system', 'Always-on testing', 'Landing pages'],
    hero: { ratio: '4/5', image: stockImages.phoneViolet, art: 'halftone', artTone: 'cream' },
    detail: { ratio: '1/1', image: stockImages.handsPhone, art: 'burst', artTone: 'orange' },
  },
  {
    slug: 'electronics-markets',
    brand: 'Consumer electronics',
    category: 'International go-to-market',
    year: '2025',
    headline: 'From one market to three.',
    challenge: 'A strong Indian brand entering new markets where nobody knew its name.',
    delivered: ['Market research', 'Localised campaigns', 'SEO & content', 'Media planning'],
    hero: { ratio: '3/2', image: stockImages.headphonesMono, art: 'stripes', artTone: 'cobalt' },
  },
]
