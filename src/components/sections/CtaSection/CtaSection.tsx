import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion'
import { Burst, ButtonLink, Container, Eyebrow, Section, type SectionTone } from '@/components/ui'
import styles from './CtaSection.module.css'

export type CtaSectionProps = {
  /** Serif display line. Wrap the key phrase in <em> for the italic accent. */
  title: ReactNode
  eyebrow?: string
  description?: string
  primaryAction: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  /** cobalt (default) for big closes; orange, peach or blue for secondary CTA bands. */
  tone?: Extract<SectionTone, 'cobalt' | 'orange' | 'peach' | 'blue'>
  id?: string
}

/** Typography-led closing block. One primary CTA, optional secondary. */
export function CtaSection({
  title,
  eyebrow,
  description,
  primaryAction,
  secondaryAction,
  tone = 'cobalt',
  id,
}: CtaSectionProps) {
  return (
    <Section id={id} tone={tone} spacing="lg" texture className={styles.section}>
      <Container size="xl" className={styles.inner}>
        <Reveal className={styles.main}>
          {eyebrow && <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>}
          <h2 className={styles.title}>{title}</h2>
        </Reveal>
        <Reveal delay={0.15} className={styles.aside}>
          {description && <p className={styles.description}>{description}</p>}
          <div className={styles.actions}>
            <ButtonLink href={primaryAction.href} size="lg" withArrow>
              {primaryAction.label}
            </ButtonLink>
            {secondaryAction && (
              <ButtonLink href={secondaryAction.href} size="lg" variant="secondary">
                {secondaryAction.label}
              </ButtonLink>
            )}
          </div>
        </Reveal>
        <Burst className={styles.burst} rays={12} spin />
      </Container>
    </Section>
  )
}
