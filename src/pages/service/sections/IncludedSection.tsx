import { Stagger, StaggerItem } from '@/components/motion'
import { Container, Section, SectionHeading } from '@/components/ui'
import type { Service } from '@/config/services'
import type { ServicePoint } from '@/pages/service/types'
import styles from './IncludedSection.module.css'

type IncludedSectionProps = {
  service: Service
  points: readonly ServicePoint[]
}

/** What the engagement covers: an editorial two-column list, each point under a hairline rule. */
export function IncludedSection({ service, points }: IncludedSectionProps) {
  return (
    <Section spacing="lg" divider>
      <Container size="xl">
        <SectionHeading
          index="01"
          eyebrow="What’s included"
          title={
            <>
              Everything it takes, <em>in one team.</em>
            </>
          }
          description={service.summary}
        />
        <Stagger as="ol" className={styles.list}>
          {points.map((point, index) => (
            <StaggerItem as="li" key={point.title} className={styles.point}>
              <span className="label">({String(index + 1).padStart(2, '0')})</span>
              <h3 className={styles.title}>{point.title}</h3>
              <p className={styles.description}>{point.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  )
}
