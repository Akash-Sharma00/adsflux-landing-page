import type { RefObject } from 'react'
import { usePointerDepth } from './usePointerDepth'

/**
 * Renders nothing: wires pointer depth onto the stage. A component (not a direct hook call in
 * HeroCollage) so it can be lazy-loaded — the pointer effect isn't needed for the first paint.
 */
export function HeroPointerDepth({ target }: { target: RefObject<HTMLElement | null> }) {
  usePointerDepth(target)
  return null
}
