import { useEffect, useState, type RefObject } from 'react'

/**
 * True once the element has been at least `amount` (0–1) visible, then stays true. False on the server and on
 * the first client render, so hydration matches. A light stand-in for motion's useInView in the initial bundle.
 */
export function useInViewOnce(ref: RefObject<Element | null>, amount = 0.5): boolean {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isInView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setIsInView(true)
        observer.disconnect()
      },
      { threshold: amount },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, amount, isInView])

  return isInView
}
