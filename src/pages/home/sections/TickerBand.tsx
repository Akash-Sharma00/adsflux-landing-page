import { Marquee } from '@/components/motion'
import { Section } from '@/components/ui'
import { services } from '@/config/services'
import styles from './TickerBand.module.css'

/** Orange signal band between hero and services — the one loud strip on the page. */
export function TickerBand() {
  return (
    <Section tone="orange" spacing="none" className={styles.band} aria-label="What we do">
      <Marquee className={styles.marquee} items={services.map((service) => service.title)} duration={55} />
    </Section>
  )
}
