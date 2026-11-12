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
 *                 dist/llms.txt — a plain-text map of the site for AI assistants (llmstxt.org), from the services catalogue
 *                 the entry stylesheet is inlined into every page's <head>, so no request blocks the first paint;
 *                 a lazy route's own CSS is inlined into its pages too (otherwise it arrives with the route's JS
 *                 chunk and the prerendered page shows unstyled until then)
 *
 * Metadata lives in src/config/seo.ts; <PageHead> keeps <head> in sync on client-side navigation.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, type Plugin } from 'vite'
import { homeAnchor, servicePath } from '../src/config/routes.ts'
import { liveServices, services } from '../src/config/services.ts'
import { siteConfig } from '../src/config/site.ts'
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
/** Vite's link to the entry stylesheet (the only CSS the first paint needs; route CSS loads with its chunk). */
const ENTRY_STYLESHEET = /<link rel="stylesheet"(?: crossorigin)? href="\/(assets\/[^"]+\.css)">/

const SSR_ENTRY = 'src/entry-server.tsx'
/** Throwaway server bundle, outside dist so it is never deployed. */
const SSR_OUT_DIR = 'node_modules/.tmp/adsflux-ssr'
/** React's marker for a Suspense boundary that was still pending (content streamed in later by script). */
const STREAMED_BOUNDARY = '<!--$?-->'
/** Any path no route claims, so the router renders the 404 page into 404.html. */
const NOT_FOUND_RENDER_PATH = '/__not-found__'

/** Source module of each React.lazy route (src/app/AppRoutes.tsx). Home is eager: its CSS is the entry CSS. */
const LAZY_ROUTE_MODULES = {
  brand: 'src/pages/brand/index.ts',
  service: 'src/pages/service/index.ts',
} as const

type RenderPage = (pagePath: string) => Promise<string>

function getLazyRouteModule(pageKey: PageSeoKey): string | null {
  if (pageKey === 'brand') return LAZY_ROUTE_MODULES.brand
  if (pageKey.startsWith('service:')) return LAZY_ROUTE_MODULES.service
  return null
}

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

function renderPageHtml(indexHtml: string, pageKey: PageSeoKey, appHtml: string, routeCss: string): string {
  let html = indexHtml.replace(HEAD_BLOCK, renderHead(pageKey))
  if (pageKey !== 'home') html = html.replace(HOME_ONLY_BLOCK, '')
  // After the entry <style>, in the same cascade order the lazy chunk's <link> would have had.
  if (routeCss) html = html.replace('</head>', () => `<style>${routeCss}</style>\n  </head>`)
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

/**
 * The entry CSS (~12 KB gzip) inline instead of linked: one less round trip before the first paint, which matters
 * most on mobile. Its only url()s are absolute (/fonts/…) or data URIs, so they resolve the same inline.
 */
async function inlineEntryStylesheet(html: string, outDir: string): Promise<{ html: string; entryCssFile: string }> {
  const entryCssFile = ENTRY_STYLESHEET.exec(html)?.[1]
  if (!entryCssFile) throw new Error('[adsflux-seo] index.html: entry stylesheet <link> not found, cannot inline it')
  const css = await readCss(outDir, [entryCssFile])
  return { html: html.replace(ENTRY_STYLESHEET, () => `<style>${css}</style>`), entryCssFile }
}

async function readCss(outDir: string, files: readonly string[]): Promise<string> {
  const sheets = await Promise.all(files.map((file) => readFile(path.join(outDir, file), 'utf8')))
  const css = sheets.join('\n')
  if (css.includes('</style')) throw new Error(`[adsflux-seo] CSS in ${files.join(', ')} contains "</style" and cannot be inlined`)
  return css
}

/** https://llmstxt.org — what Adsflux is and where its pages are, in Markdown, for LLMs and AI search. */
function renderLlmsTxt(): string {
  const link = (label: string, pagePath: string) => {
    const url = getAbsoluteUrl(pagePath)
    return url ? `[${label}](${url})` : label
  }
  const comingSoon = services.filter((service) => service.isComingSoon)
  return [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `${siteConfig.positioning} ${siteConfig.supportingMessage} Markets: ${siteConfig.markets}.`,
    '',
    '## Services',
    '',
    ...liveServices.map((service) => `- ${link(service.title, servicePath(service.slug))}: ${service.seo.description}`),
    '',
    ...(comingSoon.length > 0
      ? ['## Coming soon', '', ...comingSoon.map((service) => `- ${service.title}: ${service.summary}`), '']
      : []),
    '## Contact',
    '',
    `- ${link('Start a project', homeAnchor('contact'))}: the enquiry form on the home page.`,
    ...(siteConfig.email ? [`- Email: ${siteConfig.email}`] : []),
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
  /** Lazy route module → every CSS file its chunk and that chunk's static imports load (from the client bundle). */
  const routeCssFiles = new Map<string, string[]>()

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
    generateBundle(_options, bundle) {
      if (!isClientBuild) return
      const collectCss = (fileName: string, seen: Set<string>): string[] => {
        const chunk = bundle[fileName]
        if (!chunk || chunk.type !== 'chunk' || seen.has(fileName)) return []
        seen.add(fileName)
        return [...chunk.imports.flatMap((imported) => collectCss(imported, seen)), ...(chunk.viteMetadata?.importedCss ?? [])]
      }
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.facadeModuleId) continue
        const moduleId = path.relative(root, chunk.facadeModuleId).split(path.sep).join('/')
        if (Object.values(LAZY_ROUTE_MODULES).some((routeModule) => routeModule === moduleId)) {
          routeCssFiles.set(moduleId, [...new Set(collectCss(chunk.fileName, new Set()))])
        }
      }
    },
    async closeBundle() {
      if (!isClientBuild) return
      const builtIndexHtml = await readFile(path.join(outDir, 'index.html'), 'utf8')
      if (!builtIndexHtml.includes(ROOT_ELEMENT)) {
        throw new Error(`[adsflux-seo] index.html must contain an empty ${ROOT_ELEMENT} to prerender into`)
      }
      const { html: indexHtml, entryCssFile } = await inlineEntryStylesheet(builtIndexHtml, outDir)
      const routeCss = new Map<string, string>()
      for (const routeModule of Object.values(LAZY_ROUTE_MODULES)) {
        const files = routeCssFiles.get(routeModule)
        if (!files) throw new Error(`[adsflux-seo] no chunk found for lazy route ${routeModule} (moved? update LAZY_ROUTE_MODULES)`)
        routeCss.set(routeModule, await readCss(outDir, files.filter((file) => file !== entryCssFile)))
      }

      const renderPage = await loadPageRenderer(root, configFile, mode)
      const outputs = new Map<string, string>([
        ['robots.txt', renderRobots()],
        ['llms.txt', renderLlmsTxt()],
      ])
      for (const pageKey of pageKeys) {
        const file = getPageFile(pageKey)
        if (!file) continue
        const appHtml = await renderPage(getPageSeo(pageKey).path ?? NOT_FOUND_RENDER_PATH)
        if (appHtml.includes(STREAMED_BOUNDARY)) {
          throw new Error(`[adsflux-seo] ${file}: content is still behind a Suspense fallback, so crawlers would not see it`)
        }
        const routeModule = getLazyRouteModule(pageKey)
        outputs.set(file, renderPageHtml(indexHtml, pageKey, appHtml, routeModule ? (routeCss.get(routeModule) ?? '') : ''))
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
