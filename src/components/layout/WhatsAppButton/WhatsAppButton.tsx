import { PlatformLogo } from '@/components/ui'
import { siteConfig, whatsappHref } from '@/config/site'
import styles from './WhatsAppButton.module.css'

/**
 * Floating WhatsApp button, bottom-right on every page: the official green WhatsApp logo as a round button.
 * Opens WhatsApp (app or web) in a new tab with a greeting pre-filled.
 */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label={`Chat with ${siteConfig.name} on WhatsApp, ${siteConfig.whatsapp.display} (opens in a new tab)`}
    >
      <PlatformLogo platform="whatsapp" className={styles.logo} />
    </a>
  )
}
