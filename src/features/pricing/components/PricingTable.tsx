import { Stagger, StaggerItem } from '@/components/motion'
import { Badge, ButtonLink } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { PricingTier } from '../content'
import styles from './PricingTable.module.css'

type PricingTableProps = {
  tiers: readonly PricingTier[]
}

/** Side-by-side engagement models. The featured tier is a true cobalt tone and carries the primary CTA. */
export function PricingTable({ tiers }: PricingTableProps) {
  return (
    <Stagger as="ul" className={styles.table}>
      {tiers.map((tier) => (
        <StaggerItem as="li" key={tier.name} className={styles.item}>
          <div
            data-theme={tier.featured ? 'cobalt' : undefined}
            className={cn(styles.tier, tier.featured && styles.featured)}
          >
            <div className={styles.header}>
              <h3 className={styles.name}>{tier.name}</h3>
              {tier.featured && <Badge variant="highlight">Most chosen</Badge>}
            </div>
            <p className={styles.description}>{tier.description}</p>
            <p className={styles.price}>
              <span className={styles.amount}>{tier.price}</span>
              {tier.period && <span className={styles.period}>{tier.period}</span>}
            </p>
            <ul className={styles.features}>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <ButtonLink
              href={tier.cta.href}
              variant={tier.featured ? 'primary' : 'secondary'}
              withArrow={tier.featured}
              className={styles.cta}
            >
              {tier.cta.label}
            </ButtonLink>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
