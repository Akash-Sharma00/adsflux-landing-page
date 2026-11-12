import { Reveal, TextReveal } from '@/components/motion'
import { AppLink, Burst, ButtonLink, Container, MediaFrame, Section } from '@/components/ui'
import { primaryCta } from '@/config/navigation'
import { homeAnchor, routes } from '@/config/routes'
import { scalvoLinks } from '@/config/scalvo'
import { services, type Service } from '@/config/services'
import { siteConfig } from '@/config/site'
import { lookForIndex } from '@/features/services'
import { cn } from '@/lib/cn'
import type { ServiceDetail } from '@/pages/service/types'
import styles from './ServiceHero.module.css'

type ServiceHeroProps = {
  service: Service
  detail: ServiceDetail
  /** Zero-based place in the catalogue — picks the number and the module look shared with the home page. */
  position: number
}

const formatIndex = (value: number) => String(value).padStart(2, '0')

/**
 * Editorial split hero: breadcrumb masthead; the search phrase as the grotesk <h1> lead with a serif punch
 * line; on the right, the service's module from the home page (same tone, number and art) as a pasted panel.
 */
export function ServiceHero({ service, detail, position }: ServiceHeroProps) {
  const look = lookForIndex(position)
  const number = formatIndex(position + 1)
  const secondaryAction = service.isOnScalvo
    ? { label: `Runs on ${scalvoLinks.overview.label}`, href: scalvoLinks.overview.href }
    : { label: 'All services', href: homeAnchor('services') }

  return (
    <Section spacing="none" texture className={styles.hero}>
      <Container size="xl" className={styles.inner}>
        <div className={styles.masthead}>
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumb}>
              <li>
                <AppLink href={routes.home} className="label">
                  Home
                </AppLink>
              </li>
              <li>
                <AppLink href={homeAnchor('services')} className="label">
                  Services
                </AppLink>
              </li>
              <li aria-current="page" className="label">
                {service.title}
              </li>
            </ol>
          </nav>
          <span className="label">
            ({number}/{formatIndex(services.length)}) · {siteConfig.markets}
          </span>
        </div>

        <div className={styles.copy}>
          {/* The keyword lead renders static (fast LCP, plain text for search); TextReveal carries its own screen-reader copy. */}
          <h1>
            <span className={styles.lead}>{service.seo.keyword}</span>
            <span className={styles.punch}>
              <TextReveal as="span" text={detail.punch.text} trigger="mount" />{' '}
              <em>
                <TextReveal as="span" text={detail.punch.emphasis} trigger="mount" delay={0.15} />
              </em>
              <Burst className={styles.burst} />
            </span>
          </h1>

          <Reveal trigger="mount" delay={0.4}>
            <p className={styles.intro}>{detail.intro}</p>
          </Reveal>
          <Reveal trigger="mount" delay={0.5} className={styles.actions}>
            <ButtonLink href={primaryCta.href} size="lg" withArrow>
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryAction.href} size="lg" variant="ghost" withArrow>
              {secondaryAction.label}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal trigger="mount" delay={0.2} className={styles.visual}>
          <div data-theme={look.tone} className={cn(styles.panel, look.tone === 'cream' && styles.outlined)} aria-hidden="true">
            <span className={styles.number}>{number}</span>
            <MediaFrame ratio="4/5" art={look.art} artTone={look.artTone} className={styles.art} />
            <ul className={styles.capabilities}>
              {service.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
