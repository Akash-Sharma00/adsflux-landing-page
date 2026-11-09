# Adsflux

Website for **Adsflux**, a creative and growth agency for ambitious brands in India and worldwide. *We make brands impossible to ignore.*

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: set VITE_CONTACT_ENDPOINT to enable the contact form
npm run dev                  # → http://localhost:5173  ·  brand system at /brand
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run check` | Typecheck + lint (zero warnings expected) |
| `npm run build` | Typecheck and production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run assets` | Optimize images from `assets/originals/` into `public/assets/` |
| `npm run fonts` | Rebuild self-hosted fonts in `public/fonts/` |

## Stack

React 19 · TypeScript · Vite · CSS Modules + CSS-variable design tokens · react-router · motion · GSAP ScrollTrigger (lazy) · self-hosted Instrument Serif / Space Grotesk / DM Sans / DM Mono.

## Brand & design system

The visual direction is **Electric Editorial**: Paper Cream pages, Electric Cobalt moments, a controlled Signal Orange accent, serif display type with italic accents, sharp frames, pill controls and campaign collages.

- [Brand guidelines](docs/brand/BRAND_GUIDELINES.md): positioning, voice, colour and contrast, tones, type, imagery
- [Design system](docs/brand/DESIGN_SYSTEM.md): tokens, tones, components, layout, motion, a11y, performance
- [Logo guidelines](docs/brand/LOGO_GUIDELINES.md): wordmark and monogram usage. Assets are in `public/brand/`
- Live reference: **`/brand`**

## For AI coding agents

Start with [AGENTS.md](AGENTS.md). The brand skill is at [.agents/skills/adsflux-brand](.agents/skills/adsflux-brand/SKILL.md). Engineering skills (design-system mechanics, folder architecture, clean code, scaling) are in [.claude/skills/](.claude/skills/).

## Before launch

- Replace the **sample** showcase, case studies, testimonials and pricing (`src/features/*/content.ts`) with real, approved content. Real campaign creatives are already placed (hero + showcase); see [docs/assets/ASSET_INVENTORY.md](docs/assets/ASSET_INVENTORY.md) for the workflow, open attribution questions and two copy errors baked into supplied creatives.
- Set `siteConfig.url`, `siteConfig.email` and the social URLs in `src/config/site.ts` (socials show "soon" until set), and set `VITE_CONTACT_ENDPOINT`.
- SEO is built in (`src/config/seo.ts`, see AGENTS.md → SEO). Setting `siteConfig.url` turns on canonical URLs, the OG image, JSON-LD URLs and `sitemap.xml`. Host so `dist/<route>/index.html` serves each route and `dist/404.html` serves unknown URLs.
