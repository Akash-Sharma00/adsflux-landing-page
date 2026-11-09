import { lazy, Suspense } from 'react'
import { Container, Section } from '@/components/ui'
import { homeSections } from '@/config/routes'
import styles from './ShowcaseSection.module.css'

/**
 * Code-split: the home chunk is at its JS budget, and the collage (with its reels) is well below the fold.
 * The shell stays eager so the ink band and the #showcase anchor always exist.
 */
const ShowcaseGallery = lazy(() => import('./ShowcaseGallery').then((module) => ({ default: module.ShowcaseGallery })))

/** The gallery moment: the page's single ink band, so campaign colour does the talking. */
export function ShowcaseSection() {
  return (
    <Section id={homeSections.showcase} tone="ink" spacing="lg">
      <Container size="xl">
        <Suspense fallback={<div className={styles.fallback} />}>
          <ShowcaseGallery />
        </Suspense>
      </Container>
    </Section>
  )
}
