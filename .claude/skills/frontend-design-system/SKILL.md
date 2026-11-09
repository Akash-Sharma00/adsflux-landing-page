---
name: frontend-design-system
description: The mechanics of adsflux's design system in code — token tiers, the six scoped tones (data-theme / Section tone), CSS Modules + cascade layers, utilities, how to build or extend a UI primitive, responsive and accessibility implementation. Use whenever writing CSS or a component in src/, adding a token, adding a primitive to src/components/ui, or debugging styling/tone issues. For brand rules (colours, fonts, voice, what to avoid) load the adsflux-brand skill too.
---

# adsflux Design System — implementation mechanics

Brand rules (the six colours, tones, fonts, layout and motion taste) live in the **adsflux-brand** skill and
`docs/brand/`. This skill covers *how* to implement them. Full reference: `docs/brand/DESIGN_SYSTEM.md`; live: `/brand`.

Flow: **tokens → primitives → compositions**. Never skip a level.

```
src/styles/tokens.css      palette + semantic tokens per tone + scales (only file with hex values)
src/styles/base.css        element defaults (headings, <em> serif accent, links, focus)
src/styles/utilities.css   .display .label .highlight .accent .paper .visually-hidden
src/components/ui/*        primitives          src/components/motion/*    motion primitives
src/components/sections/*  reusable sections   src/components/layout/*    site chrome
src/features/*, src/pages/* compositions built only from the above
```

## 1. Tokens

- Tiers: `--brand-*` (light six + `ink-soft`/`cream-soft`/`cream-dim`; dark `midnight`/`slate`/`mist`/`electric`/
  `ember`/`graphite` + `electric-ink`/`slate-raised`/`dusk`; only in tokens.css) and `--status-danger-on-light/-dark`
  → **theme tokens** (`--background`, `--foreground`, `--surface`, `--surface-elevated`, `--muted-foreground`,
  `--border(-strong)`, `--primary(-foreground|-ink)`, `--accent(-foreground)`, `--danger`…; per MODE, feed the tones,
  never used by components) → `--color-*` (semantic, what components use) → scales (`--text-*`, `--leading-*`,
  `--tracking-*`, `--space-*`, `--section-space-*`, `--container-*`, `--radius-*`, `--shadow-*`, `--duration-*`,
  `--ease-*`, `--z-*`).
- Pick the right colour role:
  - `--color-accent` = **fill**, always with `--color-on-accent` text. `--color-accent-ink` = **ink** for text, rules,
    indexes (contrast-safe in every tone; ink on peach).
  - `--color-highlight` = **fill** (orange; cream in the peach and orange tones) with `--color-on-highlight` (ink) text. Never use it as text colour.
  - `--color-shape-1` / `--color-shape-2` = **decorative graphics only** (bursts, placeholder art, dots, offset shadow).
  - `--color-cta-*` for primary buttons, `--color-logo-mark/-burst` for the wordmark, `--color-danger` for form errors.
- No raw colours, font sizes, spacing, radii, shadows, durations or z-indexes in component CSS. Missing value → add a
  token. Allowed literals: `0`, `1px` hairlines, `100%`, `ch` widths, `minmax(0, …)`, `em` offsets for optical tweaks.
- Radius: only `--radius-none` (frames), `--radius-xs` (focus) and `--radius-pill` (controls). Shadow: `--shadow-offset`
  (print shadow for lifted images) and `--shadow-overlay` (floating layers only).
- **New semantic colour → define it in every tone, in both modes**: `:root, [data-theme='cream']` and `'blue'` (one
  block each for both modes; use a theme token when the value differs by mode), plus the light block **and** the
  `:root[data-theme='dark'] [data-theme='…']` block of `'peach'`, `'cobalt'`, `'orange'`, `'ink'`. Check its contrast
  in all twelve renderings (tables in BRAND_GUIDELINES §5 and §5b).
- Exceptions that read `--brand-*` directly (documented): `Logo.module.css` (fixed monogram colours) and the palette
  swatches on `/brand`. The `index.html` theme bootstrap carries the two `theme-color` hex values.
- Motion tokens are mirrored in `src/lib/motion.ts` (`DURATION`, `EASE_OUT_EXPO`, `EASE_STANDARD`, `STAGGER_STEP`,
  `REVEAL_DISTANCE`, `GSAP_EASE`). Change both together.

## 2. Tones

- `data-theme="cream|blue|peach|cobalt|orange|ink"` is **scoped**: it works on any element and re-maps every
  `--color-*` inside. base.css makes every `[data-theme]` element paint its own `background-color` and `color`.
- In React: `<Section tone="cobalt">` for bands; `data-theme={tone}` on a sub-element for modules
  (`ServiceModules`), placeholders (`PlaceholderArt`), sheets (`MobileMenu`) and the footer. Cream is the page default.
- **Colour mode** is separate: `<html data-theme="light|dark">`, never on another element. Set before first paint by
  the inline script in `index.html` (`localStorage['adsflux-theme']` → else `prefers-color-scheme`), then by
  `src/lib/theme.ts` (`getTheme`/`setTheme`/`subscribeToTheme`, keep the storage key in sync). React reads it with
  `useTheme()` from `@/hooks/useTheme`; the switch is `ThemeToggle` in the header. Every tone has a dark rendering in
  tokens.css, so components need **no** dark-mode CSS. Never write `[data-theme='dark'] .x {…}` in a module, never
  `invert()` or filter images, and only read the mode in JS for content (labels), never for colours.
- Mode switches cross-fade via the View Transitions API (base.css `::view-transition-*`, 280 ms), skipped under
  reduced motion. Don't add `transition: background-color/color` to elements for the theme switch.
- Never fake a tone with a hard-coded background (e.g. `background: var(--color-accent)` on a panel whose children use
  default text tokens). Set `data-theme` so the children re-map too. Never read the tone in JS to pick colours.

## 3. Styling mechanics

- **CSS Modules** per component (`Button.module.css` beside `Button.tsx`), camelCase class names (`styles.navLink`;
  Vite is set to `camelCaseOnly`).
- Global CSS only in `src/styles/`, in cascade layers `@layer reset, base, utilities;`. Modules are unlayered and
  win — **never `!important`** (sole exception: the reduced-motion block in reset.css). For state-specific overrides
- **CSS Modules gotcha:** `vite.config.ts` uses `localsConvention: 'camelCaseOnly'`. `.shape-1` becomes `styles.shape1`,
  and class names with digits are re-cased (`.text4xl` → `styles.text4Xl`) — a dynamic `styles[name]` lookup then
  silently returns `undefined`. Use plain camelCase names without digit-letter runs, or map explicitly.
  use compound selectors (`.ghost.sm`).
- Combine classes with `cn()` (`@/lib/cn`); map variants to classes: `styles[variant]`.
- Global utilities: `.display` (serif hero size), `.label` (mono uppercase metadata), `.highlight` (marker fill),
  `.accent` (accent-ink word), `.paper` (texture; `Section texture` adds it), `.visually-hidden`, and `.media-hover`
  (parent opt-in for MediaFrame zoom, defined with `:global` in `MediaFrame.module.css`).
- Headings default to Space Grotesk; `<em>` inside `h1–h4`, `p`, `blockquote` becomes Instrument Serif italic
  automatically. For a serif display line set `font-family: var(--font-display)` + `font-weight: var(--weight-regular)`
  (the serif has no bold; `font-synthesis: none` prevents faux bold).
- Mobile-first `@media (min-width: …)` with literal px from `src/styles/breakpoints.ts` (640/768/1024/1280/1536).
- Prefer intrinsic layout (grid/flex `gap`, fluid `clamp()` tokens). Grid tracks that contain big type must be
  `minmax(0, Nfr)`. Sections with oversized type or parallax get `overflow: hidden`.
- Animate `transform`/`opacity` (and `clip-path` for reveals) only; durations/easings from tokens. Every CSS
  `animation` loop needs a `@media (prefers-reduced-motion: reduce)` override that stops it.

## 4. Building a primitive

Build one when a pattern appears **twice**. A primitive:

1. Lives in `src/components/ui/<Name>/` with `<Name>.tsx`, `<Name>.module.css`, `index.ts`; re-exported from
   `src/components/ui/index.ts`.
2. Extends the native element's props, spreads `...props`, merges `className` last with `cn()`.
3. Exposes appearance via small typed unions (`variant`, `size`, `tone`, `color`) with defaults — no style props.
4. Uses only semantic tokens, so it works in all six tones without per-tone code.
5. Has no business logic, data fetching or copy.
6. Shared class builders live in a separate `.ts` file (e.g. `buttonClassName.ts`) so the component file only
   exports components (react-refresh rule).

Existing primitives: `AppLink`, `Badge`, `Burst`, `Button`/`ButtonLink`, `Container`, `Dropdown`, `Eyebrow`,
`Field` (+ `Input`/`Textarea`/`Select`), `Logo` (`Wordmark`, `Monogram`, generated `geometry.ts`), `MediaFrame`
(+ `PlaceholderArt`, internal `AutoplayVideo`), `Section`, `SectionHeading`, `Stamp`. Motion: `MotionProvider`,
`Reveal`, `Stagger`/`StaggerItem`, `TextReveal`, `ImageReveal`, `Parallax`, `ScrollHighlightText`, `Marquee`.

```tsx
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import styles from './Tag.module.css'

export type TagVariant = 'outline' | 'highlight'
export type TagProps = HTMLAttributes<HTMLSpanElement> & { variant?: TagVariant }

export function Tag({ variant = 'outline', className, ...props }: TagProps) {
  return <span className={cn(styles.tag, styles[variant], className)} {...props} />
}
```

```css
.tag { border-radius: var(--radius-pill); font-family: var(--font-mono); font-size: var(--text-xs); }
.outline { border: 1px solid var(--color-border-strong); color: var(--color-text); }
.highlight { background: var(--color-highlight); color: var(--color-on-highlight); }
```

## 5. Motion implementation

- `m.*` components only (LazyMotion `strict`); constants from `@/lib/motion`.
- GSAP: `const { gsap } = await loadScrollTrigger()` inside an effect, guard with an `isCancelled` flag, wrap tweens
  in `gsap.context(() => …, element)` and call `context.revert()` on cleanup. Skip entirely when
  `usePrefersReducedMotion()` is true. Pattern: `Parallax.tsx`, `ScrollHighlightText.tsx`.
- Never attach `whileInView` to an element that starts fully clipped (`overflow: hidden` mask or `clip-path:
  inset(100%…)`). Observe the unclipped parent and pass state down with variants (`TextReveal`, `ImageReveal`).

## 6. Accessibility implementation

- Semantic elements first (`button` for actions, `AppLink`/`a` for navigation, landmarks, one `h1`).
- `:focus-visible` ring comes from base.css via `--color-focus` (tone-aware) — don't remove outlines without a
  replacement.
- Forms go through `Field` (label + `aria-describedby` + `aria-invalid` + `role="alert"` errors).
- Animated text: visually-hidden full copy + `aria-hidden` animated copy (see `TextReveal`, `HomeHero`).
- Decorative SVG/graphics: `aria-hidden="true"` + `focusable="false"`. Toggle buttons: `aria-pressed`.
- Targets ≥ 44px; `nav` elements get `aria-label`; icon-only buttons get visible or visually-hidden text.

## Checklist before finishing UI work

- [ ] No hex/px literals outside tokens (except allowed)
- [ ] Correct colour role (fill vs ink vs shape); checked in **every tone** the component can appear in, in **light
      and dark** mode
- [ ] No rounded corners other than pills; no blurred shadows
- [ ] No horizontal scroll at 390 / 768 / 1024 / 1440
- [ ] Keyboard-navigable with visible focus; reduced motion respected (incl. CSS loops)
- [ ] Reused an existing primitive instead of restyling a raw element
- [ ] `npm run check` passes with zero warnings
