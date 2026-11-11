/**
 * Generates optimized, responsive derivatives of the original assets in assets/originals/.
 *   node scripts/optimize-assets.mjs        (npm run assets)
 *
 * - Originals are never modified. Outputs go to public/assets/<group>/<name>-<width>.{avif,webp}.
 * - Never upscales: widths larger than the (cropped) source are skipped.
 * - Writes src/assets/generated/<manifest>.ts (dimensions, variants, dominant colour, alpha, bytes). Jobs go to
 *   `imageManifest` unless they name another `manifest` — used for media that only a code-split section needs,
 *   so its metadata stays out of the main bundle.
 * - Transparency is preserved (AVIF + WebP both carry alpha); `hasAlpha` lets the UI render cut-outs frameless.
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const AVIF = { quality: 52, effort: 6, chromaSubsampling: '4:2:0' }
const WEBP = { quality: 78, effort: 6 }

const scalvoJob = (id, name, widths) => ({
  id,
  source: `assets/originals/${name}.png`,
  group: 'scalvo',
  name,
  widths,
  manifest: 'scalvoImageManifest',
})

/**
 * Poster for a showcase video — first frame of the clip, written by scripts/optimize-videos.mjs (`npm run videos`).
 * Own manifest: only the code-split showcase gallery needs it (src/assets/showcaseVideos.ts).
 */
const posterJob = (id, name) => ({
  id,
  source: `assets/derived/video-posters/${name}.png`,
  group: 'video',
  name: `${name}-poster`,
  widths: [360, 720],
  manifest: 'videoPosterManifest',
})

/**
 * Licensed CC0 stock photo (assets/originals/stock/, provenance in assets/manifest.json → "stock"). Stand-in imagery
 * for the service modules and the SAMPLE case studies until real photography exists. Own manifest
 * (src/assets/stockImages.ts) so it is easy to remove in one place. Sources are 960px wide at most.
 */
const stockJob = (id, name, widths, crop) => ({
  id,
  source: `assets/originals/stock/${name}.jpg`,
  group: 'stock',
  name,
  widths,
  crop,
  manifest: 'stockImageManifest',
})

/** One entry per derivative set. `crop` is in source pixels (applied before resizing). */
const JOBS = [
  {
    id: 'heroServicesCollage',
    // Derived cut-out (cards + phone only; backdrop is animated SVG on the site). Regenerate it with
    // `python3 scripts/derive-hero-cutout.py`. Uncropped 3:2 so it shares coordinates with the SVG layers.
    source: 'assets/derived/adsflux-services-cutout.png',
    group: 'hero',
    name: 'adsflux-services-cutout',
    widths: [640, 960, 1280, 1536],
  },
  {
    id: 'biopodsPortrait',
    source: 'assets/originals/biopods-laundry-pods-campaign.png',
    group: 'campaigns',
    name: 'biopods-campaign-portrait',
    // 4:5 crop of the photograph above the baked-in ad copy (copy starts ~y=1030 and contains typos).
    crop: { left: 224, top: 0, width: 816, height: 1020 },
    widths: [480, 816],
  },
  {
    id: 'goCocoaMist',
    source: 'assets/originals/eau-so-haute-go-cocoa-mist-ad.png',
    group: 'campaigns',
    name: 'eau-so-haute-go-cocoa-ad',
    widths: [400, 720, 1080],
  },
  {
    id: 'sundressMist',
    source: 'assets/originals/eau-so-haute-sundress-mist-ad.png',
    group: 'campaigns',
    name: 'eau-so-haute-sundress-ad',
    widths: [400, 720, 1080],
  },
  {
    id: 'herbiqrootsOil',
    source: 'assets/originals/herbiqroots-hair-oil-ad.png',
    group: 'campaigns',
    name: 'herbiqroots-hair-oil-ad',
    widths: [400, 720, 1080],
  },
  {
    id: 'altrMints',
    source: 'assets/originals/altr-caffeine-mints-key-visual.png',
    group: 'campaigns',
    name: 'altr-caffeine-mints-key-visual',
    widths: [640, 1200, 1920],
  },
  posterJob('fixupMagnesiumPoster', 'fixup-magnesium-explainer'),
  posterJob('vezzoSneakersPoster', 'vezzo-sneakers-reel'),
  posterJob('champagneMistReviewPoster', 'champagne-mist-creator-review'),
  posterJob('prathaaOutfitPoster', 'prathaa-outfit-reel'),
  // Scalvo UI captured from scalvo.io (2x, transparent). Light + dark of each layer of the animated mock-up.
  scalvoJob('scalvoWorkspaceLight', 'scalvo-workspace-light', [640, 1172]),
  scalvoJob('scalvoWorkspaceDark', 'scalvo-workspace-dark', [640, 1172]),
  scalvoJob('scalvoApprovalLight', 'scalvo-approval-card-light', [260, 482]),
  scalvoJob('scalvoApprovalDark', 'scalvo-approval-card-dark', [260, 482]),
  scalvoJob('scalvoProgressLight', 'scalvo-progress-card-light', [240, 450]),
  scalvoJob('scalvoProgressDark', 'scalvo-progress-card-dark', [240, 450]),
  // Stock stand-ins — service modules (square or 4:3 frames).
  stockJob('stockCreatorPhone', 'creator-phone-sunglasses', [480, 960]),
  stockJob('stockCinematographer', 'cinematographer-on-set', [480, 960]),
  stockJob('stockPlanningWhiteboard', 'planning-whiteboard', [480, 960]),
  stockJob('stockLaptopTopDown', 'laptop-top-down', [480, 960]),
  stockJob('stockSketchingWireframes', 'sketching-app-wireframes', [480, 960]),
  stockJob('stockFilmingOnPhone', 'filming-on-phone', [480, 960], { left: 0, top: 160, width: 960, height: 960 }),
  stockJob('stockWritingNotebook', 'writing-in-notebook', [480, 960]),
  stockJob('stockFilmCameraPhone', 'film-camera-and-smartphone', [480, 960]),
  // Stock stand-ins — SAMPLE case studies.
  stockJob('stockSerumPeach', 'serum-dropper-peach', [640, 960]),
  stockJob('stockSerumPortrait', 'serum-dropper-portrait', [360, 720], { left: 120, top: 0, width: 720, height: 1280 }),
  stockJob('stockPhoneViolet', 'phone-in-hand-violet', [512], { left: 240, top: 0, width: 512, height: 640 }),
  stockJob('stockHandsPhone', 'hands-scrolling-phone', [320, 640], { left: 160, top: 0, width: 640, height: 640 }),
  stockJob('stockHeadphonesMono', 'studio-headphones-mono', [640, 960]),
]

const toHex = ({ r, g, b }) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

async function runJob(job) {
  const sourcePath = path.join(ROOT, job.source)
  const base = sharp(sourcePath)
  const meta = await base.metadata()
  const crop = job.crop ?? { left: 0, top: 0, width: meta.width, height: meta.height }
  const outDir = path.join(ROOT, 'public/assets', job.group)
  await mkdir(outDir, { recursive: true })

  // Many PNGs carry an alpha channel without using it. Only genuinely transparent images keep alpha;
  // opaque ones drop it (smaller files) and get a dominant-colour loading ground in the UI.
  const { dominant, isOpaque } = await sharp(sourcePath).extract(crop).stats()
  const hasAlpha = Boolean(meta.hasAlpha) && !isOpaque

  const widths = job.widths.filter((w) => w <= crop.width)
  const variants = { avif: [], webp: [] }
  for (const width of widths) {
    const height = Math.round((crop.height / crop.width) * width)
    const pipeline = () => {
      const resized = sharp(sourcePath).extract(crop).resize({ width, height })
      return hasAlpha ? resized : resized.removeAlpha()
    }
    for (const [format, options] of [['avif', AVIF], ['webp', WEBP]]) {
      const file = `${job.name}-${width}.${format}`
      await pipeline()[format](options).toFile(path.join(outDir, file))
      const { size } = await stat(path.join(outDir, file))
      variants[format].push({ src: `/assets/${job.group}/${file}`, width, height, bytes: size })
    }
  }

  const { size: originalBytes } = await stat(sourcePath)
  return {
    id: job.id,
    width: crop.width,
    height: crop.height,
    hasAlpha,
    dominantColor: toHex(dominant),
    originalBytes,
    variants,
  }
}

const resultsByManifest = new Map()
for (const job of JOBS) {
  const result = await runJob(job)
  const manifest = job.manifest ?? 'imageManifest'
  resultsByManifest.set(manifest, [...(resultsByManifest.get(manifest) ?? []), result])
  const largest = result.variants.avif.at(-1)
  console.log(`${job.id.padEnd(16)} ${result.width}x${result.height}  largest avif ${(largest.bytes / 1024).toFixed(0)} KB`)
}

const banner = '/* Generated by scripts/optimize-assets.mjs — do not edit by hand. Run `npm run assets`. */\n'
for (const [manifest, results] of resultsByManifest) {
  const entries = JSON.stringify(Object.fromEntries(results.map((r) => [r.id, r])), null, 2)
  await writeFile(path.join(ROOT, `src/assets/generated/${manifest}.ts`), `${banner}export const ${manifest} = ${entries} as const\n`)
  console.log(`Wrote src/assets/generated/${manifest}.ts`)
}
