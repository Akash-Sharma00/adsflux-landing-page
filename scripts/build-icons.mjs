/**
 * Raster brand images for search engines and social platforms, rendered from the outlined logo SVGs
 * (no font loading involved, so the output is deterministic).
 *   node scripts/build-icons.mjs        (npm run icons — rerun if the logo or the palette changes)
 *
 * Writes:
 *   public/og/adsflux-og.png                       1200 × 630 social card: cream wordmark on Electric Cobalt
 *   public/brand/adsflux-monogram-cobalt-512.png   square logo for structured data (src/config/seo.ts)
 *   public/apple-touch-icon.png                   180 × 180 home-screen icon (index.html)
 */
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const fromRoot = (...segments) => path.join(ROOT, ...segments)

/** Brand colours come from tokens.css, the only place hex values are defined. */
async function readBrandColor(name) {
  const tokens = await readFile(fromRoot('src/styles/tokens.css'), 'utf8')
  const value = tokens.match(new RegExp(`--brand-${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1]
  if (!value) throw new Error(`--brand-${name} not found in src/styles/tokens.css`)
  return value
}

const OG = { width: 1200, height: 630, wordmarkWidth: 720, frameInset: 40, frameStroke: 3 }

async function buildSocialCard() {
  const cobalt = await readBrandColor('cobalt')
  const cream = await readBrandColor('cream')
  const wordmark = await sharp(fromRoot('public/brand/adsflux-wordmark-cream.svg'), { density: 600 })
    .resize({ width: OG.wordmarkWidth })
    .png()
    .toBuffer()
  const { height: wordmarkHeight = 0 } = await sharp(wordmark).metadata()

  // Sharp editorial frame inset from the edge — the brand's square-cornered framing, no rounding or blur.
  const { frameInset: inset, frameStroke: stroke } = OG
  const frame = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">` +
      `<rect x="${inset}" y="${inset}" width="${OG.width - inset * 2}" height="${OG.height - inset * 2}" ` +
      `fill="none" stroke="${cream}" stroke-width="${stroke}"/></svg>`,
  )

  await sharp({ create: { width: OG.width, height: OG.height, channels: 3, background: cobalt } })
    .composite([
      { input: frame, top: 0, left: 0 },
      {
        input: wordmark,
        top: Math.round((OG.height - wordmarkHeight) / 2),
        left: Math.round((OG.width - OG.wordmarkWidth) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(fromRoot('public/og/adsflux-og.png'))
}

async function buildMonogram(size, outputPath) {
  await sharp(fromRoot('public/brand/adsflux-monogram-cobalt.svg'), { density: 1200 })
    .resize(size, size)
    .flatten()
    .png({ compressionLevel: 9 })
    .toFile(fromRoot(outputPath))
}

await mkdir(fromRoot('public/og'), { recursive: true })
await buildSocialCard()
await buildMonogram(512, 'public/brand/adsflux-monogram-cobalt-512.png')
await buildMonogram(180, 'public/apple-touch-icon.png')
console.log('Wrote public/og/adsflux-og.png, public/brand/adsflux-monogram-cobalt-512.png, public/apple-touch-icon.png')
