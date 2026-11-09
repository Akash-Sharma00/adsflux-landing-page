import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { loadScrollTrigger } from '@/lib/gsap'
import styles from './ScrollHighlightText.module.css'

export type ScrollHighlightTextProps = {
  text: string
  as?: 'h2' | 'p'
  className?: string
}

/**
 * Scroll storytelling: words brighten one by one as the passage scrolls through the viewport
 * (GSAP ScrollTrigger, scrubbed). GSAP is loaded lazily on first use. Reduced motion: static text.
 */
export function ScrollHighlightText({ text, as: Tag = 'p', className }: ScrollHighlightTextProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const words = text.split(' ')

  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion || !text) return

    let isCancelled = false
    let revert: (() => void) | undefined

    loadScrollTrigger().then(({ gsap }) => {
      if (isCancelled) return
      const context = gsap.context(() => {
        gsap.fromTo(
          root.querySelectorAll('[data-word]'),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: root, start: 'top 85%', end: 'bottom 45%', scrub: true },
          },
        )
      }, root)
      revert = () => context.revert()
    })

    return () => {
      isCancelled = true
      revert?.()
    }
  }, [prefersReducedMotion, text])

  return (
    <div ref={rootRef}>
      <Tag className={cn(styles.text, className)}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`} data-word="">
            {word}
            {index < words.length - 1 && ' '}
          </span>
        ))}
      </Tag>
    </div>
  )
}
