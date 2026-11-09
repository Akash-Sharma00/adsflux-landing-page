import { useEffect, type RefObject } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const FINE_HOVER = '(hover: hover) and (pointer: fine)'

/**
 * Writes the pointer's position over `ref` as CSS variables --mx / --my (each -1…1, 0 at rest), so
 * layers can shift by their own depth in CSS. Updates once per frame and never re-renders React.
 * Off for touch screens and under reduced motion.
 */
export function usePointerDepth(ref: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion || !window.matchMedia(FINE_HOVER).matches) return

    let frame = 0
    const setPosition = (x: number, y: number) => {
      element.style.setProperty('--mx', x.toFixed(3))
      element.style.setProperty('--my', y.toFixed(3))
    }
    const handleMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = element.getBoundingClientRect()
        const toRange = (value: number) => Math.min(Math.max(value * 2 - 1, -1), 1)
        setPosition(toRange((event.clientX - box.left) / box.width), toRange((event.clientY - box.top) / box.height))
      })
    }
    const handleLeave = () => {
      cancelAnimationFrame(frame)
      setPosition(0, 0)
    }

    element.addEventListener('pointermove', handleMove)
    element.addEventListener('pointerleave', handleLeave)
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', handleMove)
      element.removeEventListener('pointerleave', handleLeave)
    }
  }, [ref, prefersReducedMotion])
}
