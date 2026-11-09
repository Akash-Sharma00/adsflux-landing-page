import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { AppLink, ButtonLink, Container, Dropdown, Wordmark } from '@/components/ui'
import { mainNav, primaryCta } from '@/config/navigation'
import { routes } from '@/config/routes'
import { scalvoLinks } from '@/config/scalvo'
import { siteConfig } from '@/config/site'
import { MobileMenu } from '../MobileMenu'
import { ThemeToggle } from '../ThemeToggle'
import styles from './SiteHeader.module.css'

const SCROLL_THRESHOLD = 8

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const locationKey = location.pathname + location.hash
  const [openedAt, setOpenedAt] = useState(locationKey)

  // Close the mobile menu whenever navigation happens (incl. back/forward and hash changes).
  // Adjusting state during render avoids an extra effect-driven render.
  if (openedAt !== locationKey) {
    setOpenedAt(locationKey)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={styles.header} data-scrolled={isScrolled}>
      <Container size="xl" className={styles.inner}>
        <AppLink href={routes.home} className={styles.brand} aria-label={`${siteConfig.name} — home`}>
          <Wordmark title="" className={styles.wordmark} />
        </AppLink>

        <nav aria-label="Main" className={styles.nav}>
          <ol className={styles.navList}>
            {mainNav.map((item, index) => (
              <li key={item.label} className={styles.navItem}>
                <span className={styles.navIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.children ? (
                  <Dropdown label={item.label} items={item.children} columns={2} />
                ) : (
                  <AppLink href={item.href} className={styles.navLink}>
                    {item.label}
                  </AppLink>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <ButtonLink href={scalvoLinks.login.href} variant="ghost" size="sm" className={styles.login}>
            {scalvoLinks.login.label}
          </ButtonLink>
          <ButtonLink href={primaryCta.href} size="sm" withArrow className={styles.cta}>
            {primaryCta.label}
          </ButtonLink>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className={styles.menuLabel}>{isMenuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </Container>

      <MobileMenu id="mobile-menu" isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  )
}
