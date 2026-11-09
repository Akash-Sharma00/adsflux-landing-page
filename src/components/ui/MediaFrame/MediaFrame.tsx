import type { ResponsiveImage } from '@/types/media'
import { cn } from '@/lib/cn'
import { AutoplayVideo } from './AutoplayVideo'
import styles from './MediaFrame.module.css'
import { PlaceholderArt, type ArtTone, type ArtVariant } from './PlaceholderArt'

export type MediaRatio = '1/1' | '4/5' | '3/4' | '2/3' | '9/16' | '3/2' | '4/3' | '16/10' | '16/9' | '21/9'

export type MediaFrameProps = {
  /** `intrinsic`: the image's own proportions (needs `image`) — for cut-outs that must not be cropped. */
  ratio?: MediaRatio | 'intrinsic'
  /** Responsive campaign image from the asset registry (AVIF + WebP srcset). Preferred over `src`. */
  image?: ResponsiveImage
  /** `sizes` attribute for `image` — describe the rendered width per breakpoint. */
  sizes?: string
  /** Single-file image (legacy / external). */
  src?: string
  /** Muted looping video (mp4/webm). Takes precedence over `src`; plays only while visible. */
  videoSrc?: string
  /**
   * Video poster frame (the clip's first frame) — always provide one with `videoSrc`. Rendered as a lazy AVIF/WebP
   * <picture> under the video, so it costs nothing until near the viewport (a `poster=` attribute loads eagerly).
   */
  poster?: ResponsiveImage
  /** Alt text for images, accessible label for videos. Empty string = decorative. */
  alt?: string
  /** Placeholder composition shown until real media exists. */
  art?: ArtVariant
  artTone?: ArtTone
  placeholderLabel?: string
  placeholderMeta?: string
  /** Shows a play marker on the placeholder so empty video slots read as video. */
  isVideo?: boolean
  /** Above-the-fold image: loads eagerly with high priority. */
  priority?: boolean
  width?: number
  height?: number
  className?: string
}

/**
 * Fixed-ratio, SHARP-cornered media slot. Real campaign photography (`src`) or video (`videoSrc`)
 * goes here; until then it renders an art-directed PlaceholderArt composition — never stock imagery.
 * Hover zoom: add the global `media-hover` class to a parent.
 */
export function MediaFrame({
  ratio = '4/5',
  image,
  sizes = '100vw',
  src,
  videoSrc,
  poster,
  alt = '',
  art = 'sun',
  artTone = 'blue',
  placeholderLabel,
  placeholderMeta,
  isVideo = false,
  priority = false,
  width,
  height,
  className,
}: MediaFrameProps) {
  const ground = videoSrc ? poster : image

  return (
    <div
      className={cn(styles.frame, image?.hasAlpha && styles.cutout, className)}
      style={{
        aspectRatio: ratio === 'intrinsic' ? image && `${image.width} / ${image.height}` : ratio,
        backgroundColor: ground && !ground.hasAlpha ? ground.dominantColor : undefined,
      }}
    >
      {videoSrc ? (
        <>
          {poster && <ResponsivePicture image={poster} sizes={sizes} priority={false} />}
          <AutoplayVideo className={cn(styles.media, styles.overlay)} src={videoSrc} label={alt} />
        </>
      ) : image ? (
        <ResponsivePicture image={image} sizes={sizes} priority={priority} />
      ) : src ? (
        <img
          className={styles.media}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      ) : (
        <PlaceholderArt
          className={styles.media}
          variant={art}
          tone={artTone}
          label={placeholderLabel}
          meta={placeholderMeta}
          isVideo={isVideo}
        />
      )}
    </div>
  )
}

type ResponsivePictureProps = {
  image: ResponsiveImage
  sizes: string
  priority: boolean
}

const toSrcSet = (variants: ResponsiveImage['avif']) => variants.map((v) => `${v.src} ${v.width}w`).join(', ')

/** <picture> with AVIF + WebP sources. Intrinsic width/height reserve space (no layout shift). */
function ResponsivePicture({ image, sizes, priority }: ResponsivePictureProps) {
  const fallback = image.webp.at(-1)
  if (!fallback) return null

  return (
    <picture className={styles.picture}>
      <source type="image/avif" srcSet={toSrcSet(image.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={toSrcSet(image.webp)} sizes={sizes} />
      <img
        className={styles.media}
        src={fallback.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
      />
    </picture>
  )
}
