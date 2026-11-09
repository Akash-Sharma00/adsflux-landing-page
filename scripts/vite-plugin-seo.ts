/**
 * Static SEO for the React app. Crawlers and link-preview bots (LinkedIn, WhatsApp, X, Slack…) read raw HTML,
 * so every route ships as its own fully rendered HTML file.
 *
 *   dev + build   index.html <!-- seo:head --> → the home page's <title>, meta, canonical, OG, JSON-LD
 *   build         a server build of src/entry-server.tsx renders each page's markup into <div id="root">
 *                 (main.tsx then hydrates it), written with that page's <head>:
 *                   dist/index.html, dist/<route>/index.html (home-only preloads removed elsewhere),
 *                   dist/404.html (noindex) — static hosts serve it with a real 404 status for unknown URLs
 *                 dist/sitemap.xml + dist/robots.txt (sitemap only once siteConfig.url is set)
 *
 * Metadata lives in src/config/seo.ts; <PageHead> keeps <head> in sync on client-side navigation.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, type Plugin } from 'vite'
import {
  buildHeadTags,
  getAbsoluteUrl,
  getPageSeo,
  pageKeys,
  siteOrigin,
  sitemapPaths,
  type HeadTag,
  type PageSeoKey,
} from '../src/config/seo.ts'

const HEAD_PLACEHOLDER = '<!-- seo:head -->'
/** Markers in index.html around tags only the home page needs (the hero image preload). */
const HOME_ONLY_BLOCK = /\s*<!-- home-only:start -->[\s\S]*?<!-- home-only:end -->/
const HEAD_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
const ROOT_ELEMENT = '<div id="root"></div>'

const SSR_ENTRY = 'src/entry-server.tsx'
/** Throwaway server bundle, outside dist so it is never deployed. */
const SSR_OUT_DIR = 'node_modules/.tmp/adsflux-ssr'
/** React's marker for a Suspense boundary that was still pending (content streamed in later by script). */
const STREAMED_BOUNDARY = '<!--$?-->'
/** Any path no route claims, so the router renders the 404 page into 404.html. */
const NOT_FOUND_RENDER_PATH = '/__not-found__'

type RenderPage = (pagePath: string) => Promise<string>

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
  const lines = [`<title>${escapeHtml(getPageSeo(pageKey).title)}</title>`, ...buildHeadTags(pageKey).map(renderTag)]
  return ['<!-- seo:start -->', ...lines, '<!-- seo:end -->'].join('\n    ')
}

function renderPageHtml(indexHtml: string, pageKey: PageSeoKey, appHtml: string): string {
  let html = indexHtml.replace(HEAD_BLOCK, renderHead(pageKey))
  if (pageKey !== 'home') html = html.replace(HOME_ONLY_BLOCK, '')
  // A function replacement, so `$` sequences in the markup are inserted literally.
  return html.replace(ROOT_ELEMENT, () => `<div id="root">${appHtml}</div>`)
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

/** Output file for a page: `/` → index.html, `/services/x` → services/x/index.html, 404 → 404.html. */
function getPageFile(pageKey: PageSeoKey): string | null {
  if (pageKey === 'notFound') return '404.html'
  const pagePath = getPageSeo(pageKey).path
  return pagePath === null ? null : path.join(pagePath.replace(/^\/+/, ''), 'index.html')
}

/** Builds src/entry-server.tsx for Node with this same config (same CSS-module class names) and loads it. */
async function loadPageRenderer(root: string, configFile: string | undefined, mode: string): Promise<RenderPage> {
  const outDir = path.resolve(root, SSR_OUT_DIR)
  await build({
    root,
    configFile,
    mode,
    logLevel: 'warn',
    build: { ssr: SSR_ENTRY, outDir, emptyOutDir: true, copyPublicDir: false, minify: false },
  })
  const entryUrl = pathToFileURL(path.join(outDir, 'entry-server.js')).href
  const { renderPage } = (await import(entryUrl)) as { renderPage: RenderPage }
  return renderPage
}

export function seoPlugin(): Plugin {
  let root = ''
  let outDir = ''
  let configFile: string | undefined
  let mode = 'production'
  let isClientBuild = false

  return {
    name: 'adsflux-seo',
    configResolved(config) {
      root = config.root
      outDir = path.resolve(config.root, config.build.outDir)
      configFile = config.configFile
      mode = config.mode
      isClientBuild = config.command === 'build' && !config.build.ssr
    },
    transformIndexHtml(html) {
      if (!html.includes(HEAD_PLACEHOLDER)) {
        throw new Error(`[adsflux-seo] index.html is missing the ${HEAD_PLACEHOLDER} placeholder`)
      }
      return html.replace(HEAD_PLACEHOLDER, renderHead('home'))
    },
    async closeBundle() {
      if (!isClientBuild) return
      const indexHtml = await readFile(path.join(outDir, 'index.html'), 'utf8')
      if (!indexHtml.includes(ROOT_ELEMENT)) {
        throw new Error(`[adsflux-seo] index.html must contain an empty ${ROOT_ELEMENT} to prerender into`)
      }

      const renderPage = await loadPageRenderer(root, configFile, mode)
      const outputs = new Map<string, string>([['robots.txt', renderRobots()]])
      for (const pageKey of pageKeys) {
        const file = getPageFile(pageKey)
        if (!file) continue
        const appHtml = await renderPage(getPageSeo(pageKey).path ?? NOT_FOUND_RENDER_PATH)
        if (appHtml.includes(STREAMED_BOUNDARY)) {
          throw new Error(`[adsflux-seo] ${file}: content is still behind a Suspense fallback, so crawlers would not see it`)
        }
        outputs.set(file, renderPageHtml(indexHtml, pageKey, appHtml))
      }
      if (siteOrigin) outputs.set('sitemap.xml', renderSitemap())

      for (const [file, content] of outputs) {
        const target = path.join(outDir, file)
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, content)
      }
      await rm(path.resolve(root, SSR_OUT_DIR), { recursive: true, force: true })

      if (!siteOrigin) {
        this.warn(
          'siteConfig.url is empty — canonical URLs, og:url, og:image, JSON-LD URLs and sitemap.xml were skipped. Set it in src/config/site.ts before launch.',
        )
      }
    },
  }
}
