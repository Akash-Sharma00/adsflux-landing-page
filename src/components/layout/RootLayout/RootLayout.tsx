import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { ScrollManager } from '../ScrollManager'
import { SiteFooter } from '../SiteFooter'
import { SiteHeader } from '../SiteHeader'
import styles from './RootLayout.module.css'

/** App shell shared by every route: skip link, header, main landmark, footer. */
export function RootLayout() {
  return (
    <div id="top" className={styles.shell}>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className={styles.main}>
        <Suspense fallback={<div className={styles.loading} aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
      <ScrollManager />
    </div>
  )
}
