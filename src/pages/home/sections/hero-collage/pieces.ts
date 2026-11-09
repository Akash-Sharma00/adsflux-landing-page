import type { HeroCutoutPiece } from '@/assets/generated/heroCutoutPieces'

/**
 * How each piece of the cut-out moves. Kept apart from geometry.ts so the eager hero bundle doesn't pull
 * in the (lazy) backdrop and brush geometry.
 *
 * - depth: px the piece shifts at full pointer travel (bigger = closer to the viewer)
 * - enter: delay (s) before it settles into place
 * - float: seconds per idle bob; different values keep the pieces out of step
 * - sway:  rotation (deg) at the top of the bob
 */
export type PieceMotion = {
  piece: HeroCutoutPiece
  depth: number
  enter: number
  float: number
  sway: number
}

/** Under the brush strokes: Brand Strategy (whose corner tucks under the phone), then the phone. */
export const PIECES_BEHIND_STROKES: readonly PieceMotion[] = [
  { piece: 'brandStrategy', depth: 16, enter: 0.3, float: 7.4, sway: -0.6 },
  { piece: 'phone', depth: 8, enter: 0, float: 9, sway: 0.35 },
]

/** Over the brush strokes. */
export const PIECES_OVER_STROKES: readonly PieceMotion[] = [
  { piece: 'socialMedia', depth: 20, enter: 0.1, float: 6.6, sway: 0.7 },
  { piece: 'ugcInfluencers', depth: 18, enter: 0.16, float: 7.8, sway: -0.7 },
  { piece: 'performanceAds', depth: 24, enter: 0.22, float: 8.2, sway: -0.5 },
  { piece: 'creativeProduction', depth: 16, enter: 0.26, float: 6.9, sway: 0.55 },
  { piece: 'analyticsGrowth', depth: 22, enter: 0.36, float: 7.2, sway: 0.6 },
]

/** The phone carries the image's alt text; the other pieces are decorative copies of the same file. */
export const PRIMARY_PIECE: HeroCutoutPiece = 'phone'

/** Pointer depth of the backdrop (moves against the pieces) and of the brush strokes. */
export const BACKDROP_DEPTH = -10
export const STROKES_DEPTH = 12
