/**
 * Reference data rendered by the /brand page. Values mirror src/styles/tokens.css — this is the one
 * component-side file allowed to spell out hex values (they are printed, never used for styling).
 */
import type { ArtTone, ArtVariant, SectionTone } from '@/components/ui'
import type { Theme } from '@/lib/theme'

/** The page's anchor targets, in order. Drives the sticky sub-nav. */
export const brandSections = [
  { id: 'logo', label: 'Logo' },
  { id: 'color', label: 'Color' },
  { id: 'type', label: 'Type' },
  { id: 'controls', label: 'Controls' },
  { id: 'forms', label: 'Forms' },
  { id: 'imagery', label: 'Imagery' },
  { id: 'modules', label: 'Modules' },
  { id: 'motion', label: 'Motion' },
] as const

export type BrandSectionId = (typeof brandSections)[number]['id']

/** Two-digit index for a section's eyebrow, e.g. "03". */
export const sectionIndex = (id: BrandSectionId) =>
  String(brandSections.findIndex((section) => section.id === id) + 1).padStart(2, '0')

// ---------------------------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------------------------

export type BrandColor = {
  name: string
  hex: string
  token: string
  role: string
  /** The scoped tone that paints this color as a background — so swatches never hard-code hex. */
  tone: SectionTone
  /** Target share of page surface, in percent (approximate). */
  share: number
}

export const brandColors: readonly BrandColor[] = [
  { name: 'Paper Cream', hex: '#F5F0E7', token: '--brand-cream', role: 'Default page background. Leads every page.', tone: 'cream', share: 55 },
  { name: 'Electric Cobalt', hex: '#263BDB', token: '--brand-cobalt', role: 'Big moments: heroes, manifesto, primary CTAs.', tone: 'cobalt', share: 16 },
  { name: 'Soft Blue', hex: '#DCE5FF', token: '--brand-blue', role: 'Supporting bands and compositions.', tone: 'blue', share: 10 },
  { name: 'Dusty Peach', hex: '#E8B8A5', token: '--brand-peach', role: 'Supporting bands, warm counterpoint.', tone: 'peach', share: 8 },
  { name: 'Ink Black', hex: '#171717', token: '--brand-ink', role: 'Typography. One gallery band per page, max.', tone: 'ink', share: 6 },
  { name: 'Signal Orange', hex: '#FF633E', token: '--brand-orange', role: 'Controlled accent: fills, bursts, stickers.', tone: 'orange', share: 5 },
]

/** The same six tones in dark mode ("Midnight Editorial"): what each swatch actually paints there. */
export const darkBrandColors: readonly BrandColor[] = [
  { name: 'Midnight', hex: '#11131B', token: '--brand-midnight', role: 'Dark page background. Cinematic, never pure black.', tone: 'cream', share: 55 },
  { name: 'Electric Cobalt', hex: '#263BDB', token: '--brand-cobalt', role: 'Still the big moment. Shapes lift to Electric #5268FF.', tone: 'cobalt', share: 16 },
  { name: 'Slate', hex: '#1D2230', token: '--brand-slate', role: 'Surfaces and supporting bands.', tone: 'blue', share: 10 },
  { name: 'Dusk', hex: '#262429', token: '--brand-dusk', role: 'Peach 10% over Midnight. The warm band; peach is its accent ink.', tone: 'peach', share: 8 },
  { name: 'Ink Black', hex: '#171717', token: '--brand-ink', role: 'The gallery wall: neutral black against blue-black.', tone: 'ink', share: 6 },
  { name: 'Ember', hex: '#FF754F', token: '--brand-ember', role: 'Signal Orange lifted for dark: fills, bursts, accent ink.', tone: 'orange', share: 5 },
]

export type DerivedTint = { name: string; hex: string; token: string; use: string }

export const derivedTints: readonly DerivedTint[] = [
  { name: 'Ink soft', hex: '#4F4D4B', token: '--brand-ink-soft', use: 'Muted text on cream, blue, peach' },
  { name: 'Cream soft', hex: '#CCCCE5', token: '--brand-cream-soft', use: 'Muted text on cobalt' },
  { name: 'Cream dim', hex: '#A7A49E', token: '--brand-cream-dim', use: 'Muted text on ink' },
]

export const darkDerivedTints: readonly DerivedTint[] = [
  { name: 'Mist', hex: '#A8A9BD', token: '--brand-mist', use: 'Muted text and control outlines on dark' },
  { name: 'Electric', hex: '#5268FF', token: '--brand-electric', use: 'Shapes, large type, offset shadows — never small text' },
  { name: 'Electric ink', hex: '#7B8AF9', token: '--brand-electric-ink', use: 'Accent text, links, focus on midnight and slate' },
  { name: 'Graphite', hex: '#353949', token: '--brand-graphite', use: 'Hairline borders on dark' },
  { name: 'Slate raised', hex: '#282C39', token: '--brand-slate-raised', use: 'Panels raised above a slate band' },
]

/** WCAG 2.x thresholds. */
export const AA_BODY = 4.5
export const AA_LARGE = 3

/** Color names used in the contrast table → the token that paints them (for the live sample). */
export const contrastTokens = {
  Ink: '--brand-ink',
  'Ink soft': '--brand-ink-soft',
  Cream: '--brand-cream',
  'Cream soft': '--brand-cream-soft',
  'Cream dim': '--brand-cream-dim',
  Cobalt: '--brand-cobalt',
  Orange: '--brand-orange',
  'Soft Blue': '--brand-blue',
  'Dusty Peach': '--brand-peach',
  Midnight: '--brand-midnight',
  Slate: '--brand-slate',
  Dusk: '--brand-dusk',
  Mist: '--brand-mist',
  Electric: '--brand-electric',
  'Electric ink': '--brand-electric-ink',
  Ember: '--brand-ember',
} as const

export type ContrastColor = keyof typeof contrastTokens

export type ContrastPair = {
  foreground: ContrastColor
  background: ContrastColor
  ratio: number
  /** Overrides the computed verdict — e.g. a pair that passes only for large text. */
  note?: string
}

/** Measured contrast ratios (WCAG 2.x relative luminance). */
export const contrastPairs: readonly ContrastPair[] = [
  { foreground: 'Ink', background: 'Cream', ratio: 15.79 },
  { foreground: 'Ink', background: 'Soft Blue', ratio: 14.25 },
  { foreground: 'Ink', background: 'Dusty Peach', ratio: 10.1 },
  { foreground: 'Ink soft', background: 'Cream', ratio: 7.41 },
  { foreground: 'Cream dim', background: 'Ink', ratio: 7.21 },
  { foreground: 'Cream', background: 'Cobalt', ratio: 6.77 },
  { foreground: 'Cobalt', background: 'Cream', ratio: 6.77 },
  { foreground: 'Cobalt', background: 'Soft Blue', ratio: 6.11 },
  { foreground: 'Ink', background: 'Orange', ratio: 6.07 },
  { foreground: 'Cream soft', background: 'Cobalt', ratio: 4.88 },
  { foreground: 'Cobalt', background: 'Dusty Peach', ratio: 4.33, note: 'Large text only' },
  { foreground: 'Orange', background: 'Cream', ratio: 2.6, note: 'Never as text — fill only' },
  { foreground: 'Orange', background: 'Cobalt', ratio: 2.6, note: 'Shapes only' },
  { foreground: 'Ink', background: 'Cobalt', ratio: 2.33, note: 'Never' },
  { foreground: 'Cream', background: 'Soft Blue', ratio: 1.11, note: 'Never' },
]

/** Dark-mode pairs (Midnight Editorial). Same method, same thresholds. */
export const darkContrastPairs: readonly ContrastPair[] = [
  { foreground: 'Cream', background: 'Midnight', ratio: 16.33 },
  { foreground: 'Cream', background: 'Slate', ratio: 13.98 },
  { foreground: 'Cream', background: 'Dusk', ratio: 13.54 },
  { foreground: 'Mist', background: 'Midnight', ratio: 8.01 },
  { foreground: 'Mist', background: 'Slate', ratio: 6.86 },
  { foreground: 'Mist', background: 'Dusk', ratio: 6.64 },
  { foreground: 'Dusty Peach', background: 'Dusk', ratio: 8.66 },
  { foreground: 'Ember', background: 'Midnight', ratio: 6.98 },
  { foreground: 'Midnight', background: 'Ember', ratio: 6.98 },
  { foreground: 'Ink', background: 'Ember', ratio: 6.75 },
  { foreground: 'Cream', background: 'Cobalt', ratio: 6.77 },
  { foreground: 'Electric ink', background: 'Midnight', ratio: 6.04 },
  { foreground: 'Electric ink', background: 'Slate', ratio: 5.17 },
  { foreground: 'Electric', background: 'Midnight', ratio: 4.22, note: 'Large text and shapes only' },
  { foreground: 'Cream', background: 'Electric', ratio: 3.87, note: 'Never as button text' },
  { foreground: 'Cobalt', background: 'Midnight', ratio: 2.41, note: 'Fill only — never text' },
]

export type ToneSample = { tone: SectionTone; name: string; darkName: string; use: string }

export const toneSamples: readonly ToneSample[] = [
  { tone: 'cream', name: 'Cream', darkName: 'Midnight', use: 'Default. Most of every page.' },
  { tone: 'cobalt', name: 'Cobalt', darkName: 'Cobalt', use: 'Hero moments, manifesto, contact.' },
  { tone: 'blue', name: 'Soft Blue', darkName: 'Slate', use: 'Supporting band — work, details.' },
  { tone: 'peach', name: 'Peach', darkName: 'Dusk', use: 'Supporting band — people, quotes.' },
  { tone: 'orange', name: 'Orange', darkName: 'Ember', use: 'Rare and loud — tickers, stickers.' },
  { tone: 'ink', name: 'Ink', darkName: 'Ink', use: 'One gallery wall per page, max.' },
]

/** Everything the colour reference shows, for the active mode. */
export function colorReference(theme: Theme) {
  const isDark = theme === 'dark'
  return {
    modeName: isDark ? 'Midnight Editorial — dark mode' : 'Electric Editorial — light mode',
    colors: isDark ? darkBrandColors : brandColors,
    tints: isDark ? darkDerivedTints : derivedTints,
    contrastPairs: isDark ? darkContrastPairs : contrastPairs,
    toneName: (sample: ToneSample) => (isDark ? sample.darkName : sample.name),
  }
}

// ---------------------------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------------------------

export type TypeFamily = {
  name: string
  token: string
  weights: string
  role: string
  specimen: string
  variant: 'display' | 'heading' | 'body' | 'mono'
}

export const typeFamilies: readonly TypeFamily[] = [
  { name: 'Instrument Serif', token: '--font-display', weights: '400 roman + italic', role: 'Display lines, hero punch, the <em> accent', specimen: 'Make people care.', variant: 'display' },
  { name: 'Space Grotesk', token: '--font-heading', weights: '500 · 700', role: 'Section headings, buttons, navigation', specimen: 'Strategy that earns attention.', variant: 'heading' },
  { name: 'DM Sans', token: '--font-body', weights: '400 · 500 · 600', role: 'Body copy, descriptions, forms', specimen: 'Strategy, storytelling and performance — one growth partner for ambitious brands.', variant: 'body' },
  { name: 'DM Mono', token: '--font-mono', weights: '400 · 500', role: 'Labels, indexes, metadata, captions', specimen: '(01) Campaign — 9:16 — 2026', variant: 'mono' },
]

export type TypeStep = {
  token: string
  name: string
  spec: string
  sample: string
  /** CSS Module class that applies the step (see TypographySection.module.css). */
  step: 'stepDisplay' | 'stepFourXl' | 'stepThreeXl' | 'stepTwoXl' | 'stepXl' | 'stepLg' | 'stepBase' | 'stepSm' | 'stepXs'
}

export const typeScale: readonly TypeStep[] = [
  { token: '--text-display', name: 'Display', spec: 'Serif 400 · 52→176px · 0.9', sample: 'Ignore this.', step: 'stepDisplay' },
  { token: '--text-4xl', name: '4xl', spec: 'Serif 400 · 44→100px', sample: 'Made to be felt.', step: 'stepFourXl' },
  { token: '--text-3xl', name: '3xl · h2', spec: 'Grotesk 500 · 32→60px', sample: 'Campaigns that earn the scroll.', step: 'stepThreeXl' },
  { token: '--text-2xl', name: '2xl · h3', spec: 'Grotesk 500 · 24→36px', sample: 'Performance marketing', step: 'stepTwoXl' },
  { token: '--text-xl', name: 'xl · h4', spec: 'Grotesk 500 · 20→26px', sample: 'Creative that converts', step: 'stepXl' },
  { token: '--text-lg', name: 'lg · lead', spec: 'DM Sans 400 · 18→22px', sample: 'We combine strategy, storytelling and performance to help ambitious brands grow.', step: 'stepLg' },
  { token: '--text-base', name: 'base · body', spec: 'DM Sans 400 · 17px · 1.6', sample: 'Short paragraphs. Say one thing well, then stop — the work should do the talking.', step: 'stepBase' },
  { token: '--text-sm', name: 'sm · meta', spec: 'DM Sans 400 · 14px', sample: 'Captions, meta and supporting detail.', step: 'stepSm' },
  { token: '--text-xs', name: 'xs · label', spec: 'DM Mono 400 · 12px · caps · 0.06em', sample: '(04) Selected work', step: 'stepXs' },
]

// ---------------------------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------------------------

export const logoDos = [
  'Use the outlined SVG — it never depends on font loading.',
  'Let the tone pick the colors: ink on light tones, cream on cobalt and ink.',
  'Keep clear space of at least the signal block’s width on every side.',
  'Below 96px wide, switch to the monogram tile.',
] as const

export const logoDonts = [
  'Retype “adsflux” in Space Grotesk or any other font.',
  'Stretch, skew, rotate or re-space the letters, or move the block back inside the frame.',
  'Recolor the signal block outside the tone pairs shown here.',
  'Add effects — shadows, glows, outlines, gradients.',
  'Place it on busy imagery; use a solid band or the monogram.',
] as const

export const logoFiles = [
  'adsflux-wordmark-ink.svg',
  'adsflux-wordmark-cobalt.svg',
  'adsflux-wordmark-cream.svg',
  'adsflux-wordmark-mono-ink.svg',
  'adsflux-monogram-cobalt.svg',
  'adsflux-monogram-cream.svg',
  'adsflux-monogram-orange.svg',
] as const

export const FAVICON_SIZES = [16, 32, 48, 64] as const

// ---------------------------------------------------------------------------------------------
// Imagery
// ---------------------------------------------------------------------------------------------

export type ArtSample = { variant: ArtVariant; tone: ArtTone; label: string }

export const artSamples: readonly ArtSample[] = [
  { variant: 'sun', tone: 'peach', label: 'Sun' },
  { variant: 'arch', tone: 'cobalt', label: 'Arch' },
  { variant: 'stripes', tone: 'blue', label: 'Stripes' },
  { variant: 'halftone', tone: 'cream', label: 'Halftone' },
  { variant: 'burst', tone: 'orange', label: 'Burst' },
  { variant: 'stack', tone: 'ink', label: 'Stack' },
]

// ---------------------------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------------------------

export const motionTokens = [
  { token: '--duration-fast', value: '150ms', use: 'Hover color, underline' },
  { token: '--duration-base', value: '280ms', use: 'Buttons, dropdown panel' },
  { token: '--duration-slow', value: '600ms', use: 'Arrow spin, logo nudge, lift' },
  { token: '--duration-reveal', value: '1000ms', use: 'Entrances, image wipes' },
  { token: '--ease-out-expo', value: 'cubic-bezier(0.16, 1, 0.3, 1)', use: 'Everything that arrives' },
  { token: '--ease-standard', value: 'cubic-bezier(0.2, 0, 0, 1)', use: 'State changes' },
] as const

export const reducedMotionRules = [
  'MotionConfig reducedMotion="user": entrances keep their fade, drop the movement.',
  'Parallax and ScrollHighlightText render static — GSAP never loads.',
  'Marquee stops and wraps; the duplicate track is removed.',
  'Burst and Stamp stop spinning; videos show the poster with controls.',
  'Smooth anchor scrolling switches to instant.',
] as const
