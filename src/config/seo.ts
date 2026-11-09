/**
 * Search & sharing metadata for every route — the single source for <head> tags.
 * Read twice: by scripts/vite-plugin-seo.ts at build time (static HTML per route, sitemap, robots.txt —
 * what crawlers and link-preview bots see without running JS) and by <PageHead> in the browser.
 *
 * Imported from vite.config.ts (Node, `nodenext` resolution), so this module and its imports use explicit
 * `.ts` extensions and must stay free of DOM, React and `@/` alias imports.
 */
import { routes } from './routes.ts'
import { services } from './services.ts'
import { siteConfig } from './site.ts'

export type PageSeo = {
  /** Full <title>. Keep ≤ 60 characters so it isn't truncated in results. */
  title: string
  /** Search-result snippet. Aim for 120–160 characters. */
  description: string
  /** Route path, or null for pages without a URL of their own (404). */
  path: string | null
  /** False → `noindex`, left out of the sitemap, no canonical. */
  isIndexable: boolean
  /** Social-card copy when it should differ from title/description. */
  socialTitle?: string
  socialDescription?: string
}

export const pageSeo = {
  home: {
    title: 'Adsflux — Creative & growth agency for ambitious brands',
    description:
      'Creative and growth agency for ambitious brands in India and worldwide — strategy, performance marketing, video, UGC, branding, social, SEO and AI creative.',
    path: routes.home,
    isIndexable: true,
    socialTitle: `Adsflux — ${siteConfig.positioning}`,
    socialDescription: `${siteConfig.heroLead} ${siteConfig.heroPunch} ${siteConfig.supportingMessage}`,
  },
  brand: {
    title: 'Brand system — Adsflux',
    description: 'The Adsflux “Electric Editorial” brand system: logo, colour, typography, controls, imagery and motion.',
    path: routes.brand,
    isIndexable: false,
  },
  notFound: {
    title: 'Page not found — Adsflux',
    description: 'The link may be broken, or the page may have moved.',
    path: null,
    isIndexable: false,
  },
} as const satisfies Record<string, PageSeo>

export type PageSeoKey = keyof typeof pageSeo

/** Social card, 1200 × 630 (`npm run icons`). */
const ogImage = {
  path: '/og/adsflux-og.png',
  width: 1200,
  height: 630,
  alt: 'The Adsflux wordmark in cream on Electric Cobalt.',
} as const

/** Square raster logo for structured data (search engines want a raster ≥ 112 px). */
const logoImagePath = '/brand/adsflux-monogram-cobalt-512.png'

/** A <meta>, <link> or JSON-LD <script> for <head>, as plain data so build and browser render the same tags. */
export type HeadTag = {
  tag: 'meta' | 'link' | 'script'
  attributes: Readonly<Record<string, string>>
  /** Text content (JSON-LD only). */
  content?: string
}

/** `siteConfig.url` without a trailing slash; empty until the domain is set. */
export const siteOrigin = siteConfig.url.replace(/\/+$/, '')

/** Absolute URL for a site path, or null while `siteConfig.url` is unset (relative URLs are invalid here). */
export function getAbsoluteUrl(path: string): string | null {
  return siteOrigin ? `${siteOrigin}${path}` : null
}

/** Paths listed in sitemap.xml. */
export const sitemapPaths: readonly string[] = Object.values(pageSeo).flatMap((page: PageSeo) =>
  page.isIndexable && page.path !== null ? [page.path] : [],
)

const meta = (key: 'name' | 'property', id: string, content: string): HeadTag => ({
  tag: 'meta',
  attributes: { [key]: id, content },
})

/** Every <head> tag for a page except <title>. */
export function buildHeadTags(pageKey: PageSeoKey): HeadTag[] {
  const page: PageSeo = pageSeo[pageKey]
  const socialTitle = page.socialTitle ?? page.title
  const socialDescription = page.socialDescription ?? page.description
  const pageUrl = page.isIndexable && page.path !== null ? getAbsoluteUrl(page.path) : null
  const imageUrl = getAbsoluteUrl(ogImage.path)

  const tags: HeadTag[] = [
    meta('name', 'description', page.description),
    meta('name', 'robots', page.isIndexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', siteConfig.name),
    meta('property', 'og:locale', 'en_IN'),
    meta('property', 'og:title', socialTitle),
    meta('property', 'og:description', socialDescription),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', socialTitle),
    meta('name', 'twitter:description', socialDescription),
  ]

  if (pageUrl) {
    tags.push({ tag: 'link', attributes: { rel: 'canonical', href: pageUrl } }, meta('property', 'og:url', pageUrl))
  }
  if (imageUrl) {
    tags.push(
      meta('property', 'og:image', imageUrl),
      meta('property', 'og:image:width', String(ogImage.width)),
      meta('property', 'og:image:height', String(ogImage.height)),
      meta('property', 'og:image:alt', ogImage.alt),
      meta('name', 'twitter:image', imageUrl),
      meta('name', 'twitter:image:alt', ogImage.alt),
    )
  }
  if (pageKey === 'home') {
    tags.push({
      tag: 'script',
      attributes: { type: 'application/ld+json' },
      content: JSON.stringify(buildStructuredData()),
    })
  }
  return tags
}

/** schema.org Organization + WebSite for the home page. Only real, configured facts — nothing invented. */
function buildStructuredData() {
  const homeUrl = getAbsoluteUrl(routes.home)
  const logoUrl = getAbsoluteUrl(logoImagePath)
  const organizationId = homeUrl ? `${homeUrl}#organization` : undefined
  const sameAs = siteConfig.socials.flatMap((social) => (social.href ? [social.href] : []))

  const organization = {
    '@type': 'Organization',
    ...(organizationId && { '@id': organizationId }),
    name: siteConfig.name,
    ...(homeUrl && { url: homeUrl }),
    ...(logoUrl && { logo: logoUrl }),
    slogan: siteConfig.positioning,
    description: siteConfig.description,
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    areaServed: ['India', 'Worldwide'],
    knowsAbout: services.map((service) => service.title),
    ...(sameAs.length > 0 && { sameAs }),
  }
  const website = {
    '@type': 'WebSite',
    name: siteConfig.name,
    ...(homeUrl && { '@id': `${homeUrl}#website`, url: homeUrl }),
    ...(organizationId && { publisher: { '@id': organizationId } }),
  }
  return { '@context': 'https://schema.org', '@graph': [organization, website] }
}
