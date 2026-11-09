import { Reveal, TextReveal } from '@/components/motion'
import { ButtonLink, Container, Section } from '@/components/ui'
import { primaryCta } from '@/config/navigation'
import { homeAnchor } from '@/config/routes'
import { siteConfig } from '@/config/site'
import { HeroCollage } from './hero-collage'
import styles from './HomeHero.module.css'

/**
 * Editorial split hero: masthead meta row; copy column on the left (grotesk lead, three-line serif punch
 * with "care." in cobalt italic, supporting line, CTAs); on the right, the animated services collage
 * (cut-out cards + phone over a live SVG backdrop), spanning the copy's full height.
 */
export function HomeHero() {
  return (
    <Section spacing="none" texture className={styles.hero}>
      <Container size="xl" className={styles.inner}>
        <Reveal className={styles.masthead}>
          <span className="label">(Adsflux) Creative &amp; growth agency</span>
          <span className="label">{siteConfig.markets}</span>
          <span className="label">Strategy · Story · Performance</span>
        </Reveal>

        <div className={styles.copy}>
          <h1 className={styles.headline}>
            <span className="visually-hidden">
              {siteConfig.heroLead} {siteConfig.heroPunch}
            </span>
            <span aria-hidden="true">
              <TextReveal as="span" text={siteConfig.heroLead} trigger="mount" className={styles.lead} />
              <span className={styles.punch}>
                <TextReveal as="span" text="Great creative" trigger="mount" delay={0.2} className={styles.punchLine} />
                <TextReveal as="span" text="makes people" trigger="mount" delay={0.32} className={styles.punchLine} />
                <em className={styles.punchLine}>
                  <TextReveal as="span" text="care." trigger="mount" delay={0.45} className={styles.care} />
                </em>
              </span>
            </span>
          </h1>

          <Reveal delay={0.6}>
            <p className={styles.supporting}>{siteConfig.supportingMessage}</p>
          </Reveal>
          <Reveal delay={0.7} className={styles.actions}>
            <ButtonLink href={primaryCta.href} size="lg" withArrow>
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={homeAnchor('showcase')} size="lg" variant="ghost" withArrow>
              See our work
            </ButtonLink>
          </Reveal>
        </div>

        <div className={styles.visual}>
          <HeroCollage />
        </div>
      </Container>
    </Section>
  )
}
