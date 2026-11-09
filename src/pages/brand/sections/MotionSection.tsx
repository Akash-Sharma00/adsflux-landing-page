import { ImageReveal, Marquee, Parallax, ScrollHighlightText, Stagger, StaggerItem, TextReveal } from '@/components/motion'
import { MediaFrame } from '@/components/ui'
import { motionTokens, reducedMotionRules } from '../brandData'
import { BrandSection } from './BrandSection'
import { HoverDemos } from './HoverDemos'
import { DemoCell } from './DemoCell'
import { SpecHeading } from './SpecHeading'
import styles from './MotionSection.module.css'

const STAGGER_WORDS = ['Strategy', 'Storytelling', 'Performance', 'Growth'] as const
const PARALLAX_LAYERS = [
  { distance: 90, art: 'sun', tone: 'peach' },
  { distance: 0, art: 'arch', tone: 'cobalt' },
  { distance: -90, art: 'halftone', tone: 'blue' },
] as const
const MARQUEE_ITEMS = ['Strategy', 'Storytelling', 'Performance', 'India', 'Worldwide'] as const

export function MotionSection() {
  return (
    <BrandSection
      id="motion"
      divider
      title={
        <>
          Motion that <em>arrives</em>, then gets out of the way.
        </>
      }
      description="Expo-out easing, short distances, one-time entrances. Scroll effects run on lazily loaded GSAP; everything respects reduced motion."
    >
      <div className={styles.grid}>
        <DemoCell title="TextReveal" meta="Words rise out of a mask" isReplayable className={styles.wide}>
          <TextReveal as="p" text="Impossible to ignore." className={styles.revealText} />
        </DemoCell>

        <DemoCell title="Stagger" meta="Siblings 80ms apart" isReplayable className={styles.narrow}>
          <Stagger as="ul" className={styles.staggerList}>
            {STAGGER_WORDS.map((word) => (
              <StaggerItem as="li" key={word} className={styles.staggerItem}>
                {word}
              </StaggerItem>
            ))}
          </Stagger>
        </DemoCell>

        <DemoCell title="ImageReveal" meta="Clip wipe + settling zoom" isReplayable className={styles.narrow}>
          <ImageReveal from="left">
            <MediaFrame ratio="4/3" art="stripes" artTone="cobalt" />
          </ImageReveal>
        </DemoCell>

        <DemoCell title="Parallax" meta="Scroll to see layers drift · ±90px" className={styles.wide}>
          <div className={styles.parallax}>
            {PARALLAX_LAYERS.map((layer) => (
              <Parallax key={layer.art} distance={layer.distance} className={styles.parallaxLayer}>
                <MediaFrame ratio="3/4" art={layer.art} artTone={layer.tone} />
                <span className="label">{layer.distance}px</span>
              </Parallax>
            ))}
          </div>
        </DemoCell>
      </div>

      <div data-theme="cobalt" className={styles.scrollPanel}>
        <span className="label">ScrollHighlightText — scrubbed to scroll</span>
        <ScrollHighlightText text="Scroll slowly. Each word earns its place, the way every brand moment should." />
      </div>

      <div data-theme="orange" className={styles.marqueeBand}>
        <Marquee items={MARQUEE_ITEMS} duration={30} className={styles.marquee} />
      </div>

      <HoverDemos />

      <div className={styles.footer}>
        <div>
          <SpecHeading title={<>Motion <em>tokens</em></>} meta="Mirrored in src/lib/motion.ts" />
          <dl className={styles.tokens}>
            {motionTokens.map((item) => (
              <div key={item.token} className={styles.token}>
                <dt className="label">{item.token}</dt>
                <dd className={styles.tokenValue}>{item.value}</dd>
                <dd className={styles.tokenUse}>{item.use}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <SpecHeading title={<>Reduced <em>motion</em></>} meta="prefers-reduced-motion: reduce" />
          <ul className={styles.rules}>
            {reducedMotionRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </BrandSection>
  )
}
