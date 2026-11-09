import { ImageReveal, Parallax, Reveal } from '@/components/motion'
import { Badge, MediaFrame } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { CaseStudy } from '../types'
import styles from './CaseStudyFeature.module.css'

type CaseStudyFeatureProps = {
  study: CaseStudy
  index: number
}

type CaseMediaFrameProps = { media: CaseStudy['hero']; sizes: string; className?: string }

function CaseMediaFrame({ media, sizes, className }: CaseMediaFrameProps) {
  return (
    <MediaFrame
      className={className}
      ratio={media.ratio}
      image={media.image}
      sizes={sizes}
      alt={media.video?.label}
      videoSrc={media.video?.src}
      poster={media.video?.poster}
      art={media.art}
      artTone={media.artTone}
      isVideo={media.isVideo}
    />
  )
}

/** One case study: layered media collage + editorial brief (challenge, delivered, outcomes if real). */
export function CaseStudyFeature({ study, index }: CaseStudyFeatureProps) {
  const isFlipped = index % 2 === 1

  return (
    <article className={cn(styles.feature, isFlipped && styles.flipped)}>
      <div className={cn(styles.media, 'media-hover')}>
        <ImageReveal from={isFlipped ? 'right' : 'left'}>
          <CaseMediaFrame media={study.hero} sizes="(min-width: 1024px) 55vw, 100vw" />
        </ImageReveal>
        {study.detail && (
          <Parallax distance={-90} className={styles.detail}>
            <ImageReveal delay={0.2}>
              <CaseMediaFrame media={study.detail} sizes="(min-width: 1024px) 19vw, 34vw" />
            </ImageReveal>
          </Parallax>
        )}
      </div>

      <Reveal className={styles.text}>
        <div className={styles.head}>
          <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
          <div className={styles.labels}>
            <Badge>{study.category}</Badge>
            <span className="label">{study.year}</span>
          </div>
        </div>
        <p className={styles.brand}>{study.brand}</p>
        <h3 className={styles.headline}>{study.headline}</h3>

        <dl className={styles.brief}>
          <div>
            <dt className="label">The challenge</dt>
            <dd>{study.challenge}</dd>
          </div>
          <div>
            <dt className="label">What we made</dt>
            <dd>
              <ul className={styles.delivered}>
                {study.delivered.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
          {study.outcomes && study.outcomes.length > 0 && (
            <div>
              <dt className="label">Outcomes</dt>
              <dd className={styles.outcomes}>
                {study.outcomes.map((outcome) => (
                  <span key={outcome.label} className={styles.outcome}>
                    <span className={styles.outcomeValue}>{outcome.value}</span>
                    <span className={styles.outcomeLabel}>{outcome.label}</span>
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </Reveal>
    </article>
  )
}
