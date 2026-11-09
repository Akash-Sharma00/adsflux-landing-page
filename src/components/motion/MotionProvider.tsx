import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'

const loadFeatures = () => import('./motionFeatures').then((module) => module.default)

/**
 * App-wide motion setup.
 * - LazyMotion loads the animation engine (domAnimation) asynchronously after first paint, so
 *   it is not in the initial bundle. `strict` forbids the heavy `motion.*` components — always
 *   use `m.*`.
 * - reducedMotion="user" drops transform animations for users who ask for less motion
 *   (opacity fades still run).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
