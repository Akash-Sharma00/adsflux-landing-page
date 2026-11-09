/**
 * Builds a painted brush stroke as SVG path data from a few control points: a tapered filled outline,
 * its centre line (used to reveal the stroke as if it were being painted), and dry-brush streaks.
 * Pure and deterministic — computed once at module load.
 */

export type Point = readonly [number, number]

export type BrushSpec = {
  points: readonly Point[]
  /** Full width at the stroke's widest. */
  width: number
  /** Share of the length (0–1) over which the stroke swells in from a point, and thins out again. */
  taperStart: number
  taperEnd: number
  /** Seed for the streak pattern, so each stroke has its own texture. */
  seed: number
}

export type Brush = {
  outline: string
  spine: string
  streaks: { d: string; width: number; dash: string }[]
  width: number
}

const SAMPLES_PER_SEGMENT = 24
const STREAK_COUNT = 9

/** Uniform Catmull-Rom spline through the points (end points repeated so the curve reaches them). */
function sampleSpline(points: readonly Point[]): Point[] {
  const at = (i: number): Point => points[Math.min(Math.max(i, 0), points.length - 1)] ?? [0, 0]
  const samples: Point[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    for (let s = 0; s < SAMPLES_PER_SEGMENT; s++) {
      const t = s / SAMPLES_PER_SEGMENT
      const t2 = t * t
      const t3 = t2 * t
      const axis = (k: 0 | 1) =>
        0.5 *
        (2 * p1[k] +
          (-p0[k] + p2[k]) * t +
          (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
          (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
      samples.push([axis(0), axis(1)])
    }
  }
  samples.push(at(points.length - 1))
  return samples
}

/** Small deterministic PRNG (mulberry32). */
function random(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const fmt = ([x, y]: Point) => `${x.toFixed(1)} ${y.toFixed(1)}`
const polyline = (pts: Point[]) => `M${pts.map(fmt).join('L')}`

export function buildBrush({ points, width, taperStart, taperEnd, seed }: BrushSpec): Brush {
  const spine = sampleSpline(points)
  const last = spine.length - 1

  // Unit normal at each sample, from its neighbours.
  const normals = spine.map((_, i): Point => {
    const [ax, ay] = spine[Math.max(i - 1, 0)] ?? [0, 0]
    const [bx, by] = spine[Math.min(i + 1, last)] ?? [0, 0]
    const length = Math.hypot(bx - ax, by - ay) || 1
    return [-(by - ay) / length, (bx - ax) / length]
  })

  // Half-width along the stroke: swell in, hold with a slight hand-made wobble, thin out.
  const halfWidth = spine.map((_, i) => {
    const t = i / last
    const swell = Math.min(1, t / taperStart, (1 - t) / taperEnd)
    return (width / 2) * Math.pow(Math.max(swell, 0), 0.6) * (1 + 0.05 * Math.sin(t * 19))
  })

  const offset = (share: number) =>
    spine.map(([x, y], i): Point => {
      const [nx, ny] = normals[i] ?? [0, 0]
      const h = (halfWidth[i] ?? 0) * share
      return [x + nx * h, y + ny * h]
    })

  const outline = `${polyline([...offset(1), ...offset(-1).reverse()])}Z`

  const rand = random(seed)
  const streaks = Array.from({ length: STREAK_COUNT }, () => {
    const share = (rand() * 2 - 1) * 0.78
    const from = Math.floor(rand() * 0.35 * last)
    const to = Math.ceil((0.65 + rand() * 0.35) * last)
    const dash = [40 + rand() * 120, 6 + rand() * 30, 10 + rand() * 50, 4 + rand() * 20].map((v) => v.toFixed(0))
    return { d: polyline(offset(share).slice(from, to)), width: 1 + rand() * 2.2, dash: dash.join(' ') }
  })

  return { outline, spine: polyline(spine), streaks, width }
}
