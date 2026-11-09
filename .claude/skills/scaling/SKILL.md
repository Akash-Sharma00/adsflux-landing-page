---
name: scaling
description: How the adsflux website should grow without slowing down or getting messy — performance budgets, code splitting, routing, images, data fetching, state, environment config, SEO and when to introduce new dependencies. Use when adding pages or routes, adding a library, fetching data, adding images/media, optimising load time, or making architectural decisions about growth.
---

# adsflux Scaling Guide

Scale along two axes: **performance** (the site stays fast as content grows) and **codebase**
(the code stays easy to change as people and features grow). Add complexity only when a real need
appears — this file says what to reach for when it does.

## Performance budgets

| Metric (mobile, 4G)            | Budget        |
| ------------------------------ | ------------- |
| Initial JS (gzip)              | ≤ 120 KB (currently ~118 KB) |
| Initial CSS (gzip)             | ≤ 20 KB       |
| LCP                            | ≤ 2.5 s       |
| CLS                            | ≤ 0.1         |
| INP                            | ≤ 200 ms      |
| Single image above the fold    | ≤ 150 KB      |

Check bundle size on every dependency addition: `npm run build` prints gzip sizes.

## Dependencies

Before adding a package, answer:
1. Can the platform do it? (CSS for animation/layout, `Intl` for formatting, `fetch`, `<dialog>`, `IntersectionObserver`.)
2. What does it cost in gzip KB? Is it tree-shakeable (ESM)?
3. Is it maintained and typed?

Prefer small, focused libraries. Never add a second library for something already solved in the repo.

## Routing

- `react-router` in **declarative mode** (`BrowserRouter` + `Routes` in `src/app/AppRoutes.tsx`) — ~13 KB gzip vs
  ~31 KB for the data router (`createBrowserRouter`). Switch only if routes need loaders/actions.
- **Lazy-load every route except home**:
  ```tsx
  const AboutPage = lazy(() => import('@/pages/about').then((m) => ({ default: m.AboutPage })))
  ```
  `RootLayout` already wraps the `<Outlet>` in `<Suspense>`.
- Scroll on navigation is handled by `components/layout/ScrollManager` (top on new page, hash targets otherwise).
- Keep route paths in `src/config/routes.ts` and reference them by constant, not string literals.
- If SEO across many pages becomes important, consider static prerendering before there are dozens of pages.

## Code splitting

- Already split: `/brand` page, GSAP + ScrollTrigger (`loadScrollTrigger()`), the motion engine (LazyMotion async
  `domAnimation`). Keep it that way — never import `gsap` statically or use `motion.*` components.
- Lenis (smooth scroll) is deliberately not installed — see docs/brand/DESIGN_SYSTEM.md#5-motion.

- Heavy, below-the-fold or interaction-only UI (video players, maps, carousels, modals with big
  deps) is loaded with `lazy()` + dynamic `import()`.
- Never import a whole library for one function (`import debounce from 'lodash/debounce'`, not `lodash`).
- Barrel files are fine for `components/ui` (tree-shaken by Rolldown), but don't put side effects in them.

## Images & media

- Use AVIF/WebP, sized to the largest rendered size (×2 for retina), with explicit `width` and `height`.
- Above-the-fold hero: `fetchpriority="high"`, no lazy loading. Everything else: `loading="lazy" decoding="async"`.
- Responsive images via `srcset` + `sizes` for anything wider than ~600px.
- Videos: `preload="none"` or `metadata`, a `poster`, and `muted playsinline` for autoplay. On the site, always go
  through `MediaFrame videoSrc + poster` (plays muted only while visible, play/pause + opt-in sound controls, never autoplays under reduced motion).
- Images: originals in `assets/originals/` → `npm run assets` (sharp: AVIF + WebP, responsive widths, never upscales) →
  `public/assets/<group>/` + generated manifest → register in `src/assets/assetRegistry.ts` → `<MediaFrame image sizes>`.
  Only one `priority` image per page (the LCP), preloaded in `index.html`, never behind an entrance animation.
- Fonts: self-hosted latin/latin-ext `woff2` at stable `/fonts/` URLs (`npm run fonts`), `font-display: swap`; preload
  only the faces used above the fold (currently 3), or the hero headline reflows on swap (CLS).
- Heavy JS that isn't needed for first paint (GSAP) loads after `load` + idle.

## Data fetching

- Static site content → typed data files in `src/config/` or `src/features/<x>/content.ts`. No fetch needed.
- First remote data → a typed fetch wrapper in `src/lib/http.ts` (base URL, JSON parsing, errors),
  called from `features/<x>/api.ts`. Components never call `fetch` directly.
- When there are several remote resources needing caching/refetching → adopt TanStack Query; keep
  query hooks inside the owning feature (`features/<x>/hooks/useX.ts`).
- Validate external data at the boundary (e.g. `zod`) before it enters the app's types.

## State management

Escalate only as far as needed:
1. Local `useState` / `useReducer`
2. Lift to the nearest common parent
3. React Context for low-frequency global values (e.g. locale, consent) — one context per concern, in a feature or
   `hooks/` (pages may not import from `app/`). Visual tones are CSS (`data-theme`), never React state
4. Server state → TanStack Query (not a global store)
5. A dedicated client store (e.g. Zustand) only for complex, frequently-updated cross-feature client state

## Environment & config

- Env vars go through Vite: only `VITE_`-prefixed vars reach the client. Never put secrets in them.
- Read env in exactly one place, `src/config/env.ts`, validate it at startup, and export typed values.
- Commit `.env.example`; keep `.env.local` untracked.

## SEO & sharing

- All metadata lives in `src/config/seo.ts` (`pageSeo`: title ≤ 60 chars, description 120–160, path, `isIndexable`;
  OG image; Organization + WebSite JSON-LD built only from real `siteConfig` facts).
- Each page renders `<PageHead page="…" />`. Never render `<title>`/`<meta>` directly — React 19 hoisting would
  duplicate the static tags instead of replacing them. `PageHead` loads the metadata lazily (it only matters after
  client-side navigation), keeping it off the initial-JS budget.
- `scripts/vite-plugin-seo.ts` (build) writes `dist/<route>/index.html` per page with its own `<head>` (bots that
  don't run JS read this), `dist/404.html` (noindex, real 404 status on static hosts), `robots.txt` and
  `sitemap.xml`. Home-only preloads in `index.html` sit between `<!-- home-only:start/end -->` and are stripped
  from other routes.
- Canonical URLs, `og:url`, `og:image` and the sitemap need absolute URLs, so they appear only once `siteConfig.url`
  is set (the build warns until then).
- Social card `public/og/adsflux-og.png` (1200 × 630) and PNG icons come from `npm run icons`.

## Codebase scaling

- Follow the `folder-architecture` skill: features are isolated, depend downward only, and expose an `index.ts`.
- When a feature grows past ~15 files, split it into sub-features rather than adding nesting.
- Design changes flow through tokens (`frontend-design-system` skill) so a rebrand is a one-file edit.
- Add tests where risk is: start with Vitest for `lib/` and hooks, Playwright for critical user flows
  (contact form, checkout). Colocate unit tests next to the code.
- Keep `npm run check` (typecheck + lint) green; add it to CI as the first pipeline step.

## Pre-launch checklist

- [ ] Lighthouse mobile ≥ 90 on Performance, Accessibility, Best Practices, SEO
- [ ] Budgets above respected
- [ ] All routes except home lazy-loaded
- [ ] Images optimised with dimensions set
- [ ] `siteConfig.url` set (canonical, OG image, sitemap); validate with Google Rich Results Test + a LinkedIn/X card preview
- [ ] 404 page
