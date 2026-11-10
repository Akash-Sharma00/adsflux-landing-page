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

## Deploy (Vercel)

Configured in [vercel.json](vercel.json): Vite preset, `npm ci` → `npm run build` → `dist/`, Node ≥ 22.12 (`engines`).
Every route is pre-rendered with its full content (`dist/index.html`, `dist/services/<slug>/index.html`, `dist/brand/index.html`), unknown URLs get `dist/404.html` with a
real 404 status (no SPA catch-all rewrite), clean URLs without trailing slashes, immutable caching for hashed
`/assets/*.js|css`, shorter caching for media and fonts, and baseline security headers.
Campaign media (`/assets/campaigns|hero|scalvo|video/`) can't be opened directly in a tab or hotlinked from other
sites (redirects to `/`); in the page, right-click/long-press save and drag-out are disabled on images and videos
(`src/lib/protectMedia.ts`). These deter casual saving only — anything a browser shows can still be captured.

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new) (settings are read from `vercel.json`; no changes needed).
2. Add `VITE_CONTACT_ENDPOINT` under Project → Settings → Environment Variables: the `/exec` URL of the Google Apps Script web app in `scripts/google-sheets-leads.gs` (setup steps are at the top of that file). Leads land in a Google Sheet.
3. Every push to `main` deploys to production; other branches and PRs get preview URLs.
4. Add `www.adsflux.in` and `adsflux.in` under Project → Settings → Domains, with the apex redirecting to `www` (the canonical host in `siteConfig.url`).

## Before launch

- Replace the **sample** showcase, case studies, testimonials and pricing (`src/features/*/content.ts`) with real, approved content. Real campaign creatives are already placed (hero + showcase); see [docs/assets/ASSET_INVENTORY.md](docs/assets/ASSET_INVENTORY.md) for the workflow, open attribution questions and two copy errors baked into supplied creatives.
- Set `siteConfig.email` and the social URLs in `src/config/site.ts` (socials show "soon" until set; they also feed the Organization `sameAs` in structured data), and set `VITE_CONTACT_ENDPOINT`.
- SEO is built in (`src/config/seo.ts`, see AGENTS.md → SEO): pre-rendered pages, one keyword-targeted page per service under `/services/`, canonical URLs on `https://www.adsflux.in`, Open Graph, JSON-LD (Organization, WebSite, Service, BreadcrumbList), `sitemap.xml` and `robots.txt`. Review the service-page copy in `src/pages/service/serviceContent.ts`.
- After the first deploy: verify the domain in [Google Search Console](https://search.google.com/search-console) (DNS, Domain property), submit `https://www.adsflux.in/sitemap.xml`, and request indexing for the home and service pages.
