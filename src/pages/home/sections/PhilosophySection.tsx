import { Parallax, Reveal, ScrollHighlightText } from '@/components/motion'
import { Burst, Container, Eyebrow, Section } from '@/components/ui'
import { homeSections } from '@/config/routes'
import styles from './PhilosophySection.module.css'

const PRINCIPLES = [
  { title: 'Strategy', body: 'We find the truth your audience already believes, and build from there.' },
  { title: 'Storytelling', body: 'Work with a point of view. Made to be felt, not just seen.' },
  { title: 'Performance', body: 'Every idea measured, every rupee accountable, every win compounded.' },
] as const

/** Cobalt manifesto: two headline lines drift in opposite directions; the creed lights up on scroll. */
export function PhilosophySection() {
  return (
    <Section id={homeSections.philosophy} tone="cobalt" spacing="lg" texture className={styles.section}>
      <Container size="xl">
        <Eyebrow index="04">Philosophy</Eyebrow>
      </Container>

      <h2 className={styles.headline}>
        <Parallax axis="x" distance={160} className={styles.lineOne}>
          Attention is <em>earned.</em>
        </Parallax>
        <Parallax axis="x" distance={-160} className={styles.lineTwo}>
          Growth is <em>engineered.</em>
        </Parallax>
      </h2>

      <Container size="xl" className={styles.body}>
        <Parallax distance={-120} rotate={90} className={styles.burst}>
          <Burst className={styles.burstGraphic} rays={12} spin />
        </Parallax>
        <ScrollHighlightText
          className={styles.creed}
          text="Nobody wakes up wanting to see an ad. So we make work people choose to watch — and build the systems that turn that attention into growth you can measure."
        />
        <ol className={styles.principles}>
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title}>
              <Reveal delay={index * 0.1} className={styles.principle}>
                <span className={styles.principleIndex}>{String(index + 1).padStart(2, '0')}</span>
                <h3 className={styles.principleTitle}>{principle.title}</h3>
                <p className={styles.principleBody}>{principle.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
