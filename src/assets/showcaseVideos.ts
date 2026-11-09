import type { ResponsiveImage, VideoAsset } from '@/types/media'
import type { AssetMeta } from './assetRegistry'
import { videoManifest } from './generated/videoManifest'
import { videoPosterManifest } from './generated/videoPosterManifest'

/**
 * Showcase reels: 12 s muted 9:16 loops (720×1280 H.264, ≤ 4 MB) cut from the originals in /assets/originals/video
 * by `npm run videos` (scripts/optimize-videos.mjs); posters (each clip's first frame) via `npm run assets`.
 *
 * Kept apart from assetRegistry.ts (with their own generated manifests) because only the code-split showcase
 * gallery uses them, so this metadata stays out of the main bundle. Same rules as the registry: client
 * relationships are UNCONFIRMED — neutral category captions only, never client names or results.
 */

type VideoEntry = (typeof videoManifest)[keyof typeof videoManifest]
type PosterEntry = (typeof videoPosterManifest)[keyof typeof videoPosterManifest]

export type RegisteredVideo = VideoAsset & Omit<AssetMeta, 'alt' | 'objectPosition'>

/** `alt` becomes the video's `label` (what happens in the clip, for screen readers) and the poster's alt. */
function registerVideo(entry: VideoEntry, posterEntry: PosterEntry, { alt, ...meta }: Omit<AssetMeta, 'objectPosition'>): RegisteredVideo {
  const poster: ResponsiveImage = {
    id: posterEntry.id,
    alt,
    width: posterEntry.width,
    height: posterEntry.height,
    dominantColor: posterEntry.dominantColor,
    hasAlpha: posterEntry.hasAlpha,
    avif: posterEntry.variants.avif,
    webp: posterEntry.variants.webp,
  }
  return {
    id: entry.id,
    label: alt,
    src: entry.src,
    type: entry.type,
    width: entry.width,
    height: entry.height,
    poster,
    ...meta,
  }
}

export const showcaseVideos = {
  fixupMagnesium: registerVideo(videoManifest.fixupMagnesium, videoPosterManifest.fixupMagnesiumPoster, {
    alt: 'A creator explains a magnesium glycinate supplement to camera, cut with close-ups of the bottle and tablets, gym footage and an anatomy graphic.',
    subject: 'Supplement explainer reel (9:16) — creator-led talking head with burned-in captions and b-roll. Segment 12–24 s of 51 s.',
    placement: 'Home showcase — reels row, 1',
    attribution: 'unconfirmed',
  }),
  vezzoSneakers: registerVideo(videoManifest.vezzoSneakers, videoPosterManifest.vezzoSneakersPoster, {
    alt: 'A man in sunglasses unboxes white sneakers at a café table, carries the box onto an escalator and laces the shoes up.',
    subject: 'Sneaker unboxing / lifestyle reel (9:16), shot on iPhone in HDR (converted to SDR). Segment 18–30 s of 55 s.',
    placement: 'Home showcase — reels row, 2',
    attribution: 'unconfirmed',
  }),
  champagneMistReview: registerVideo(videoManifest.champagneMistReview, videoPosterManifest.champagneMistReviewPoster, {
    alt: 'A creator in warm window light holds up a body mist, sprays it and reacts to the scent, with captions on screen.',
    subject: 'Fragrance-mist creator review (9:16) — UGC talking head with burned-in captions. Segment 8–19.2 s of 32 s.',
    placement: 'Home showcase — reels row, 4',
    attribution: 'unconfirmed',
  }),
  prathaaOutfit: registerVideo(videoManifest.prathaaOutfit, videoPosterManifest.prathaaOutfitPoster, {
    alt: 'A woman in a black sleeveless jumpsuit and sunglasses twirls, walks with a green bag and poses beside a tree in a sunny garden.',
    subject: 'Fashion outfit reel (9:16) — styled lifestyle footage outdoors. Segment 8.3–20.3 s of 43 s.',
    placement: 'Home showcase — reels row, 3',
    attribution: 'unconfirmed',
  }),
} as const
