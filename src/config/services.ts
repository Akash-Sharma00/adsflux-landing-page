/** The Adsflux service catalogue. Single source for nav, home page, footer, service pages and their SEO. */
export type Service = {
  /** URL segment of the service page (`/services/<slug>`) — keyword-led, so keep it stable once live. */
  slug: string
  title: string
  summary: string
  capabilities: readonly string[]
  /** Delivered through the Scalvo platform — the service links to it. */
  isOnScalvo?: boolean
  /** Search: the phrase the page targets (its <h1> lead and `<title>`) and the result snippet (120–160 chars). */
  seo: {
    keyword: string
    description: string
  }
}

export const services: readonly Service[] = [
  {
    slug: 'digital-marketing-strategy',
    title: 'Digital marketing strategy',
    summary: 'Growth plans built on audience truth, not channel habits.',
    capabilities: ['Market & audience research', 'Channel planning', 'Go-to-market', 'Measurement frameworks'],
    seo: {
      keyword: 'Digital marketing strategy agency in India',
      description:
        'Digital marketing strategy for ambitious brands in India — audience research, channel planning, go-to-market and measurement, from Adsflux.',
    },
  },
  {
    slug: 'performance-marketing',
    title: 'Performance marketing',
    summary: 'Paid media engineered for profitable, compounding growth.',
    capabilities: ['Meta & Google Ads', 'Programmatic', 'Conversion optimisation', 'Attribution'],
    seo: {
      keyword: 'Performance marketing agency in India',
      description:
        'Performance marketing agency in India — Meta and Google Ads, programmatic, conversion optimisation and attribution, run with creative that converts.',
    },
  },
  {
    slug: 'ugc-influencer-marketing',
    title: 'UGC & influencer',
    summary: 'Creators who make your audience stop scrolling and start buying.',
    capabilities: ['Creator sourcing', 'UGC production', 'Campaign management', 'Whitelisting'],
    isOnScalvo: true,
    seo: {
      keyword: 'UGC & influencer marketing agency in India',
      description:
        'UGC and influencer marketing agency in India — creator sourcing, UGC video production, campaign management and whitelisted ads, run on Scalvo.',
    },
  },
  {
    slug: 'creative-video-production',
    title: 'Creative & video production',
    summary: 'Campaign films, ad creative and content made to perform.',
    capabilities: ['Campaign films', 'Ad creative', 'Motion design', 'Photography'],
    seo: {
      keyword: 'Video production & ad creative agency in India',
      description:
        'Video production and ad creative agency in India — campaign films, social ad creative, motion design and photography, made to perform on every channel.',
    },
  },
  {
    slug: 'branding',
    title: 'Branding & brand strategy',
    summary: 'Identities with a point of view — and the system to scale it.',
    capabilities: ['Positioning', 'Naming', 'Visual identity', 'Brand guidelines'],
    seo: {
      keyword: 'Branding & brand strategy agency in India',
      description:
        'Branding agency in India — brand strategy, positioning, naming, visual identity and brand guidelines for ambitious brands that want to stand apart.',
    },
  },
  {
    slug: 'social-media-marketing',
    title: 'Social media management',
    summary: 'Always-on social that builds culture, not just calendars.',
    capabilities: ['Content strategy', 'Community', 'Social-first creative', 'Reporting'],
    seo: {
      keyword: 'Social media marketing agency in India',
      description:
        'Social media marketing agency in India — content strategy, social-first creative, community management and reporting for Instagram, YouTube and LinkedIn.',
    },
  },
  {
    slug: 'seo-content-marketing',
    title: 'SEO & content marketing',
    summary: 'Search visibility and content that earns attention for years.',
    capabilities: ['Technical SEO', 'Content strategy', 'Editorial production', 'Link earning'],
    seo: {
      keyword: 'SEO & content marketing agency in India',
      description:
        'SEO and content marketing agency in India — technical SEO, content strategy, editorial production and link earning that builds search traffic over time.',
    },
  },
  {
    slug: 'ai-creative',
    title: 'AI-powered creative',
    summary: 'Faster testing and more variations, directed by human taste.',
    capabilities: ['Creative automation', 'Variant testing', 'AI-assisted production', 'Workflow design'],
    isOnScalvo: true,
    seo: {
      keyword: 'AI-powered creative agency in India',
      description:
        'AI-powered ad creative from Adsflux, India — creative automation, variant testing and AI-assisted production, directed by people with taste. Runs on Scalvo.',
    },
  },
] as const

export const serviceAnchorId = (slug: string) => `service-${slug}`

export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find((service) => service.slug === slug)
