import { PageHead } from '@/components/layout'
import { Burst, ButtonLink, Container, Eyebrow, Section } from '@/components/ui'
import { routes } from '@/config/routes'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <Section spacing="none" texture className={styles.page}>
      <PageHead page="notFound" />
      <Container size="xl" className={styles.inner}>
        <Eyebrow index="404">Page not found</Eyebrow>
        <h1 className={styles.title}>
          This page is <em>easy to ignore.</em>
          <Burst className={styles.burst} />
        </h1>
        <p className={styles.body}>The link may be broken, or the page may have moved.</p>
        <ButtonLink href={routes.home} size="lg" withArrow>
          Back to home
        </ButtonLink>
      </Container>
    </Section>
  )
}
