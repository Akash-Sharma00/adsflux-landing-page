import { Container } from '@/components/ui'
import { brandSections } from '../brandData'
import styles from './BrandSubnav.module.css'

/** Sticky chapter index under the site header. Scrolls horizontally on small screens. */
export function BrandSubnav() {
  return (
    <div className={styles.subnav}>
      <Container size="xl" className={styles.inner}>
        <span className={styles.title} aria-hidden="true">
          Index
        </span>
        <nav aria-label="Brand system sections" className={styles.nav}>
          <ol className={styles.list}>
            {brandSections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.link}>
                  <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </div>
  )
}
