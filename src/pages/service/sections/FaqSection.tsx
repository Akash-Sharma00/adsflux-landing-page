import { Reveal } from '@/components/motion'
import { Container, Section, SectionHeading } from '@/components/ui'
import type { ServiceQuestion } from '@/pages/service/types'
import styles from './FaqSection.module.css'

type FaqSectionProps = {
  questions: readonly ServiceQuestion[]
}

/**
 * Questions buyers ask before they enquire. Native <details>, so it works without JS and the answers stay in
 * the HTML for search engines even while collapsed.
 */
export function FaqSection({ questions }: FaqSectionProps) {
  return (
    <Section spacing="lg">
      <Container size="xl" className={styles.inner}>
        <SectionHeading
          index="03"
          eyebrow="FAQ"
          layout="stacked"
          title={
            <>
              Questions, <em>answered.</em>
            </>
          }
          className={styles.heading}
        />
        <Reveal className={styles.list}>
          {questions.map((item) => (
            <details key={item.question} className={styles.item}>
              <summary className={styles.question}>
                <h3 className={styles.questionText}>{item.question}</h3>
                <span className={styles.marker} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </Container>
    </Section>
  )
}
