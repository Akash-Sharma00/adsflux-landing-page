import { AppLink, Container, Section, SectionHeading } from '@/components/ui'
import { cn } from '@/lib/cn'
import { servicePath } from '@/config/routes'
import { services } from '@/config/services'
import styles from './RelatedServices.module.css'

type RelatedServicesProps = {
  currentSlug: string
}

/**
 * Blue band linking every other service page — how visitors (and crawlers) move between services.
 * Coming-soon services are listed without a link.
 */
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
          {services.map((service, index) => {
            if (service.slug === currentSlug) return null
            const number = <span className="label">({String(index + 1).padStart(2, '0')})</span>
            const title = <span className={styles.title}>{service.title}</span>
            const summary = <span className={styles.summary}>{service.summary}</span>
            return (
              <li key={service.slug}>
                {service.isComingSoon ? (
                  <div className={cn(styles.link, styles.pending)}>
                    {number}
                    {title}
                    {summary}
                    <span className={cn('label', styles.soon)}>Coming soon</span>
                  </div>
                ) : (
                  <AppLink href={servicePath(service.slug)} className={styles.link}>
                    {number}
                    {title}
                    {summary}
                    <span className={styles.arrow} aria-hidden="true">
                      →
                    </span>
                  </AppLink>
                )}
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
