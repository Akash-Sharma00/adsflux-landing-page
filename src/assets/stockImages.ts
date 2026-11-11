import type { ResponsiveImage } from '@/types/media'
import { stockImageManifest } from './generated/stockImageManifest'

/**
 * LICENSED STOCK PHOTOGRAPHY — CC0 photos from StockSnap (via Openverse), added at the owner's request so the
 * service modules and the SAMPLE case studies don't read as empty. They are NOT Adsflux or client work: never
 * caption them as a project, a client or a result. Provenance (source page, creator, licence, sha1) is in
 * assets/manifest.json → "stock". Kept apart from assetRegistry.ts so they can be swapped out in one place once
 * real photography exists. Files: assets/originals/stock/ → `npm run assets` → public/assets/stock/.
 */

type ManifestEntry = (typeof stockImageManifest)[keyof typeof stockImageManifest]

const toImage = (entry: ManifestEntry, alt: string, objectPosition?: string): ResponsiveImage => ({
  id: entry.id,
  alt,
  width: entry.width,
  height: entry.height,
  dominantColor: entry.dominantColor,
  hasAlpha: entry.hasAlpha,
  avif: entry.variants.avif,
  webp: entry.variants.webp,
  objectPosition,
})

export const stockImages = {
  creatorPhone: toImage(
    stockImageManifest.stockCreatorPhone,
    'A woman in sunglasses holds up her phone to film herself on a busy street.',
    '55% 40%',
  ),
  cinematographer: toImage(
    stockImageManifest.stockCinematographer,
    'A cinematographer checks the monitor on a shoulder-rig camera while a director looks on, in a sunlit warehouse.',
    '35% 50%',
  ),
  planningWhiteboard: toImage(
    stockImageManifest.stockPlanningWhiteboard,
    'A whiteboard planned out week by week, covered in blue sticky notes.',
  ),
  laptopTopDown: toImage(
    stockImageManifest.stockLaptopTopDown,
    'Top-down view of hands typing on a laptop on a wooden desk, beside a phone and a camera.',
  ),
  sketchingWireframes: toImage(
    stockImageManifest.stockSketchingWireframes,
    'A hand sketches screen layouts on paper with a green sticky note, beside highlighters and a phone.',
    '60% 50%',
  ),
  filmingOnPhone: toImage(
    stockImageManifest.stockFilmingOnPhone,
    'Seen from behind, a woman with long blonde hair films a garden on her phone.',
  ),
  writingNotebook: toImage(
    stockImageManifest.stockWritingNotebook,
    'Someone sitting on the grass writes in a notebook resting on their knee.',
  ),
  filmCameraPhone: toImage(
    stockImageManifest.stockFilmCameraPhone,
    'A smartphone’s triple camera leans against the lens of a vintage film camera.',
  ),
  serumPeach: toImage(
    stockImageManifest.stockSerumPeach,
    'A woman holds a serum dropper to her cheek against a warm peach backdrop.',
    '60% 40%',
  ),
  serumPortrait: toImage(
    stockImageManifest.stockSerumPortrait,
    'A woman lifts a serum dropper above her head in a clean studio portrait.',
  ),
  phoneViolet: toImage(
    stockImageManifest.stockPhoneViolet,
    'A hand holds a phone showing a violet lock screen against a grey backdrop.',
  ),
  handsPhone: toImage(stockImageManifest.stockHandsPhone, 'Two hands hold a phone at a café table.'),
  headphonesMono: toImage(
    stockImageManifest.stockHeadphonesMono,
    'Black over-ear headphones resting on a wooden table, in moody black and white.',
  ),
} as const satisfies Record<string, ResponsiveImage>
