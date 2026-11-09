/**
 * Motion constants for JS animation (motion/react, GSAP). Mirrors the CSS tokens in
 * src/styles/tokens.css — keep both in sync. Durations are in seconds.
 */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_STANDARD = [0.2, 0, 0, 1] as const

export const DURATION = {
  fast: 0.15,
  base: 0.28,
  slow: 0.6,
  reveal: 1,
} as const

/** Delay between siblings in a staggered entrance. */
export const STAGGER_STEP = 0.08

/** Distance (px) content travels during a reveal. Keep it small — motion should be felt, not watched. */
export const REVEAL_DISTANCE = 32

/** GSAP equivalent of EASE_OUT_EXPO. */
export const GSAP_EASE = 'expo.out'
