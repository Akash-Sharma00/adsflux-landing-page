/**
 * Google Analytics 4 and the Meta (Facebook) Pixel, each switched on by a build-time env var (Vercel → Project →
 * Settings → Environment Variables, or .env.local):
 *
 *   VITE_GA_MEASUREMENT_ID   G-XXXXXXXXXX   (GA4 → Admin → Data streams → Web)
 *   VITE_META_PIXEL_ID       digits only    (Meta Events Manager → Data sources)
 *
 * Unset → nothing is added. Set → a small inline snippet goes into every page's <head> (production builds only),
 * queues the page view at once, and fetches the vendor scripts only after the page has loaded, so they never
 * compete with the first paint or the LCP on mobile. Both count client-side navigations on their own (GA4
 * enhanced measurement "page changes based on browser history"; the Pixel's history tracking), so the app needs
 * no tracking code.
 */
import { loadEnv, type Plugin } from 'vite'

const GA_ID_FORMAT = /^G-[A-Z0-9]+$/
const PIXEL_ID_FORMAT = /^\d+$/

type AnalyticsIds = { gaId: string; pixelId: string }

/** IDs are interpolated into a script, so anything but the documented format fails the build. */
function readIds(mode: string, root: string): AnalyticsIds {
  const env = loadEnv(mode, root, 'VITE_')
  const gaId = env.VITE_GA_MEASUREMENT_ID?.trim() ?? ''
  const pixelId = env.VITE_META_PIXEL_ID?.trim() ?? ''
  if (gaId && !GA_ID_FORMAT.test(gaId)) {
    throw new Error(`[adsflux-analytics] VITE_GA_MEASUREMENT_ID must look like G-XXXXXXXXXX, got "${gaId}"`)
  }
  if (pixelId && !PIXEL_ID_FORMAT.test(pixelId)) {
    throw new Error(`[adsflux-analytics] VITE_META_PIXEL_ID must be digits only, got "${pixelId}"`)
  }
  return { gaId, pixelId }
}

function renderSnippet({ gaId, pixelId }: AnalyticsIds): string {
  const lines: string[] = []
  const scripts: string[] = []
  if (gaId) {
    lines.push(
      'window.dataLayer = window.dataLayer || []',
      'function gtag() { dataLayer.push(arguments) }',
      'window.gtag = gtag',
      "gtag('js', new Date())",
      `gtag('config', '${gaId}')`,
    )
    scripts.push(`https://www.googletagmanager.com/gtag/js?id=${gaId}`)
  }
  if (pixelId) {
    // Meta's standard queue stub, minus its eager script tag (fbevents.js loads with the others below).
    lines.push(
      'var fbq = (window.fbq = window.fbq || function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments) })',
      'if (!window._fbq) window._fbq = fbq',
      "fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = fbq.queue || []",
      `fbq('init', '${pixelId}')`,
      "fbq('track', 'PageView')",
    )
    scripts.push('https://connect.facebook.net/en_US/fbevents.js')
  }
  const loader = [
    `var sources = ${JSON.stringify(scripts)}`,
    'function loadAll() { sources.forEach(function (src) { var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s) }) }',
    "if (document.readyState === 'complete') loadAll(); else window.addEventListener('load', loadAll)",
  ]
  return `<script>;(function () {\n${[...lines, ...loader].map((line) => `  ${line}`).join('\n')}\n})()</script>`
}

export function analyticsPlugin(): Plugin {
  let snippet = ''

  return {
    name: 'adsflux-analytics',
    apply: 'build',
    configResolved(config) {
      if (config.build.ssr) return
      const ids = readIds(config.mode, typeof config.envDir === 'string' ? config.envDir : config.root)
      snippet = ids.gaId || ids.pixelId ? renderSnippet(ids) : ''
    },
    transformIndexHtml(html) {
      return snippet ? html.replace('</head>', () => `    ${snippet}\n  </head>`) : html
    },
  }
}
