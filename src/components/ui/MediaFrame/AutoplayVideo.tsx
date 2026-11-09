import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './AutoplayVideo.module.css'

type AutoplayVideoProps = {
  src: string
  label: string
  className?: string
}

/** The one video allowed to play with sound, page-wide. Unmuting another mutes it. */
let audibleVideo: HTMLVideoElement | null = null

/** Starts playback; if the browser refuses sound without a fresh gesture, falls back to muted. */
async function startPlayback(video: HTMLVideoElement) {
  try {
    await video.play()
  } catch {
    if (video.muted) return // Autoplay blocked (e.g. Low Power Mode): the poster and play button stay visible.
    video.muted = true
    await video.play().catch(() => undefined)
  }
}

/**
 * Looping creative with play/pause and sound controls.
 * - Plays muted while on screen and pauses off screen (saves CPU, battery and data). `preload="none"` means no
 *   video bytes load until it plays.
 * - Sound is opt-in, and only one video is audible at a time.
 * - Pausing is respected: a video the viewer paused stays paused when it scrolls back into view.
 * - Under reduced motion nothing autoplays; the poster shows with the play button.
 * The poster is a lazy <picture> rendered behind this element by MediaFrame (no eager `poster=` request).
 */
export function AutoplayVideo({ src, label, className }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const pausedByViewerRef = useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Keep the controls in sync with the element, whoever changed it (us, the browser, another video).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const sync = () => {
      setIsPlaying(!video.paused)
      setIsMuted(video.muted)
    }
    const events = ['play', 'pause', 'volumechange'] as const
    events.forEach((event) => video.addEventListener(event, sync))
    return () => {
      events.forEach((event) => video.removeEventListener(event, sync))
      if (audibleVideo === video) audibleVideo = null
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!prefersReducedMotion && !pausedByViewerRef.current) void startPlayback(video)
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    pausedByViewerRef.current = !video.paused
    if (video.paused) void startPlayback(video)
    else video.pause()
  }

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    if (!video.muted) {
      video.muted = true
      return
    }
    if (audibleVideo && audibleVideo !== video) audibleVideo.muted = true
    audibleVideo = video
    video.muted = false
    // Turning the sound on means "I want to watch this": start it if it was paused.
    pausedByViewerRef.current = false
    if (video.paused) void startPlayback(video)
  }

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        src={src}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
      />
      <div className={styles.controls} role="group" aria-label="Video controls">
        <button
          type="button"
          data-theme="cream"
          className={styles.control}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          onClick={togglePlay}
        >
          <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            {isPlaying ? <path d="M6 4h3v12H6zM11 4h3v12h-3z" /> : <path d="M6.5 3.8 16 10l-9.5 6.2z" />}
          </svg>
        </button>
        <button
          type="button"
          data-theme="cream"
          className={styles.control}
          aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
          onClick={toggleSound}
        >
          <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M3 7.5h3L10.5 4v12L6 12.5H3z" />
            {isMuted ? (
              <path className={styles.stroke} d="m13 7.5 5 5m0-5-5 5" />
            ) : (
              <path className={styles.stroke} d="M13 7.2a4 4 0 0 1 0 5.6M15.3 5a7 7 0 0 1 0 10" />
            )}
          </svg>
        </button>
      </div>
    </>
  )
}
