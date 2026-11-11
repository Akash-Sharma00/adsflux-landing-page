import { useEffect, useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { loadScrollTrigger } from '@/lib/gsap'

export type ParallaxProps = {
  children: ReactNode
  /**
   * Travel in px across the element's pass through the viewport. Positive moves slower than the page
   * (sinks), negative moves faster (floats). Keep within ±120 for imagery (subtle parallax);
   * horizontal headline drift (axis="x") may go to ±200.
   */
  distance?: number
  /** y: vertical drift (default). x: horizontal drift — for opposing headline lines. */
  axis?: 'x' | 'y'
  /**
   * Degrees of rotation across the same pass, scrubbed with the drift — for decorative graphics (bursts, stamps)
   * only, never text or imagery. Composes with a CSS spin, which animates the separate `rotate` property.
   */
  rotate?: number
  className?: string
}

/** Scroll-linked drift (GSAP ScrollTrigger, scrubbed, lazy-loaded). Static under reduced motion. */
export function Parallax({ children, distance = 60, axis = 'y', rotate = 0, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion || (distance === 0 && rotate === 0)) return

    let isCancelled = false
    let revert: (() => void) | undefined

    loadScrollTrigger().then(({ gsap }) => {
      if (isCancelled) return
      const context = gsap.context(() => {
        gsap.fromTo(
          element,
          { [axis]: -distance / 2, rotation: -rotate / 2 },
          {
            [axis]: distance / 2,
            rotation: rotate / 2,
            ease: 'none',
            scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }, element)
      revert = () => context.revert()
    })

    return () => {
      isCancelled = true
      revert?.()
    }
  }, [prefersReducedMotion, distance, axis, rotate])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
