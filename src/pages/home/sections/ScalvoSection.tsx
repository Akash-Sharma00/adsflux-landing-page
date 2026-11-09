import { lazy, Suspense } from 'react'
import { Container, Section } from '@/components/ui'
import { homeSections } from '@/config/routes'
import styles from './ScalvoSection.module.css'

/** Code-split: the home chunk is at its JS budget. The shell stays eager so the #scalvo anchor always exists. */
const ScalvoPlatform = lazy(() => import('./ScalvoPlatform').then((module) => ({ default: module.ScalvoPlatform })))

/** Peach platform band between Services and the ink Showcase: what brands get inside Scalvo. */
export function ScalvoSection() {
  return (
    <Section id={homeSections.scalvo} tone="peach" spacing="lg" texture className={styles.section}>
      <Container size="xl">
        <Suspense fallback={<div className={styles.fallback} />}>
          <ScalvoPlatform />
        </Suspense>
      </Container>
    </Section>
  )
}
