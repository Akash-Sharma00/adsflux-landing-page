# AGENTS.md — Adsflux website

Marketing site for **Adsflux**, a creative and growth agency for ambitious brands (India + international).
Positioning: **"We make brands impossible to ignore."** Visual direction: **Electric Editorial** (light) with a
**Midnight Editorial** dark mode (OS preference by default, header toggle, saved in `localStorage`).

## Stack

React 19 · TypeScript (strict, `noUncheckedIndexedAccess`) · Vite 8 · CSS Modules on CSS custom-property tokens ·
react-router (declarative `BrowserRouter`) · motion (`motion/react`, LazyMotion) · GSAP + ScrollTrigger (lazy) ·
self-hosted fonts at stable /fonts/ URLs (Instrument Serif, Space Grotesk, DM Sans, DM Mono) · sharp asset pipeline · oxlint. No Tailwind, no UI kit.

## Commands

| Command | Use |
|---|---|
| `npm run dev` | Dev server (`/` home, `/brand` live brand reference) |
| `npm run check` | Typecheck + lint — **must pass with zero warnings before you finish** |
| `npm run build` | Typecheck + production build; prints gzip sizes (initial JS budget ≤ 120 KB; currently ~122 KB as a single `index` chunk — already over, so code-split anything new and trim before adding) |
| `npm run preview` | Serve the build |
| Deploy | Push to `main` — Vercel builds and deploys (config in `vercel.json`, see README → Deploy) |
| `npm run assets` | Regenerate optimized image variants + `src/assets/generated/imageManifest.ts` from `assets/originals/` |
| `npm run videos` | Cut the showcase reels (12 s muted 720×1280 H.264, ≤ 4 MB each, HDR → SDR) from `assets/originals/video/` into `public/assets/video/` + poster frames; then `npm run assets` for the posters. Needs ffmpeg |
| `python3 scripts/derive-hero-cutout.py` | Regenerate `assets/derived/adsflux-services-cutout.png` + per-piece clip outlines from the collage original (needs numpy, opencv-python-headless, pillow); then `npm run assets` |
| `python3 scripts/build-logo.py` | Regenerate the wordmark outlines (`src/components/ui/Logo/geometry.ts` + `public/brand/*-wordmark-*.svg`) from the Instrument Serif font files (needs fonttools); then `npm run icons` |
| `npm run icons` | Regenerate the social card `public/og/adsflux-og.png` + PNG logo/apple-touch icons from the logo SVGs |
| `npm run fonts` | Regenerate `public/fonts/` + `src/styles/fonts.css` (after upgrading a `@fontsource` package) |

## Read before working

| Task | Read |
|---|---|
| **Any** UI, styling, copy, imagery, logo, animation | `.agents/skills/adsflux-brand/SKILL.md` (brand rules + new-page checklist) |
| Brand detail / rationale / contrast data | `docs/brand/BRAND_GUIDELINES.md`, `DESIGN_SYSTEM.md`, `LOGO_GUIDELINES.md` |
| CSS mechanics (tokens, tones, layers, primitives) | `.claude/skills/frontend-design-system/SKILL.md` |
| Where files go, import rules | `.claude/skills/folder-architecture/SKILL.md` |
| Writing/reviewing TS/TSX | `.claude/skills/clean-code/SKILL.md` |
| Routes, deps, data, images, perf | `.claude/skills/scaling/SKILL.md` |

Visual reference of everything: run the app and open **`/brand`**.

## Hard rules

1. **Two fixed palettes only.** Light: Paper Cream `#F5F0E7`, Electric Cobalt `#263BDB`, Signal Orange `#FF633E`, Ink Black `#171717`, Soft Blue `#DCE5FF`, Dusty Peach `#E8B8A5`. Dark (Midnight Editorial): Midnight `#11131B`, Slate `#1D2230`, Mist `#A8A9BD`, Electric `#5268FF`, Ember `#FF754F`, Graphite `#353949` (+ documented derived tints). Hex values live **only** in `src/styles/tokens.css`; components use semantic `--color-*` tokens. No gradients, no predominantly black pages, no neon or glows.
2. **Tones, not backgrounds:** `<Section tone="cream|blue|peach|cobalt|orange|ink">` or `data-theme` on an element. Cream leads, cobalt for big moments, at most one ink band per page. Orange is a fill, never text on cream or cobalt. **Colour mode** is `data-theme="light|dark"` on `<html>` only (`src/lib/theme.ts`, `useTheme()`); every tone already has a dark rendering, so components never contain dark-mode CSS and images are never inverted. Check new UI in both modes.
3. **Fonts via tokens only:** Instrument Serif (`--font-display`, display + `<em>` accents), Space Grotesk (`--font-heading`), DM Sans (`--font-body`), DM Mono (`--font-mono`).
4. **Shape:** sharp frames + pill controls. No rounded cards, no glassmorphism, no blurred shadows (use `--shadow-offset`).
5. **Reuse first:** primitives from `@/components/ui`, `@/components/motion`, `@/components/sections`. Use `<Wordmark />` / `<Monogram />`; never retype the logo.
6. **Motion:** `m.*` not `motion.*`; GSAP only via `loadScrollTrigger()`; always respect reduced motion; no Lenis.
7. **Dependencies point downward:** `app → pages → features → components/hooks → lib/config/styles`. Features never import each other. `@/` alias, named exports only.
8. **Content truthfulness:** `src/features/showcase|work|testimonials|pricing/content.ts` is **SAMPLE**. Never present it as real client work; never invent metrics, quotes or names. Case-study outcomes only with verified data.
9. **Imagery:** real assets via the pipeline and `src/assets/assetRegistry.ts` (see `docs/assets/ASSET_INVENTORY.md`), or `PlaceholderArt`. Never stock or generic AI illustrations. Never hand-place image files or edit `assets/originals/`.

## SEO

Every page renders `<PageHead page="…" />` (from `@/components/layout`); its metadata lives in `src/config/seo.ts` (`getPageSeo`). A new static route needs an entry in `staticPageSeo`; service pages are generated from `src/config/services.ts` (`slug` = URL, `seo.keyword` = `<title>` + `<h1>` lead, `seo.description`). At build, `scripts/vite-plugin-seo.ts` server-renders every page (`src/entry-server.tsx`) into its own HTML file — full content + `<head>` for crawlers and link-preview bots; `main.tsx` hydrates it — and lists indexable pages in `sitemap.xml`. The build fails if a page's content would sit behind a Suspense fallback. Keep components render-pure and SSR-safe (browser APIs only in effects; `useSyncExternalStore` with a server snapshot). Don't render `<title>`/`<meta>` in components. Canonical host: `https://www.adsflux.in` (`siteConfig.url`). `npm run preview` falls back to `index.html` for some routes and can log hydration errors that production (Vercel) won't.

## Repo layout

```
src/app/            App (MotionProvider + BrowserRouter), AppRoutes (React.lazy routes)
src/pages/<route>/  home (HomePage + sections/) · service (/services/<slug>, one per service + serviceContent.ts) · brand (/brand reference) · not-found
src/entry-server.tsx build-time renderer used by the SEO plugin (mirrors App with a StaticRouter)
src/features/       services · showcase · work · testimonials · pricing · contact
src/components/     ui/ (primitives) · motion/ · sections/ (CtaSection) · layout/ (header, mobile menu, footer)
src/config/         site copy, services catalogue, navigation, routes, env, seo (per-page <head> metadata)
src/styles/         tokens.css · reset · base · utilities · fonts.ts · breakpoints.ts
src/lib/ hooks/     cn, motion constants, gsap loader, theme (colour mode store) · usePrefersReducedMotion, useTheme
public/brand/       logo SVGs (wordmark ink/cream/cobalt/mono-ink, monogram cobalt/cream/orange)
assets/originals/   original source files, byte-identical (not deployed) + assets/manifest.json
assets/derived/     script-derived sources (hero cut-out, video posters), fed to the pipeline (not deployed)
public/assets/      optimized variants (hero/, campaigns/, video/ reels + posters) · public/fonts/ self-hosted woff2
src/assets/         assetRegistry.ts (+ generated/imageManifest.ts) · showcaseVideos.ts (reels, code-split) · src/types/media.ts
scripts/            optimize-assets.mjs · optimize-videos.mjs · build-fonts.mjs · build-icons.mjs · build-logo.py · derive-hero-cutout.py · vite-plugin-seo.ts
docs/brand/         brand guidelines, design system, logo guidelines
.agents/skills/     adsflux-brand (symlinked into .claude/skills/)
.claude/skills/     frontend-design-system, folder-architecture, clean-code, scaling
```

## Before launch

Review the service-page copy (`src/pages/service/serviceContent.ts`); redirect the apex domain to `www.adsflux.in` in Vercel; verify the domain in Google Search Console and submit `/sitemap.xml`; set `siteConfig.email` and social URLs in `src/config/site.ts`; confirm Scalvo ships a dark theme (the Scalvo mock-up's dark layers are rendered from Scalvo's CSS tokens, `src/assets/scalvoImages.ts`); set `VITE_CONTACT_ENDPOINT`; replace all SAMPLE content with approved work; hosting is Vercel (`vercel.json`): it serves `dist/<route>/index.html` per route and `dist/404.html` for unknown URLs — keep it that way (no SPA catch-all rewrite).
