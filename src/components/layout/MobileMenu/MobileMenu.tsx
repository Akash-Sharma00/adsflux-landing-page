import { useEffect } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { AppLink, ButtonLink, Container } from '@/components/ui'
import { mainNav, primaryCta } from '@/config/navigation'
import { scalvoLinks } from '@/config/scalvo'
import { siteConfig } from '@/config/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { DURATION, EASE_OUT_EXPO, STAGGER_STEP } from '@/lib/motion'
import styles from './MobileMenu.module.css'

type MobileMenuProps = {
  id: string
  isOpen: boolean
  onClose: () => void
}

/** Full-screen cobalt sheet with serif links for < 1024px. Locks page scroll; Escape closes. */
const SHEET_CLOSED = { clipPath: 'inset(0% 0% 100% 0%)' }
const SHEET_OPEN = { clipPath: 'inset(0% 0% 0% 0%)' }

export function MobileMenu({ id, isOpen, onClose }: MobileMenuProps) {
  // MotionConfig only drops transforms; the clip-path wipe becomes a plain fade under reduced motion.
  const prefersReducedMotion = usePrefersReducedMotion()
  const closed = prefersReducedMotion ? { opacity: 0 } : SHEET_CLOSED
  const open = prefersReducedMotion ? { opacity: 1 } : SHEET_OPEN

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          id={id}
          data-theme="cobalt"
          className={styles.menu}
          initial={closed}
          animate={open}
          exit={closed}
          transition={{ duration: DURATION.slow, ease: EASE_OUT_EXPO }}
        >
          <Container size="xl" className={styles.inner}>
            <nav aria-label="Mobile">
              <ol className={styles.list}>
                {mainNav.map((item, index) => (
                  <m.li
                    key={item.label}
                    className={styles.item}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay: 0.1 + index * STAGGER_STEP }}
                  >
                    <span className={styles.index}>({String(index + 1).padStart(2, '0')})</span>
                    <AppLink href={item.href} className={styles.link} onClick={onClose}>
                      {item.label}
                    </AppLink>
                  </m.li>
                ))}
              </ol>
            </nav>
            <div className={styles.footer}>
              <div className={styles.actions}>
                <ButtonLink href={primaryCta.href} size="lg" withArrow onClick={onClose}>
                  {primaryCta.label}
                </ButtonLink>
                <ButtonLink href={scalvoLinks.login.href} variant="secondary" size="lg" onClick={onClose}>
                  {scalvoLinks.login.label}
                </ButtonLink>
              </div>
              <p className="label">{siteConfig.markets}</p>
            </div>
          </Container>
        </m.div>
      )}
    </AnimatePresence>
  )
}
