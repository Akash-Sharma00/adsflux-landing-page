import { Reveal } from '@/components/motion'
import { Container, Section, SectionHeading } from '@/components/ui'
import type { ServicePoint } from '@/pages/service/types'
import styles from './ProcessSection.module.css'

type ProcessSectionProps = {
  steps: readonly ServicePoint[]
}

/** Peach band: the way the work runs, as numbered steps with oversized serif numerals. */
export function ProcessSection({ steps }: ProcessSectionProps) {
  return (
    <Section tone="peach" spacing="lg" texture>
      <Container size="xl">
        <SectionHeading
          index="02"
          eyebrow="How we work"
          title={
            <>
              Clear steps, <em>no mystery.</em>
            </>
          }
          description="You always know what happens next, who is doing it and what it is for."
        />
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.1} className={styles.step}>
                <span className={styles.numeral} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.description}>{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
