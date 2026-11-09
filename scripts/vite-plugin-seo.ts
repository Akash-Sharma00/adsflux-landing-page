/**
 * Static SEO for the single-page app. Link-preview bots (LinkedIn, WhatsApp, X, Slack…) and the first
 * crawl pass read raw HTML without running JS, so every route gets its own HTML file with the right <head>.
 *
 *   dev + build   index.html <!-- seo:head --> → the home page's <title>, meta, canonical, OG, JSON-LD
 *   build         dist/<route>/index.html for every other routed page (home-only preloads removed)
 *                 dist/404.html (noindex) — static hosts serve it with a real 404 status for unknown URLs
 *                 dist/sitemap.xml + dist/robots.txt (sitemap only once siteConfig.url is set)
 *
 * Metadata lives in src/config/seo.ts; <PageHead> keeps <head> in sync on client-side navigation.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'
import {
  buildHeadTags,
  getAbsoluteUrl,
  pageSeo,
  siteOrigin,
  sitemapPaths,
  type HeadTag,
  type PageSeoKey,
} from '../src/config/seo.ts'

const HEAD_PLACEHOLDER = '<!-- seo:head -->'
/** Markers in index.html around tags only the home page needs (the hero image preload). */
const HOME_ONLY_BLOCK = /\s*<!-- home-only:start -->[\s\S]*?<!-- home-only:end -->/
const HEAD_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

const escapeHtml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/** `</script>` inside JSON-LD would end the script element early. */
const escapeScriptContent = (value: string) => value.replaceAll('<', '\\u003c')

function renderTag({ tag, attributes, content }: HeadTag): string {
  const attributeList = Object.entries(attributes)
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(' ')
  if (tag === 'script') return `<script ${attributeList} data-seo>${escapeScriptContent(content ?? '')}</script>`
  return `<${tag} ${attributeList} data-seo />`
}

function renderHead(pageKey: PageSeoKey): string {
  const lines = [`<title>${escapeHtml(pageSeo[pageKey].title)}</title>`, ...buildHeadTags(pageKey).map(renderTag)]
  return ['<!-- seo:start -->', ...lines, '<!-- seo:end -->'].join('\n    ')
}

function renderPageHtml(indexHtml: string, pageKey: PageSeoKey): string {
  const html = indexHtml.replace(HEAD_BLOCK, renderHead(pageKey))
  return pageKey === 'home' ? html : html.replace(HOME_ONLY_BLOCK, '')
}

function renderSitemap(): string {
  const urls = sitemapPaths.flatMap((pagePath) => {
    const url = getAbsoluteUrl(pagePath)
    return url ? [`  <url><loc>${escapeHtml(url)}</loc></url>`] : []
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

function renderRobots(): string {
  const sitemapUrl = getAbsoluteUrl('/sitemap.xml')
  return ['User-agent: *', 'Allow: /', ...(sitemapUrl ? ['', `Sitemap: ${sitemapUrl}`] : []), ''].join('\n')
}

/** Output file for a routed page: `/` → index.html, `/brand` → brand/index.html. */
const getPageFile = (pagePath: string) => path.join(pagePath.replace(/^\/+/, ''), 'index.html')

export function seoPlugin(): Plugin {
  let outDir = ''
  let isBuild = false

  return {
    name: 'adsflux-seo',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
      isBuild = config.command === 'build'
    },
    transformIndexHtml(html) {
      if (!html.includes(HEAD_PLACEHOLDER)) {
        throw new Error(`[adsflux-seo] index.html is missing the ${HEAD_PLACEHOLDER} placeholder`)
      }
      return html.replace(HEAD_PLACEHOLDER, renderHead('home'))
    },
    async closeBundle() {
      if (!isBuild) return
      const indexHtml = await readFile(path.join(outDir, 'index.html'), 'utf8')

      const routedPages = (Object.keys(pageSeo) as PageSeoKey[]).filter((key) => key !== 'home')
      const outputs = new Map<string, string>([
        ['404.html', renderPageHtml(indexHtml, 'notFound')],
        ['robots.txt', renderRobots()],
      ])
      for (const pageKey of routedPages) {
        const pagePath = pageSeo[pageKey].path
        if (pagePath !== null) outputs.set(getPageFile(pagePath), renderPageHtml(indexHtml, pageKey))
      }
      if (siteOrigin) outputs.set('sitemap.xml', renderSitemap())

      for (const [file, content] of outputs) {
        const target = path.join(outDir, file)
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, content)
      }

      if (!siteOrigin) {
        this.warn(
          'siteConfig.url is empty — canonical URLs, og:url, og:image, JSON-LD URLs and sitemap.xml were skipped. Set it in src/config/site.ts before launch.',
        )
      }
    },
  }
}
