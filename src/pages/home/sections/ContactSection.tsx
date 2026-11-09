import { Reveal, TextReveal } from '@/components/motion'
import { Burst, Container, Eyebrow, Section } from '@/components/ui'
import { homeSections } from '@/config/routes'
import { siteConfig } from '@/config/site'
import { ContactForm } from '@/features/contact'
import styles from './ContactSection.module.css'

const NEXT_STEPS = ['We read every brief within two working days.', 'A 30-minute call to understand the goal.', 'A proposal with scope, team and timeline.'] as const

/** Cobalt closing: a headline that fills the screen, then the enquiry form. */
export function ContactSection() {
  return (
    <Section id={homeSections.contact} tone="cobalt" spacing="lg" texture className={styles.section}>
      <Container size="xl">
        <Eyebrow index="07">Contact</Eyebrow>
        <h2 className={styles.headline}>
          <span className="visually-hidden">Have something worth making noise about?</span>
          <span aria-hidden="true">
            <TextReveal as="span" text="Have something worth" className={styles.line} />
            <span className={styles.line}>
              <em>
                <TextReveal as="span" text="making noise" delay={0.2} />
              </em>{' '}
              <TextReveal as="span" text="about?" delay={0.35} />
              <Burst className={styles.burst} spin />
            </span>
          </span>
        </h2>

        <div className={styles.grid}>
          <Reveal className={styles.intro}>
            <p className={styles.lede}>Tell us about the brand, the goal and the deadline. We’ll take it from there.</p>
            {siteConfig.email && (
              <a href={`mailto:${siteConfig.email}`} className={styles.email}>
                {siteConfig.email}
              </a>
            )}
            <ol className={styles.steps}>
              {NEXT_STEPS.map((step, index) => (
                <li key={step}>
                  <span className="label">({String(index + 1).padStart(2, '0')})</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
