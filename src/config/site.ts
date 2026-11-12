/** Brand-level copy and metadata. Edit content here, not inside components. */
export const siteConfig = {
  name: 'Adsflux',
  positioning: 'We make brands impossible to ignore.',
  heroLead: 'Good marketing gets attention.',
  heroPunch: 'Great creative makes people care.',
  supportingMessage: 'We combine strategy, storytelling and performance to help ambitious brands grow.',
  description:
    'Adsflux is a creative and growth agency for ambitious brands in India and worldwide — strategy, performance, creative production, UGC, branding, social, SEO and AI-powered creative.',
  markets: 'India & worldwide',
  /** Public site URL (canonical host — the apex domain should redirect here). Drives canonical, OG and sitemap URLs. */
  url: 'https://www.adsflux.in',
  /**
   * Where the studio is based — structured data (LocalBusiness `address`). Fill in city and state when you want
   * them public; empty fields are left out. Country is ISO 3166-1 alpha-2.
   */
  address: { locality: '', region: '', country: 'IN' },
  /** Public contact email — set before launch. Rendered only when present. */
  email: '',
  /** Social profiles. Leave href empty until the profile exists — empty ones render as "soon". */
  socials: [
    { label: 'Instagram', href: '' },
    { label: 'LinkedIn', href: '' },
    { label: 'YouTube', href: '' },
    { label: 'Behance', href: '' },
  ],
} as const
