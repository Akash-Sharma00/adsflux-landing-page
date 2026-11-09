import type { ReactNode } from 'react'
import { Container, Section, SectionHeading, type SectionTone } from '@/components/ui'
import { brandSections, sectionIndex, type BrandSectionId } from '../brandData'
import styles from './BrandSection.module.css'

type BrandSectionProps = {
  id: BrandSectionId
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  tone?: SectionTone
  texture?: boolean
  divider?: boolean
  children: ReactNode
}

/** One chapter of the brand reference: toned Section + numbered editorial heading from the sub-nav list. */
export function BrandSection({ id, title, description, actions, tone, texture, divider, children }: BrandSectionProps) {
  const label = brandSections.find((section) => section.id === id)?.label

  return (
    <Section id={id} tone={tone} texture={texture} divider={divider} spacing="lg" className={styles.section}>
      <Container size="xl">
        <SectionHeading index={sectionIndex(id)} eyebrow={label} title={title} description={description} actions={actions} />
        {children}
      </Container>
    </Section>
  )
}
