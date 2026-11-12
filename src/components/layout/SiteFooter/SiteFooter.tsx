import { AppLink, ButtonLink, Container, Monogram, PlatformLogo, Wordmark } from '@/components/ui'
import { footerNav, primaryCta } from '@/config/navigation'
import { siteConfig, whatsappHref } from '@/config/site'
import { cn } from '@/lib/cn'
import styles from './SiteFooter.module.css'

const currentYear = new Date().getFullYear()

/** Soft-blue signature block: wordmark + manifesto line, contact, socials, navigation, colophon. */
export function SiteFooter() {
  return (
    <footer className={styles.footer} data-theme="blue">
      <Container size="xl">
        <div className={styles.signature}>
          <Wordmark title="" className={styles.wordmark} />
          <p className={styles.manifesto}>
            Strategy, storytelling <em>and</em> performance — for brands with something to say.
          </p>
          <ButtonLink href={primaryCta.href} withArrow className={styles.cta}>
            {primaryCta.label}
          </ButtonLink>
        </div>

        <div className={styles.columns}>
          <div className={styles.group}>
            <h2 className={styles.groupTitle}>Contact</h2>
            {siteConfig.email ? (
              <a href={`mailto:${siteConfig.email}`} className={styles.email}>
                {siteConfig.email}
              </a>
            ) : (
              <AppLink href={primaryCta.href} className={styles.email}>
                Send us a brief
              </AppLink>
            )}
            <AppLink href={whatsappHref} className={styles.whatsapp} aria-label={`WhatsApp ${siteConfig.whatsapp.display} (opens in a new tab)`}>
              <PlatformLogo platform="whatsapp" className={styles.whatsappLogo} />
              {siteConfig.whatsapp.display}
            </AppLink>
            <p className={styles.meta}>{siteConfig.markets}</p>
          </div>

          <nav aria-label="Social" className={styles.group}>
            <h2 className={styles.groupTitle}>Social</h2>
            <ul className={styles.links}>
              {siteConfig.socials.map((social) => (
                <li key={social.label}>
                  {social.href ? (
                    <AppLink href={social.href} className={cn(styles.link, styles.socialLink)}>
                      <PlatformLogo platform={social.platform} />
                      {social.label} ↗
                    </AppLink>
                  ) : (
                    <span className={cn(styles.pending, styles.socialPending)}>
                      <PlatformLogo platform={social.platform} />
                      <span>
                        {social.label} <span className={styles.soon}>soon</span>
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title} className={styles.group}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <ul className={styles.links}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href === undefined ? (
                      <span className={styles.pending}>
                        {link.label} <span className={styles.soon}>{link.tag}</span>
                      </span>
                    ) : (
                      <AppLink href={link.href} className={styles.link}>
                        {link.label}
                      </AppLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.colophon}>
          <Monogram className={styles.monogram} />
          <p className="label">
            © {currentYear} {siteConfig.name}. Made in India, for the world.
          </p>
          <a href="#top" className={`label ${styles.top}`}>
            Back to top ↑
          </a>
        </div>
      </Container>
    </footer>
  )
}
