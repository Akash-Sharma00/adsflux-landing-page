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
  /** WhatsApp chat: the floating button, footer and contact section, and `telephone` in structured data. */
  whatsapp: {
    display: '+91 97680 31600',
    /** International format, digits only (wa.me and structured data). */
    number: '919768031600',
    /** Pre-filled first message. */
    greeting: 'Hi Adsflux, I’d like to talk about a project.',
  },
  /** Public contact email — set before launch. Rendered only when present. */
  email: '',
  /**
   * Social profiles, shown with each platform's official logo. Leave href empty until the profile exists —
   * empty ones render greyed out as "soon".
   */
  socials: [
    { label: 'Instagram', platform: 'instagram', href: 'https://www.instagram.com/adsflux.in' },
    { label: 'LinkedIn', platform: 'linkedin', href: '' },
    { label: 'YouTube', platform: 'youtube', href: '' },
    { label: 'Behance', platform: 'behance', href: '' },
  ],
} as const

/** Opens a WhatsApp chat with Adsflux (app on phones, WhatsApp Web on desktop), greeting pre-filled. */
export const whatsappHref = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.greeting)}`
