import { HERO_CUTOUT_SIZE } from '@/assets/generated/heroCutoutPieces'
import type { Point } from './brush'

/**
 * Art direction for the hero collage backdrop, in the cut-out's source pixels (1536 × 1024). The SVG
 * layers share this viewBox with the image, so every shape lines up with the cards and phone at any size.
 * Positions follow the original collage the cut-out was derived from.
 */
export const VIEWBOX = `0 0 ${HERO_CUTOUT_SIZE.width} ${HERO_CUTOUT_SIZE.height}`

/** Cobalt blob behind the phone: an irregular closed curve, so its slow rotation reads as a morph. */
export const BLOB = {
  origin: [790, 395] as Point,
  path:
    'M790 18C925 14 1046 104 1068 246C1090 388 1062 548 1003 660C944 772 842 790 742 772C628 752 548 676 ' +
    '528 548C508 420 512 262 560 160C608 58 690 22 790 18Z',
}

/** Orange disc top-right, with mono text running round its rim. */
export const DISC = {
  center: [995, 200] as Point,
  radius: 182,
  textRadius: 148,
  text: 'Strategy · Story · Performance · Strategy · Story · Performance · ',
}

/** Tilted ellipse the dots travel along: centre, radii, rotation (deg). Drawn as two arcs. */
const ORBIT = { cx: 785, cy: 600, rx: 610, ry: 285, angle: -10 }

function ellipsePath({ cx, cy, rx, ry, angle }: typeof ORBIT) {
  const rad = (angle * Math.PI) / 180
  const dx = rx * Math.cos(rad)
  const dy = rx * Math.sin(rad)
  const start = `${(cx - dx).toFixed(1)} ${(cy - dy).toFixed(1)}`
  const end = `${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}`
  return `M${start}A${rx} ${ry} ${angle} 1 1 ${end}A${rx} ${ry} ${angle} 1 1 ${start}Z`
}

export const ORBIT_PATH = ellipsePath(ORBIT)

/** Dots on the orbit. `phase` (0–1) is where each starts; `at` is its resting spot without motion. */
export const ORBIT_DOTS = [
  { kind: 'ring', radius: 10, phase: 0.08, at: [207, 527] as Point },
  { kind: 'ring', radius: 12, phase: 0.55, at: [707, 885] as Point },
  { kind: 'solid', radius: 19, phase: 0.82, at: [1360, 366] as Point },
] as const

/** Seconds per lap of the orbit. */
export const ORBIT_LAP = 36

/** Three short cobalt marks top-left of the blob — the "noise" around a loud idea. */
export const SPEED_LINES = [
  'M444 70L500 101',
  'M493 36L518 73',
  'M452 133L500 133',
] as const

/** Brush strokes: a hook on the left, and the main sweep rising past the phone. */
export const BRUSH_STROKES = [
  {
    // Starts under the Performance Ads card, hooks round and lifts off before Brand Strategy.
    points: [
      [292, 588], [236, 590], [168, 620], [133, 684], [158, 742], [232, 760], [312, 731], [395, 684],
    ] as Point[],
    width: 58,
    taperStart: 0.04,
    taperEnd: 0.32,
    seed: 3,
  },
  {
    // Rises from the bottom edge, over the phone's corner, and tucks under Analytics & Growth.
    points: [
      [552, 1004], [640, 984], [720, 942], [790, 872], [842, 792], [884, 722], [934, 667],
      [992, 631], [1050, 628], [1094, 662], [1120, 730],
    ] as Point[],
    width: 76,
    taperStart: 0.3,
    taperEnd: 0.04,
    seed: 11,
  },
] as const
