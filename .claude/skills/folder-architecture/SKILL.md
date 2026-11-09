---
name: folder-architecture
description: Where code goes in the adsflux repo and how modules may depend on each other. Use whenever creating a new file, folder, component, page, feature, hook, util, type or asset, moving code, or deciding between src/components, src/features, src/pages, src/lib and src/config.
---

# adsflux Folder Architecture

Feature-oriented, layered structure. Code is grouped by **what it is for**, not by file type,
and dependencies only point **downward**.

```
src/
├── main.tsx                 Entry: mounts <App/>, imports fonts + global CSS. Nothing else.
├── app/                     App root: App.tsx (providers), AppRoutes.tsx (React.lazy routes)
├── pages/                   One folder per route. Thin: compose sections, no business logic
│   └── home/
│       ├── HomePage.tsx
│       ├── sections/        Sections used ONLY by this page (HomeHero, TickerBand, WorkSection…)
│       └── index.ts
├── features/                Self-contained product areas
│   └── <feature>/           (services, showcase, work, testimonials, pricing, contact)
│       ├── components/      Components used only by this feature
│       ├── hooks/           Hooks used only by this feature
│       ├── content.ts       Feature-owned content (flag SAMPLE content clearly)
│       ├── api.ts           Data access for this feature
│       ├── types.ts / constants.ts / validation.ts
│       └── index.ts         PUBLIC API — the only file others may import
├── components/
│   ├── ui/                  Design-system primitives (Button, Section, MediaFrame, Burst, Stamp, Logo…)
│   ├── motion/              Motion primitives (Reveal, Stagger, TextReveal, ImageReveal, Parallax, Marquee…)
│   ├── sections/            Brand-level sections reused across pages (CtaSection)
│   └── layout/              Site chrome (RootLayout, SiteHeader, MobileMenu, SiteFooter, ScrollManager)
├── hooks/                   Generic hooks reused by 2+ features (usePrefersReducedMotion)
├── lib/                     Framework-agnostic helpers (cn, motion constants, gsap loader)
├── config/                  Static config & content: site copy, services catalogue, navigation, routes, env
├── styles/                  Global CSS: tokens, reset, base, utilities, fonts.ts, breakpoints.ts
├── assets/                  assetRegistry.ts (all real media) + generated/imageManifest.ts (from `npm run assets`)
└── types/                   Shared types (media.ts: ResponsiveImage, VideoAsset)
assets/originals/            Original supplied media, byte-identical, never edited (not deployed)
scripts/                     Node build scripts (optimize-assets.mjs, build-fonts.mjs, build-icons.mjs) + vite-plugin-seo.ts
public/                      Files served as-is at a fixed URL (favicon, apple-touch-icon, brand/ logos, og/ social card, assets/ optimized media, fonts/); robots.txt + sitemap.xml are generated at build
docs/brand/                  Brand guidelines, design system, logo guidelines
.agents/skills/              Agent-agnostic skills (adsflux-brand) — symlinked into .claude/skills/
.claude/skills/              Project skills for Claude Code
```

Only create a folder when the first file needs it — no empty placeholder folders.

## Dependency rules

```
app  →  pages  →  features  →  components (sections → layout/motion/ui) / hooks  →  lib / config / styles / types
```

- A layer may import from layers to its **right**, never to its left.
  `components/ui` must never import from `features` or `pages`.
- **Features never import from other features.** If two features need the same thing, move it down
  to `components/`, `hooks/` or `lib/`. If they need to coordinate, compose them in a page.
- Import a feature only through its `index.ts`: `import { PricingTable } from '@/features/pricing'`,
  never `@/features/pricing/components/PricingTable`.
- `lib/` has zero React imports where possible — pure TypeScript, easy to test.
- Circular imports are a lint error (`import/no-cycle`).
- `config/` sits at the bottom, so it must not import from features or components. Content needed by both chrome
  (nav, footer) and features — like the services catalogue — therefore lives in `config/`, not in a feature.
- Cross-cutting client state used by several pages (none exists today) goes in a feature or `hooks/`, not in
  `app/`, because pages may not import from `app/`. Section tones are CSS (`data-theme`), not React state.

## Where does this go? (decision order)

1. Is it a visual building block with no business meaning (button, card, input, modal)? → `components/ui/<Name>/`
2. Is it part of the site frame shown on every page? → `components/layout/<Name>/`
3. Is it an animation wrapper with no content of its own? → `components/motion/`
4. Is it a full section reused on several pages with no feature data (CTA band)? → `components/sections/<Name>/`
5. Is it a route? → `pages/<route>/`; a section only that page uses → `pages/<route>/sections/`
6. Does it belong to one product area (showcase, case studies, pricing, contact form, testimonials)? → `features/<area>/`
7. Is it a hook used by 2+ features? → `hooks/`
8. Is it a pure function / client / formatter? → `lib/`
9. Is it static content shared by several layers (site copy, services list, nav), or env access? → `config/`

When unsure between a feature and a shared folder, **start in the feature**; promote it to a shared
folder the second time another feature needs it ("rule of two").

## Naming

| Thing                    | Convention                         | Example                    |
| ------------------------ | ---------------------------------- | -------------------------- |
| Component file & folder  | PascalCase                         | `SiteHeader/SiteHeader.tsx`|
| Component styles         | `<Component>.module.css`           | `SiteHeader.module.css`    |
| Hook                     | camelCase, `use` prefix            | `useScrollSpy.ts`          |
| Util / lib file          | camelCase, named for what it does  | `formatPrice.ts`, `cn.ts`  |
| Feature / page folder    | kebab-case                         | `features/case-studies/`   |
| Types file               | `types.ts` in its module           | `features/pricing/types.ts`|
| Constants                | `SCREAMING_SNAKE_CASE` values      | `MAX_ITEMS`                |

## Imports & exports

- Use the `@/` alias (→ `src/`) for anything outside the current folder. Use `./` only for siblings
  inside the same module. Never `../../`.
- **Named exports only** (`export function Button`), no default exports — keeps names consistent
  across renames and grep-able.
- Every component folder has an `index.ts` re-exporting its public pieces.
- Barrel files (`index.ts`) exist at module boundaries only: each component folder, `components/ui`,
  `components/layout`, and each feature. Don't create a barrel for `lib/` or `hooks/` — import the file directly.
- Import order: external packages → `@/` aliases → relative → styles last.

## Colocation

Keep things next to what uses them: a component's styles, tests (`Button.test.tsx`), stories and
local types live in its folder. Only move something "up" when a second consumer appears.
