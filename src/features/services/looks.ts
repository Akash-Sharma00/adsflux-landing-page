import type { ArtTone, ArtVariant, SectionTone } from '@/components/ui'

export type ModuleSize = 'wide' | 'narrow' | 'third' | 'full'

export type ServiceLook = {
  /** Background tone of the module. */
  tone: SectionTone
  size: ModuleSize
  /** Preview composition and its (contrasting) tone. */
  art: ArtVariant
  artTone: ArtTone
}

/**
 * Visual identity per service, keyed by slug (content lives in @/config/services).
 * The sequence is composed as a set: wide+narrow, three thirds, narrow+wide, full — with one ink and
 * one orange module max. Reorder services and this rhythm still holds, because it follows position.
 */
export const MODULE_RHYTHM: readonly ServiceLook[] = [
  { tone: 'cobalt', size: 'wide', art: 'sun', artTone: 'peach' },
  { tone: 'peach', size: 'narrow', art: 'arch', artTone: 'cobalt' },
  { tone: 'cream', size: 'third', art: 'halftone', artTone: 'blue' },
  { tone: 'blue', size: 'third', art: 'stack', artTone: 'cream' },
  { tone: 'ink', size: 'third', art: 'burst', artTone: 'orange' },
  { tone: 'orange', size: 'narrow', art: 'stripes', artTone: 'cream' },
  { tone: 'cream', size: 'wide', art: 'stack', artTone: 'cobalt' },
  { tone: 'blue', size: 'full', art: 'sun', artTone: 'ink' },
]

const FALLBACK_LOOK: ServiceLook = { tone: 'cream', size: 'third', art: 'sun', artTone: 'blue' }

export const lookForIndex = (index: number): ServiceLook =>
  MODULE_RHYTHM[index % MODULE_RHYTHM.length] ?? FALLBACK_LOOK
