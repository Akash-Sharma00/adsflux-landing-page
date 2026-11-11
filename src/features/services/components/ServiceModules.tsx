import { Parallax, Stagger, StaggerItem } from '@/components/motion'
import { AppLink, Badge, MediaFrame } from '@/components/ui'
import { servicePath } from '@/config/routes'
import { scalvoLinks } from '@/config/scalvo'
import { serviceAnchorId, type Service } from '@/config/services'
import { cn } from '@/lib/cn'
import { lookForIndex } from '../looks'
import { imageForService } from '../serviceImages'
import styles from './ServiceModules.module.css'

/** Small previews are a fixed 6–10rem square; wide/full previews take roughly a third of the grid. */
const SMALL_PREVIEW_SIZES = '160px'
const LARGE_PREVIEW_SIZES = '(min-width: 768px) 33vw, 160px'

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
        const isLarge = look.size === 'wide' || look.size === 'full'
        return (
          <StaggerItem
            as="li"
            key={service.slug}
            id={serviceAnchorId(service.slug)}
            className={cn(
              styles.module,
              styles[look.size],
              look.tone === 'cream' && styles.outlined,
              look.tone === 'cobalt' && styles.liftAccent,
            )}
          >
            <article data-theme={look.tone} className={cn(styles.inner, 'media-hover')}>
              <Parallax distance={-40} className={styles.numberDrift}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </Parallax>
              <MediaFrame
                className={styles.preview}
                ratio={isLarge ? '4/3' : '1/1'}
                image={imageForService(service.slug)}
                sizes={isLarge ? LARGE_PREVIEW_SIZES : SMALL_PREVIEW_SIZES}
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
