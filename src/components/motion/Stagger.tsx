import type { ReactNode } from 'react'
import { m, type Variants } from 'motion/react'
import { DURATION, EASE_OUT_EXPO, REVEAL_DISTANCE, STAGGER_STEP } from '@/lib/motion'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_STEP } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE_OUT_EXPO } },
}

const containerTags = { div: m.div, ul: m.ul, ol: m.ol } as const
const itemTags = { div: m.div, li: m.li } as const

export type StaggerProps = {
  children: ReactNode
  as?: keyof typeof containerTags
  className?: string
}

/** Parent for a staggered entrance. Children must be <StaggerItem>. */
export function Stagger({ children, as = 'div', className }: StaggerProps) {
  const Tag = containerTags[as]
  return (
    <Tag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Tag>
  )
}

export type StaggerItemProps = {
  children: ReactNode
  as?: keyof typeof itemTags
  className?: string
  id?: string
}

export function StaggerItem({ children, as = 'div', className, id }: StaggerItemProps) {
  const Tag = itemTags[as]
  return (
    <Tag className={className} id={id} variants={itemVariants}>
      {children}
    </Tag>
  )
}
