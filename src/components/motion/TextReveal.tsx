import { Fragment } from 'react'
import { m, type Variants } from 'motion/react'
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion'
import styles from './TextReveal.module.css'

export type TextRevealProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  /** mount: play immediately (heroes). inView: play when scrolled into view. */
  trigger?: 'mount' | 'inView'
  delay?: number
  /** Seconds between words. */
  step?: number
  className?: string
}

type WordTiming = { delay: number; step: number; index: number }

const wordVariants: Variants = {
  // 125% clears the mask's descender padding so no glyph tops peek through before the reveal.
  hidden: { y: '125%' },
  visible: ({ delay, step, index }: WordTiming) => ({
    y: '0%',
    transition: { duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay: delay + index * step },
  }),
}

/**
 * Headline reveal: each word rises out of a mask. Screen readers get the plain sentence;
 * the animated words are aria-hidden. Under reduced motion the words simply appear.
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
  className,
}: TextRevealProps) {
  const words = text.split(' ')
  const playProps =
    trigger === 'mount'
      ? { animate: 'visible' }
      : { whileInView: 'visible', viewport: { once: true, amount: 0.5 } }

  return (
    <Tag className={className}>
      <span className="visually-hidden">{text}</span>
      <m.span aria-hidden="true" initial="hidden" {...playProps}>
        {words.map((word, index) => (
          // The space sits OUTSIDE the mask so lines can break between words.
          <Fragment key={`${word}-${index}`}>
            <span className={styles.mask}>
              <m.span className={styles.word} variants={wordVariants} custom={{ delay, step, index }}>
                {word}
              </m.span>
            </span>
            {index < words.length - 1 && ' '}
          </Fragment>
        ))}
      </m.span>
    </Tag>
  )
}
