/** The Adsflux service catalogue. Single source for nav, home page, footer and service pages. */
export type Service = {
  slug: string
  title: string
  summary: string
  capabilities: readonly string[]
  /** Delivered through the Scalvo platform — the service links to it. */
  isOnScalvo?: boolean
}

export const services: readonly Service[] = [
  {
    slug: 'strategy',
    title: 'Digital marketing strategy',
    summary: 'Growth plans built on audience truth, not channel habits.',
    capabilities: ['Market & audience research', 'Channel planning', 'Go-to-market', 'Measurement frameworks'],
  },
  {
    slug: 'performance',
    title: 'Performance marketing',
    summary: 'Paid media engineered for profitable, compounding growth.',
    capabilities: ['Meta & Google Ads', 'Programmatic', 'Conversion optimisation', 'Attribution'],
  },
  {
    slug: 'ugc-influencer',
    title: 'UGC & influencer',
    summary: 'Creators who make your audience stop scrolling and start buying.',
    capabilities: ['Creator sourcing', 'UGC production', 'Campaign management', 'Whitelisting'],
    isOnScalvo: true,
  },
  {
    slug: 'creative-production',
    title: 'Creative & video production',
    summary: 'Campaign films, ad creative and content made to perform.',
    capabilities: ['Campaign films', 'Ad creative', 'Motion design', 'Photography'],
  },
  {
    slug: 'branding',
    title: 'Branding & brand strategy',
    summary: 'Identities with a point of view — and the system to scale it.',
    capabilities: ['Positioning', 'Naming', 'Visual identity', 'Brand guidelines'],
  },
  {
    slug: 'social',
    title: 'Social media management',
    summary: 'Always-on social that builds culture, not just calendars.',
    capabilities: ['Content strategy', 'Community', 'Social-first creative', 'Reporting'],
  },
  {
    slug: 'seo-content',
    title: 'SEO & content marketing',
    summary: 'Search visibility and content that earns attention for years.',
    capabilities: ['Technical SEO', 'Content strategy', 'Editorial production', 'Link earning'],
  },
  {
    slug: 'ai-creative',
    title: 'AI-powered creative',
    summary: 'Faster testing and more variations, directed by human taste.',
    capabilities: ['Creative automation', 'Variant testing', 'AI-assisted production', 'Workflow design'],
    isOnScalvo: true,
  },
] as const

export const serviceAnchorId = (slug: string) => `service-${slug}`
