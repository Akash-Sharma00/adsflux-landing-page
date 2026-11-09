# Adsflux Logo Guidelines

The logo is the **Adsflux wordmark**: Instrument Serif "**Ads**" in roman, "***flux***" in italic, and an eight-ray **signal burst** at the top right. The **monogram** is the serif "A" with the same burst, set on a square tile.

The roman-to-italic shift is the brand in miniature: a steady, confident start that turns expressive. The burst is the signal, the spark of attention. It is the one element of the logo that carries colour.

## Construction

- The letters are **outlined vectors** generated from the Instrument Serif font files, not live text. The logo renders identically everywhere and never depends on font loading.
- The geometry lives in `src/components/ui/Logo/geometry.ts` (`WORDMARK_VIEWBOX` `-3 23 294 80`, `WORDMARK_LETTERS`, `WORDMARK_BURST`, `MONOGRAM_LETTER`, `MONOGRAM_BURST`) and is mirrored in `public/brand/*.svg` and `public/favicon.svg`. **Do not hand-edit it.** If the logo changes, regenerate it with `python3 scripts/build-logo.py` (needs `fonttools`; it rewrites the TS wordmark geometry and the four wordmark SVGs together), then run `npm run icons` to re-render the PNG exports (social card, 512px monogram, apple-touch icon).
- The burst is an eight-pointed star (outer radius 12, inner ≈ 4.2 units) whose top aligns with the cap height, just right of the final "x". Its diameter, about 30% of the wordmark's height, is the unit **x** used for clear space.
- Monogram: a 64 × 64 tile. The "A" sits slightly left of centre on the baseline; the burst sits in the top-right corner.

## Assets

| Asset | File / component | Colours | Use |
|---|---|---|---|
| Wordmark, ink | `public/brand/adsflux-wordmark-ink.svg` | Ink letters, orange burst | **Primary.** Cream, soft blue, white and light photography |
| Wordmark, cream | `public/brand/adsflux-wordmark-cream.svg` | Cream letters, orange burst | Cobalt, ink and dark photography |
| Wordmark, cobalt | `public/brand/adsflux-wordmark-cobalt.svg` | Cobalt letters, orange burst | Cream, soft blue or white backgrounds in print and partner contexts. Not on the website chrome (the site uses ink on light tones) |
| Wordmark, mono ink | `public/brand/adsflux-wordmark-mono-ink.svg` | Ink letters, ink burst | One-colour print, embossing, legal documents, and on Signal Orange |
| Monogram, cobalt | `public/brand/adsflux-monogram-cobalt.svg` | Cobalt tile, cream A, orange burst | **Default.** Favicon, social avatars, app icons |
| Monogram, cream | `public/brand/adsflux-monogram-cream.svg` | Cream tile, ink A, orange burst | On photography and busy backgrounds |
| Monogram, orange | `public/brand/adsflux-monogram-orange.svg` | Orange tile, ink A, ink burst | Stickers and merch only |
| Favicon | `public/favicon.svg` | Same as monogram cobalt | Browser tab |
| In code | `<Wordmark />`, `<Monogram variant />` from `@/components/ui` | Tone-aware (wordmark) / fixed (monogram) | All website usage |

## Colour rules

On the website, `<Wordmark />` takes its colours from the tone it sits in (`--color-logo-mark`, `--color-logo-burst`). Use the component and the right colours follow automatically.

| Background (tone) | Letters | Burst |
|---|---|---|
| Paper Cream (`cream`) | Ink | **Orange** |
| Soft Blue (`blue`) | Ink | **Orange** |
| Dusty Peach (`peach`) | Ink | **Cobalt** (orange disappears into peach) |
| Electric Cobalt (`cobalt`) | Cream | **Orange** |
| Ink Black (`ink`) | Cream | **Orange** |
| Signal Orange (`orange`) | Ink | **Ink** (mono) |

In **dark mode** (Midnight Editorial) the same component switches automatically: cream letters with an **Ember** (`#FF754F`) burst on Midnight, Slate, Dusk, Cobalt and Ink; midnight letters and burst on the Ember band. The monogram is unchanged.

- The burst is always orange/ember, cobalt or ink/midnight, as above. Never cream on a light tone, never blue or peach.
- The monogram carries its own tile, so it works on any surface. Its colours are fixed per variant (`Logo.module.css` is the one documented place that reads `--brand-*` directly).

## Behaviour

- In the site header the wordmark sits inside the home link; the **burst rotates 45° on hover** (`--duration-slow`, expo-out). That is the logo's only animation. Don't animate the letters.
- Accessible name: `Wordmark` defaults to `title="Adsflux"` (`role="img"`). Pass `title=""` when the logo is decorative or sits inside a link that already has a label (the header link is labelled "Adsflux — home").

## Clear space & sizing

- **Clear space:** at least **1x** (the burst's diameter) on every side; 2x where the layout allows. Nothing (text, edges, other marks) enters that zone.
- **Minimum size:** wordmark **≥ 80px wide (≈ 20px tall)** on screen, 25mm in print. Below that, use the monogram.
- **Monogram minimum:** **16px** (the favicon size). The tile is part of the mark; don't crop it.
- Site usage: header wordmark 2.1rem tall; footer wordmark up to 34rem wide as a signature; colophon monogram.

## Don'ts

- Don't retype the wordmark in Instrument Serif or any other font. Use the component or the SVGs.
- Don't recolour it outside the token rules above (no gradients, no blue or peach letters, no orange letters).
- Don't stretch, skew, rotate, outline or re-space the letters, or change the roman/italic split.
- Don't move, resize, remove or replace the burst (no dots, stars or other glyphs instead).
- Don't add effects: shadows, glows, outlines, 3D, textures or transparency.
- Don't set it enormous on a black background as a "hero logo". The ink tone is used once per page at most, and never for a logo showcase.
- Don't place it on busy imagery without contrast; use the cream monogram or a solid tone band.
- Don't build lockups ("Adsflux Studio", partner lockups) without updating these guidelines first.
