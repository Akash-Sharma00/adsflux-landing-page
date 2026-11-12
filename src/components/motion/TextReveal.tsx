import { Fragment, useRef, type CSSProperties } from 'react'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/cn'
import styles from './TextReveal.module.css'

export type TextRevealProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  /** mount: play from the first paint, before JS loads (heroes). inView: play when scrolled into view. */
  trigger?: 'mount' | 'inView'
  delay?: number
  /** Seconds between words. */
  step?: number
  /**
   * False when the parent already carries the sentence for screen readers (several TextReveals inside one
   * aria-hidden heading), so the text isn't in the markup twice.
   */
  hasScreenReaderCopy?: boolean
  className?: string
}

/**
 * Headline reveal: each word rises out of a mask. Screen readers and crawlers get the plain sentence once;
 * the animated words are aria-hidden and drawn from `data-word` by CSS, so they don't repeat it in the
 * page's text. A CSS animation (not JS): `mount` reveals start with the first paint. Under reduced motion the
 * words simply appear.
 *
 * The in-view observer sits on the visible wrapper, not on the words: a word translated inside
 * its overflow-hidden mask is fully clipped, so observing it directly would never fire.
 */
export function TextReveal({
  text,
  as: Tag = 'h2',
  trigger = 'inView',
  delay = 0,
  step = 0.06,
  hasScreenReaderCopy = true,
  className,
}: TextRevealProps) {
  const wordsRef = useRef<HTMLSpanElement>(null)
  const isInView = useInViewOnce(wordsRef, 0.5)
  const isPlaying = trigger === 'mount' || isInView
  const words = text.split(' ')
  const timing = { '--reveal-delay': `${delay}s`, '--reveal-step': `${step}s` } as CSSProperties

  return (
    <Tag className={className}>
      {hasScreenReaderCopy && <span className="visually-hidden">{text}</span>}
      <span ref={wordsRef} aria-hidden="true" className={cn(isPlaying && styles.isPlaying)} style={timing}>
        {words.map((word, index) => (
          // The space sits OUTSIDE the mask so lines can break between words.
          <Fragment key={`${word}-${index}`}>
            <span className={styles.mask}>
              <span className={styles.word} data-word={word} />
            </span>
            {index < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
