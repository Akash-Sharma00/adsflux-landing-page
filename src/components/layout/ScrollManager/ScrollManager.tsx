import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Scroll behavior for client-side navigation:
 * - new path without a hash → top of the page (same-page navigation keeps its position)
 * - URL with a hash → the matching element (also after a lazy route renders)
 * Smoothness comes from CSS `scroll-behavior`, which is disabled under reduced motion.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const isNewPage = previousPathname.current !== pathname
    previousPathname.current = pathname

    if (!hash) {
      if (isNewPage) window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      target?.scrollIntoView()
      return Boolean(target)
    }
    if (scrollToTarget()) return

    // Target not rendered yet (lazy route): retry on the next frame.
    const frame = requestAnimationFrame(scrollToTarget)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
