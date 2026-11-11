import { lazy, Suspense } from 'react'
import { Container, Section } from '@/components/ui'
import { homeSections } from '@/config/routes'
import styles from './WorkSection.module.css'

/**
 * Code-split: the home chunk is over its JS budget and the case studies sit well below the fold.
 * The shell stays eager so the soft-blue band and the #work anchor always exist.
 */
const WorkCaseStudies = lazy(() => import('./WorkCaseStudies').then((module) => ({ default: module.WorkCaseStudies })))

export function WorkSection() {
  return (
    <Section id={homeSections.work} tone="blue" spacing="lg" texture>
      <Container size="xl">
        <Suspense fallback={<div className={styles.fallback} />}>
          <WorkCaseStudies />
        </Suspense>
      </Container>
    </Section>
  )
}
