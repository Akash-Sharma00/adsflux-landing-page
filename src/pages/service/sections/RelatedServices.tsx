import { AppLink, Container, Section, SectionHeading } from '@/components/ui'
import { servicePath } from '@/config/routes'
import { services } from '@/config/services'
import styles from './RelatedServices.module.css'

type RelatedServicesProps = {
  currentSlug: string
}

/** Blue band linking every other service page — how visitors (and crawlers) move between services. */
export function RelatedServices({ currentSlug }: RelatedServicesProps) {
  return (
    <Section tone="blue" spacing="lg">
      <Container size="xl">
        <SectionHeading
          index="04"
          eyebrow="More services"
          title={
            <>
              Works best <em>together.</em>
            </>
          }
          description="Strategy sets the direction. Creative earns the attention. Performance turns it into growth."
        />
        <ul className={styles.list}>
          {services.map((service, index) =>
            service.slug === currentSlug ? null : (
              <li key={service.slug}>
                <AppLink href={servicePath(service.slug)} className={styles.link}>
                  <span className="label">({String(index + 1).padStart(2, '0')})</span>
                  <span className={styles.title}>{service.title}</span>
                  <span className={styles.summary}>{service.summary}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </AppLink>
              </li>
            ),
          )}
        </ul>
      </Container>
    </Section>
  )
}
