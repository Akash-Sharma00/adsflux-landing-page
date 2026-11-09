import type { CSSProperties } from 'react'
import { Reveal, TextReveal } from '@/components/motion'
import { Burst, Container, Section, Stamp, Wordmark } from '@/components/ui'
import { siteConfig } from '@/config/site'
import { useTheme } from '@/hooks/useTheme'
import { colorReference } from '../brandData'
import styles from './BrandHero.module.css'

/** Masthead for the reference: the wordmark at poster scale, the positioning, and the palette as a strip. */
export function BrandHero() {
  const { colors } = colorReference(useTheme().theme)

  return (
    <Section spacing="none" texture className={styles.hero}>
      <Container size="xl" className={styles.inner}>
        <Reveal className={styles.masthead}>
          <span className="label">(Adsflux) Brand system</span>
          <span className="label">Electric Editorial — living reference</span>
          <span className="label">Built from the same tokens as the site</span>
        </Reveal>

        <div className={styles.logoStage}>
          <Reveal>
            <Wordmark className={styles.wordmark} />
          </Reveal>
          <Stamp className={styles.stamp} text="Electric Editorial • Brand system • " />
        </div>

        <div className={styles.grid}>
          <h1 className={styles.title}>
            <TextReveal as="span" text="The brand system," trigger="mount" className={styles.titleLine} />
            <em className={styles.titleLine}>
              <TextReveal as="span" text="in one place." trigger="mount" delay={0.2} />
            </em>
          </h1>

          <Reveal delay={0.2} className={styles.statement}>
            <span className="label">Positioning</span>
            <p className={styles.positioning}>
              We make brands <em>impossible to ignore.</em>
            </p>
          </Reveal>

          <Reveal delay={0.35} className={styles.heroLine}>
            <span className="label">Hero line</span>
            <p className={styles.heroLineText}>
              {siteConfig.heroLead} Great creative makes people <span className="highlight">care.</span>
            </p>
            <Burst className={styles.burst} spin />
          </Reveal>
        </div>

        <ul className={styles.palette} aria-label="The six brand tones in the current colour mode">
          {colors.map((color) => (
            <li
              key={color.token}
              data-theme={color.tone}
              className={styles.paletteBand}
              style={{ '--share': color.share } as CSSProperties}
            >
              <span className={styles.paletteName}>{color.name}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
