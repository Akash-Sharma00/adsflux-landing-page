/**
 * Breakpoints, mobile-first (min-width). CSS custom properties cannot be used inside
 * media queries, so CSS uses these literal values: `@media (min-width: 768px)`.
 * Keep the two in sync.
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

export const mediaQuery = (bp: Breakpoint) => `(min-width: ${breakpoints[bp]}px)`
