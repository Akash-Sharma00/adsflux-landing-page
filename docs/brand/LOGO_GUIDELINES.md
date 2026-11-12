# Adsflux Logo Guidelines

The logo is **Breakout**: a sharp square **frame** with a solid **signal block** breaking out through its top-right corner, followed by "**adsflux**" in Space Grotesk Bold, lowercase. The **monogram** is the mark alone on a square tile.

The block is the brand promise in one shape: work that won't stay inside the frame, *impossible to ignore*. The frame is the brand's sharp editorial framing; the block is the signal. The block is the one element of the logo that carries colour.

(Adopted 2026-11-12, replacing the Instrument Serif "Ads*flux*" wordmark with the eight-ray burst. The `Burst` graphic remains a brand accent, but it is no longer part of the logo.)

## Construction

- Everything is **outlined vectors** built by `scripts/build-logo.py`: the letters come from the Space Grotesk font file (weight 700), not live text, so the logo renders identically everywhere and never depends on font loading.
- The geometry lives in `src/components/ui/Logo/geometry.ts` (`WORDMARK_VIEWBOX`, `WORDMARK_MARK` = frame + letters, `WORDMARK_SIGNAL` = block, `MONOGRAM_FRAME`, `MONOGRAM_SIGNAL`) and is mirrored in `public/brand/*.svg` and `public/favicon.svg`. **Do not hand-edit it.** To change the logo, edit the constants at the top of the script and run `python3 scripts/build-logo.py` (needs `pip install fonttools brotli`; it rewrites the TS geometry, all seven brand SVGs and the favicon together), then `npm run icons` to re-render the PNG exports (social card, 512px monogram, apple-touch icon).
- **The mark** sits in a 50-unit square:
  - Frame: 40 × 40, stroke 7, from y = 10 to the baseline. Its top-right corner is cut open.
  - Signal block: 24 × 24 at the top-right of the 50-unit square, 3 units clear of the frame on both cut edges.
- **The wordmark**: "adsflux" starts 14 units after the mark. Its letters stand on the frame's bottom edge, and the ascender of the "d" reaches the frame's top edge. Tracking is −3%, plus the font's own kerning.
- **Monogram**: the same 50-unit mark centred on a 64 × 64 tile (7 units of margin).
- The block's width (24 units, about 46% of the logo's height) is the unit **x** used for clear space.

## Assets

| Asset | File / component | Colours | Use |
|---|---|---|---|
| Wordmark, ink | `public/brand/adsflux-wordmark-ink.svg` | Ink frame + letters, orange block | **Primary.** Cream, soft blue, white and light photography |
| Wordmark, cream | `public/brand/adsflux-wordmark-cream.svg` | Cream frame + letters, orange block | Cobalt, ink and dark photography |
| Wordmark, cobalt | `public/brand/adsflux-wordmark-cobalt.svg` | Cobalt frame + letters, orange block | Cream, soft blue or white backgrounds in print and partner contexts. Not on the website chrome (the site uses ink on light tones) |
| Wordmark, mono ink | `public/brand/adsflux-wordmark-mono-ink.svg` | All ink | One-colour print, embossing, legal documents, and on Signal Orange |
| Monogram, cobalt | `public/brand/adsflux-monogram-cobalt.svg` | Cobalt tile, cream frame, orange block | **Default.** Favicon, social avatars, app icons |
| Monogram, cream | `public/brand/adsflux-monogram-cream.svg` | Cream tile, ink frame, orange block | On photography and busy backgrounds |
| Monogram, orange | `public/brand/adsflux-monogram-orange.svg` | Orange tile, ink frame, ink block | Stickers and merch only |
| Favicon | `public/favicon.svg` | Same as monogram cobalt | Browser tab |
| In code | `<Wordmark />`, `<Monogram variant />` from `@/components/ui` | Tone-aware (wordmark) / fixed (monogram) | All website usage |

## Colour rules

On the website, `<Wordmark />` takes its colours from the tone it sits in (`--color-logo-mark` for frame and letters, `--color-logo-signal` for the block). Use the component and the right colours follow automatically.

| Background (tone) | Frame + letters | Block |
|---|---|---|
| Paper Cream (`cream`) | Ink | **Orange** |
| Soft Blue (`blue`) | Ink | **Orange** |
| Dusty Peach (`peach`) | Ink | **Cobalt** (orange disappears into peach) |
| Electric Cobalt (`cobalt`) | Cream | **Orange** |
| Ink Black (`ink`) | Cream | **Orange** |
| Signal Orange (`orange`) | Ink | **Ink** (mono) |

In **dark mode** (Midnight Editorial) the same component switches automatically: cream frame and letters with an **Ember** (`#FF754F`) block on Midnight, Slate, Dusk, Cobalt and Ink; midnight frame, letters and block on the Ember band. The monogram is unchanged.

- The block is always orange/ember, cobalt or ink/midnight, as above. Never cream on a light tone, never blue or peach.
- Frame and letters are always one colour. Never colour the letters orange: orange is never text on cream or cobalt.
- The monogram carries its own tile, so it works on any surface. Its colours are fixed per variant (`Logo.module.css` is the one documented place that reads `--brand-*` directly).

## Behaviour

- In the site header the wordmark sits inside the home link. On hover the **block steps a further 3 units out of the frame** (up and right; `--duration-slow`, expo-out). That is the logo's only animation. Don't animate the frame or the letters.
- Accessible name: `Wordmark` defaults to `title="Adsflux"` (`role="img"`). Pass `title=""` when the logo is decorative or sits inside a link that already has a label (the header link is labelled "Adsflux — home").

## Clear space & sizing

- **Clear space:** at least **1x** (the block's width) on every side; 2x where the layout allows. Nothing (text, edges, other marks) enters that zone.
- **Minimum size:** wordmark **≥ 96px wide (≈ 20px tall)** on screen, 25mm in print. Below that, use the monogram.
- **Monogram minimum:** **16px** (the favicon size). The tile is part of the mark; don't crop it.
- Site usage: header wordmark 2.1rem tall; footer wordmark up to 34rem wide as a signature; colophon monogram.
- The mark may be used **without the tile** (frame + block only) at ≥ 24px, e.g. as a bullet-sized brand sign in print, but never as a replacement for the wordmark in the site header.

## Don'ts

- Don't retype "adsflux" in Space Grotesk or any other font, and don't capitalise it. Use the component or the SVGs.
- Don't recolour it outside the token rules above (no gradients, no blue or peach letters, no orange letters, no two-colour frame).
- Don't stretch, skew, rotate, outline or re-space the letters.
- Don't move the block back inside the frame, close the frame's corner, round any corner, or change the block's size.
- Don't add effects: shadows, glows, outlines, 3D, textures or transparency.
- Don't set it enormous on a black background as a "hero logo". The ink tone is used once per page at most, and never for a logo showcase.
- Don't place it on busy imagery without contrast; use the cream monogram or a solid tone band.
- Don't build lockups ("Adsflux Studio", partner lockups) without updating these guidelines first.
