import { Stagger, StaggerItem } from '@/components/motion'
import { AppLink, Badge, MediaFrame } from '@/components/ui'
import { servicePath } from '@/config/routes'
import { scalvoLinks } from '@/config/scalvo'
import { serviceAnchorId, type Service } from '@/config/services'
import { cn } from '@/lib/cn'
import { lookForIndex } from '../looks'
import styles from './ServiceModules.module.css'

type ServiceModulesProps = {
  services: readonly Service[]
}

/**
 * Modular editorial grid: asymmetric blocks, each with its own tone, oversized serif number and an
 * art-directed preview — so every service is visually identifiable. Not a list, not a card grid.
 */
export function ServiceModules({ services }: ServiceModulesProps) {
  return (
    <Stagger as="ol" className={styles.grid}>
      {services.map((service, index) => {
        const look = lookForIndex(index)
        return (
          <StaggerItem
            as="li"
            key={service.slug}
            id={serviceAnchorId(service.slug)}
            className={cn(styles.module, styles[look.size], look.tone === 'cream' && styles.outlined)}
          >
            <article data-theme={look.tone} className={cn(styles.inner, 'media-hover')}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <MediaFrame
                className={styles.preview}
                ratio={look.size === 'wide' || look.size === 'full' ? '4/3' : '1/1'}
                art={look.art}
                artTone={look.artTone}
              />
              <div className={styles.body}>
                {service.isComingSoon && <Badge className={styles.soon}>Coming soon</Badge>}
                <h3 className={styles.title}>
                  {service.isComingSoon ? (
                    service.title
                  ) : (
                    <AppLink href={servicePath(service.slug)} className={styles.titleLink}>
                      {service.title}
                    </AppLink>
                  )}
                </h3>
                <p className={styles.summary}>{service.summary}</p>
                <ul className={styles.capabilities} aria-label={`${service.title} capabilities`}>
                  {service.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
                {service.isOnScalvo && !service.isComingSoon && (
                  <AppLink href={scalvoLinks.overview.href} className={styles.platformLink}>
                    Runs on {scalvoLinks.overview.label} →
                  </AppLink>
                )}
              </div>
            </article>
          </StaggerItem>
        )
      })}
    </Stagger>
  )
}
