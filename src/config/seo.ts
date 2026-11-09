/**
 * Search & sharing metadata for every route — the single source for <head> tags.
 * Read twice: by scripts/vite-plugin-seo.ts at build time (prerendered HTML per route, sitemap, robots.txt —
 * what crawlers and link-preview bots see without running JS) and by <PageHead> in the browser.
 *
 * Imported from vite.config.ts (Node, `nodenext` resolution), so this module and its imports use explicit
 * `.ts` extensions and must stay free of DOM, React and `@/` alias imports.
 */
import { routes, servicePath } from './routes.ts'
import { getServiceBySlug, services, type Service } from './services.ts'
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

const TITLE_SUFFIX = ` — ${siteConfig.name}`

const staticPageSeo = {
  home: {
    title: `${siteConfig.name} — Creative & digital marketing agency in India`,
    description:
      'Adsflux is a creative and digital marketing agency in India — strategy, performance marketing, video, UGC, branding, social media, SEO and AI creative.',
    path: routes.home,
    isIndexable: true,
    socialTitle: `${siteConfig.name} — ${siteConfig.positioning}`,
    socialDescription: `${siteConfig.heroLead} ${siteConfig.heroPunch} ${siteConfig.supportingMessage}`,
  },
  brand: {
    title: `Brand system${TITLE_SUFFIX}`,
    description: 'The Adsflux “Electric Editorial” brand system: logo, colour, typography, controls, imagery and motion.',
    path: routes.brand,
    isIndexable: false,
  },
  notFound: {
    title: `Page not found${TITLE_SUFFIX}`,
    description: 'The link may be broken, or the page may have moved.',
    path: null,
    isIndexable: false,
  },
} as const satisfies Record<string, PageSeo>

type StaticPageKey = keyof typeof staticPageSeo
type ServicePageKey = `service:${string}`
export type PageSeoKey = StaticPageKey | ServicePageKey

const SERVICE_KEY_PREFIX = 'service:'

export const servicePageKey = (slug: string): ServicePageKey => `${SERVICE_KEY_PREFIX}${slug}`

const isServicePageKey = (key: PageSeoKey): key is ServicePageKey => key.startsWith(SERVICE_KEY_PREFIX)

/** The service a service-page key points at; throws for an unknown slug so a typo fails the build. */
function getServiceForKey(key: ServicePageKey): Service {
  const slug = key.slice(SERVICE_KEY_PREFIX.length)
  const service = getServiceBySlug(slug)
  if (!service) throw new Error(`seo: no service with slug "${slug}"`)
  return service
}

const buildServicePageSeo = (service: Service): PageSeo => ({
  title: `${service.seo.keyword}${TITLE_SUFFIX}`,
  description: service.seo.description,
  path: servicePath(service.slug),
  isIndexable: true,
  socialTitle: `${service.title}${TITLE_SUFFIX}`,
  socialDescription: service.summary,
})

export function getPageSeo(key: PageSeoKey): PageSeo {
  return isServicePageKey(key) ? buildServicePageSeo(getServiceForKey(key)) : staticPageSeo[key]
}

/** Every page the site has: static pages, then one per service. */
export const pageKeys: readonly PageSeoKey[] = [
  ...(Object.keys(staticPageSeo) as StaticPageKey[]),
  ...services.map((service) => servicePageKey(service.slug)),
]

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
export const sitemapPaths: readonly string[] = pageKeys.flatMap((key) => {
  const page = getPageSeo(key)
  return page.isIndexable && page.path !== null ? [page.path] : []
})

const meta = (key: 'name' | 'property', id: string, content: string): HeadTag => ({
  tag: 'meta',
  attributes: { [key]: id, content },
})

/** Every <head> tag for a page except <title>. */
export function buildHeadTags(pageKey: PageSeoKey): HeadTag[] {
  const page = getPageSeo(pageKey)
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

  const structuredData = buildStructuredData(pageKey)
  if (structuredData) {
    tags.push({
      tag: 'script',
      attributes: { type: 'application/ld+json' },
      content: JSON.stringify({ '@context': 'https://schema.org', '@graph': structuredData }),
    })
  }
  return tags
}

/* ---------- Structured data (schema.org). Only real, configured facts — nothing invented. ---------- */

type JsonLdNode = Record<string, unknown>

const homeUrl = getAbsoluteUrl(routes.home)
const organizationId = homeUrl ? `${homeUrl}#organization` : undefined

function buildStructuredData(pageKey: PageSeoKey): JsonLdNode[] | null {
  if (pageKey === 'home') return [buildOrganization(), buildWebsite()]
  if (isServicePageKey(pageKey)) return buildServicePageData(getServiceForKey(pageKey))
  return null
}

function buildOrganization(): JsonLdNode {
  const logoUrl = getAbsoluteUrl(logoImagePath)
  const sameAs = siteConfig.socials.flatMap((social) => (social.href ? [social.href] : []))
  return {
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${siteConfig.name} services`,
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: buildServiceReference(service),
      })),
    },
    ...(sameAs.length > 0 && { sameAs }),
  }
}

function buildWebsite(): JsonLdNode {
  return {
    '@type': 'WebSite',
    name: siteConfig.name,
    ...(homeUrl && { '@id': `${homeUrl}#website`, url: homeUrl }),
    ...(organizationId && { publisher: { '@id': organizationId } }),
  }
}

function buildServiceReference(service: Service): JsonLdNode {
  const serviceUrl = getAbsoluteUrl(servicePath(service.slug))
  return {
    '@type': 'Service',
    name: service.title,
    ...(serviceUrl && { url: serviceUrl }),
  }
}

/** Service (what it is, who provides it, where) + breadcrumb trail Home › Service. */
function buildServicePageData(service: Service): JsonLdNode[] {
  const serviceUrl = getAbsoluteUrl(servicePath(service.slug))
  const provider = {
    '@type': 'Organization',
    ...(organizationId && { '@id': organizationId }),
    name: siteConfig.name,
    ...(homeUrl && { url: homeUrl }),
  }
  const serviceNode: JsonLdNode = {
    ...buildServiceReference(service),
    ...(serviceUrl && { '@id': `${serviceUrl}#service` }),
    serviceType: service.title,
    description: service.seo.description,
    provider,
    areaServed: ['India', 'Worldwide'],
  }
  if (!homeUrl || !serviceUrl) return [serviceNode]

  const breadcrumb: JsonLdNode = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: service.title, item: serviceUrl },
    ],
  }
  return [serviceNode, breadcrumb]
}
