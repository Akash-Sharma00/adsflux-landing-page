/**
 * Cuts web-ready loops from the original videos in assets/originals/video/.
 *   node scripts/optimize-videos.mjs        (npm run videos — then run `npm run assets` for the posters)
 *
 * Brand + perf budget per clip: MP4 H.264 + AAC (plays everywhere), ≤ 15 s, ≤ 4 MB,
 * 720×1280 for 9:16 (the largest size any collage slot renders at 2x), 30 fps, `+faststart` so playback
 * starts before the file finishes downloading. The script fails if a clip goes over budget.
 *
 * - Originals are never modified. Clips go to public/assets/video/<name>-720.mp4.
 * - The first frame of each clip is written to assets/derived/video-posters/<name>.png; `npm run assets`
 *   turns it into AVIF + WebP poster variants (so the poster matches the frame playback starts on).
 * - Audio: AAC 96 kb/s stereo, loudness-normalised (-16 LUFS) so every clip plays at the same volume, with a short
 *   fade in/out so the loop doesn't click. The site autoplays muted; viewers opt into sound with the mute toggle.
 *   Segments with speech start and end on natural pauses (found with ffmpeg `silencedetect`).
 * - Writes src/assets/generated/videoManifest.ts (src, size, duration, bytes).
 * - HDR (HLG / BT.2020) sources are converted to BT.709 SDR with the `colorspace` filter — otherwise they
 *   render washed out. Needs ffmpeg + ffprobe on PATH.
 */
import { execFile } from 'node:child_process'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const ROOT = path.resolve(import.meta.dirname, '..')

const MAX_SECONDS = 15
const MAX_BYTES = 4 * 1024 * 1024
const WIDTH = 720
const HEIGHT = 1280
const FPS = 30
const FADE_IN = 0.25
const FADE_OUT = 0.4

/** `start`/`duration` in seconds — the segment of the original that becomes the loop. */
const JOBS = [
  {
    id: 'fixupMagnesium',
    source: 'assets/originals/video/fixup-magnesium-glycinate-explainer.mp4',
    name: 'fixup-magnesium-explainer',
    // Product hero → tablets → phone → gym b-roll → anatomy graphic.
    start: 12,
    duration: 12,
  },
  {
    id: 'vezzoSneakers',
    source: 'assets/originals/video/vezzo-sneakers-unboxing-reel.mp4',
    name: 'vezzo-sneakers-reel',
    // Unboxing at the café → shoe reveal → box on the escalator → lacing up.
    start: 18,
    duration: 12,
  },
  {
    id: 'champagneMistReview',
    source: 'assets/originals/video/eau-so-haute-champagne-mist-creator-review.mp4',
    name: 'champagne-mist-creator-review',
    // Bottle reveal → spritz → reaction. Starts and ends on pauses in her speech.
    start: 8,
    duration: 11.2,
  },
  {
    id: 'prathaaOutfit',
    source: 'assets/originals/video/prathaa-black-jumpsuit-outfit-reel.mov',
    name: 'prathaa-outfit-reel',
    // Twirl → walk with the bag → poses by the tree. Starts on a pause in the track.
    start: 8.3,
    duration: 12,
  },
]

async function probe(file) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=color_transfer,color_primaries',
    '-of', 'json',
    file,
  ])
  const stream = JSON.parse(stdout).streams?.[0] ?? {}
  return { isHdr: stream.color_primaries === 'bt2020' || ['arib-std-b67', 'smpte2084'].includes(stream.color_transfer) }
}

function videoFilter(isHdr) {
  const toSdr = isHdr ? ['colorspace=all=bt709:iall=bt2020:itrc=bt2020-10:format=yuv420p'] : []
  // Cover-crop to exactly 720×1280 (sources are 9:16 already; this guards against odd sizes).
  return [...toSdr, `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase`, `crop=${WIDTH}:${HEIGHT}`, `fps=${FPS}`, 'format=yuv420p'].join(',')
}

function audioFilter(duration) {
  const fadeOutAt = (duration - FADE_OUT).toFixed(2)
  return [`loudnorm=I=-16:TP=-1.5:LRA=11`, `afade=t=in:d=${FADE_IN}`, `afade=t=out:st=${fadeOutAt}:d=${FADE_OUT}`].join(',')
}

async function runJob(job) {
  if (job.duration > MAX_SECONDS) throw new Error(`${job.id}: ${job.duration}s is over the ${MAX_SECONDS}s budget`)

  const sourcePath = path.join(ROOT, job.source)
  const outDir = path.join(ROOT, 'public/assets/video')
  const posterDir = path.join(ROOT, 'assets/derived/video-posters')
  await Promise.all([mkdir(outDir, { recursive: true }), mkdir(posterDir, { recursive: true })])

  const { isHdr } = await probe(sourcePath)
  const filter = videoFilter(isHdr)
  const file = `${job.name}-${WIDTH}.mp4`
  const outPath = path.join(outDir, file)

  await run('ffmpeg', [
    '-v', 'error', '-y',
    '-ss', String(job.start), '-t', String(job.duration), '-i', sourcePath,
    '-vf', filter,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-maxrate', '2M', '-bufsize', '4M',
    '-profile:v', 'high', '-level', '4.0', '-g', String(FPS * 2),
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    '-af', audioFilter(job.duration),
    '-c:a', 'aac', '-b:a', '96k', '-ac', '2', '-ar', '48000',
    '-map', '0:v:0', '-map', '0:a:0?',
    '-map_metadata', '-1', '-movflags', '+faststart',
    outPath,
  ])

  // Poster = the clip's first frame, lossless PNG for the image pipeline.
  await run('ffmpeg', [
    '-v', 'error', '-y',
    '-ss', String(job.start), '-i', sourcePath,
    '-frames:v', '1', '-vf', filter.replace(`,fps=${FPS}`, '').replace(',format=yuv420p', ''),
    path.join(posterDir, `${job.name}.png`),
  ])

  const { size: bytes } = await stat(outPath)
  if (bytes > MAX_BYTES) throw new Error(`${job.id}: ${(bytes / 1024 / 1024).toFixed(1)} MB is over the 4 MB budget`)

  return { id: job.id, src: `/assets/video/${file}`, type: 'video/mp4', width: WIDTH, height: HEIGHT, duration: job.duration, bytes }
}

const results = []
for (const job of JOBS) {
  const result = await runJob(job)
  results.push(result)
  console.log(`${job.id.padEnd(20)} ${result.width}x${result.height}  ${result.duration}s  ${(result.bytes / 1024 / 1024).toFixed(2)} MB`)
}

const banner = '/* Generated by scripts/optimize-videos.mjs — do not edit by hand. Run `npm run videos`. */\n'
const entries = JSON.stringify(Object.fromEntries(results.map((r) => [r.id, r])), null, 2)
await writeFile(path.join(ROOT, 'src/assets/generated/videoManifest.ts'), `${banner}export const videoManifest = ${entries} as const\n`)
console.log('Wrote src/assets/generated/videoManifest.ts — now run `npm run assets` for the posters.')
