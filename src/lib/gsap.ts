/**
 * Lazy-loads GSAP + ScrollTrigger so they never land in the initial bundle — and not before the page has
 * finished loading and the browser is idle, so they never compete with the LCP image or fonts.
 * Only scroll-storytelling components should call this.
 */
type ScrollTriggerModules = {
  gsap: typeof import('gsap').gsap
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}

/** Shared across callers: GSAP is fetched and registered once. */
let pending: Promise<ScrollTriggerModules> | null = null

function whenIdleAfterLoad(): Promise<void> {
  return new Promise((resolve) => {
    const scheduleIdle = () => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 1500 })
      else setTimeout(resolve, 200)
    }
    if (document.readyState === 'complete') scheduleIdle()
    else window.addEventListener('load', scheduleIdle, { once: true })
  })
}

export function loadScrollTrigger(): Promise<ScrollTriggerModules> {
  pending ??= whenIdleAfterLoad().then(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    gsap.registerPlugin(ScrollTrigger)
    return { gsap, ScrollTrigger }
  })
  return pending
}
