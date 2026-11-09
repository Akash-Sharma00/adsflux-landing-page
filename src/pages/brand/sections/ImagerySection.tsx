import { ImageReveal } from '@/components/motion'
import { MediaFrame, type MediaRatio } from '@/components/ui'
import { artSamples } from '../brandData'
import { BrandSection } from './BrandSection'
import { SpecHeading } from './SpecHeading'
import styles from './ImagerySection.module.css'

/** Gallery ratios per slot — varied on purpose, like a pasted-up wall. */
const GALLERY_RATIOS: readonly MediaRatio[] = ['4/5', '9/16', '3/2', '1/1', '4/5', '3/4']
/** The arch slot doubles as the video example; its label is omitted because it would sit on the arch shape. */
const VIDEO_SLOT = 1

const FRAME_RATIOS: readonly MediaRatio[] = ['1/1', '4/5', '3/4', '2/3', '9/16', '3/2', '4/3', '16/10', '16/9', '21/9']

export function ImagerySection() {
  return (
    <BrandSection
      id="imagery"
      tone="ink"
      title={
        <>
          Placeholders with <em>a point of view.</em>
        </>
      }
      description="Until real campaign photography exists, every media slot shows an art-directed PlaceholderArt composition in brand tones — never stock imagery."
    >
      <ul className={styles.gallery}>
        {artSamples.map((sample, index) => (
          <li key={sample.variant} className={styles.piece}>
            <ImageReveal from={index % 2 === 0 ? 'bottom' : 'left'} delay={(index % 3) * 0.08}>
              <MediaFrame
                ratio={GALLERY_RATIOS[index] ?? '4/5'}
                art={sample.variant}
                artTone={sample.tone}
                placeholderMeta={`Placeholder — ${sample.tone}`}
                placeholderLabel={index === VIDEO_SLOT ? undefined : sample.label}
                isVideo={index === VIDEO_SLOT}
                className={styles.frame}
              />
            </ImageReveal>
            <p className={styles.caption}>
              <span className="label">({String(index + 1).padStart(2, '0')})</span> art=&quot;{sample.variant}&quot; · artTone=&quot;
              {sample.tone}&quot;
              {index === VIDEO_SLOT && ' · isVideo'}
            </p>
          </li>
        ))}
      </ul>

      <div className={styles.ratios}>
        <SpecHeading title={<>MediaFrame <em>ratios</em></>} meta="Sharp corners · object-fit: cover" />
        <ul className={styles.ratioRow}>
          {FRAME_RATIOS.map((ratio, index) => (
            <li key={ratio} className={styles.ratioItem}>
              <MediaFrame
                ratio={ratio}
                art={artSamples[index % artSamples.length]?.variant}
                artTone={index % 2 === 0 ? 'blue' : 'peach'}
                className={styles.ratioFrame}
              />
              <span className="label">{ratio}</span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Real media replaces the art by passing <code>src</code> (image) or <code>videoSrc</code> + <code>poster</code>. Videos
          autoplay muted only while visible (never under reduced motion), with play/pause and sound controls.
        </p>
      </div>
    </BrandSection>
  )
}
