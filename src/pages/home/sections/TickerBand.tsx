import { Marquee } from '@/components/motion'
import { Section } from '@/components/ui'
import { services } from '@/config/services'
import styles from './TickerBand.module.css'

/** Orange signal band between hero and services — the one loud strip on the page. Coming-soon services carry a tag. */
export function TickerBand() {
  const items = services.map((service) =>
    service.isComingSoon ? (
      <>
        {service.title} <span className={styles.soon}>(soon)</span>
      </>
    ) : (
      service.title
    ),
  )

  return (
    <Section tone="orange" spacing="none" className={styles.band} aria-label="What we do">
      <Marquee className={styles.marquee} items={items} duration={55} />
    </Section>
  )
}
