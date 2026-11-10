---
name: adsflux-brand
description: Adsflux's "Electric Editorial" brand system — Paper Cream / Electric Cobalt / Signal Orange / Ink / Soft Blue / Dusty Peach palette, the "Midnight Editorial" dark mode (light/dark colour modes, theme toggle) and the six scoped tones, Instrument Serif + Space Grotesk + DM Sans + DM Mono typography with the serif-italic <em> signature, the serif wordmark with the orange signal burst, sharp frames + pill controls, collage layouts, motion and accessibility rules, voice and copy. Use for ANY visual or copy work on the Adsflux website — creating or modifying a page, section, component, CSS, colour, font, logo, image, video, animation, CTA, headline or marketing copy — when choosing a section tone, adding photography or placeholders, and before reviewing UI for brand consistency.
---

# Adsflux Brand System — Electric Editorial

**Adsflux** is a creative and growth agency for ambitious brands (India + international). **Positioning: "We make brands impossible to ignore."** Hero: "Good marketing gets attention. Great creative makes people *care.*" Supporting: "We combine strategy, storytelling and performance to help ambitious brands grow."

Personality: bold, creative, experimental, confident, contemporary, premium, culturally relevant. The site should feel like an **independent studio / fashion editorial / culture magazine / experimental campaign** — never a generic marketing agency, a SaaS template or a dark tech site.

**Two modes, one studio.** Light = **Electric Editorial** (warm cream, cobalt highlights, orange accents). Dark = **Midnight Editorial** (midnight paper, ivory type, cobalt and ember accents, slate depth; cinematic, never pure black, never neon). Same layout, type, imagery, motion and copy; only tokens change. Light by default, header toggle to switch (choice saved).

Full specs: `docs/brand/BRAND_GUIDELINES.md` (brand, colour, type, voice), `docs/brand/DESIGN_SYSTEM.md` (tokens, components, motion), `docs/brand/LOGO_GUIDELINES.md`. Live reference: `/brand`. CSS mechanics: the `frontend-design-system` skill.

## 1. Non-negotiables

1. **Two fixed palettes, no others.** Light: Paper Cream `#F5F0E7` (primary background) · Electric Cobalt `#263BDB` (major moments, CTAs, selected sections) · Signal Orange `#FF633E` (controlled accent: fills, stickers, the burst) · Ink Black `#171717` (type, contrast) · Soft Blue `#DCE5FF` · Dusty Peach `#E8B8A5` (supporting). Dark (Midnight Editorial): Midnight `#11131B` (background) · Slate `#1D2230` (surfaces) · Cream as ivory type · Mist `#A8A9BD` (muted) · Electric `#5268FF` (graphics, large type) · Ember `#FF754F` (accent) · Graphite `#353949` (borders), plus derived tints Electric ink `#7B8AF9`, Slate raised `#282C39`, Dusk `#262429`. No new colours, no gradient backgrounds, no neon, no glows, no predominantly black pages.
2. **Never write a hex value in a component.** Use semantic tokens (`--color-text`, `--color-accent-ink`, `--color-highlight`…) from `src/styles/tokens.css`.
3. **Contrast is fixed by the tone, not by you.** Orange is never text on cream (2.60) or cobalt (2.60). Ink is never text on cobalt (2.33). Cream is never text on blue (1.11). Cobalt text on peach is large-text-only (4.33), so the peach tone's accent ink is ink. In dark mode Electric `#5268FF` is large-text/graphics only (4.22 on midnight) and never button text (cream 3.87), so the CTA stays cobalt + cream and small accent text uses Electric ink (6.04).
4. **Tones, not backgrounds.** Theme a block with `<Section tone="cream|blue|peach|cobalt|orange|ink">` or `data-theme` on the element. Cream leads; cobalt for big moments (not adjacent); one orange strip; **at most one ink band per page**. Tones render in both modes automatically; never pick colours by reading the mode, never write a `[data-theme='dark']` override in a component.
5. **Type:** Instrument Serif (display, 400 roman + italic only) · Space Grotesk (section headings/UI, 500/700) · DM Sans (body 400/500/600, base 17px) · DM Mono (labels/metadata, uppercase, 0.06em). Only via `--font-display/-heading/-body/-mono`. **Serif for expressive display moments and `<em>` accents; grotesk for section headings at moderate sizes.** Never set oversized geometric sans everywhere.
6. **Shape:** sharp frames (radius 0) for images, modules, panels; pill controls for buttons, tags, chips. **No rounded cards, no glassmorphism, no blurred drop shadows** (use `--shadow-offset`).
7. **Never retype or redraw the logo.** Use `<Wordmark />` / `<Monogram />` or `public/brand/*.svg`. The burst colour comes from the tone.
8. **Authentic imagery only.** Real campaign work from `@/assets/assetRegistry`, or `PlaceholderArt` where none exists. Never stock photos or generic AI-generated illustrations. Each asset is used once on the site.
9. **Never present sample content as real.** Showcase, work, testimonials and pricing are SAMPLE; outcomes only with verified data.

## 2. Tones at a glance

| Tone | Text | Accent ink | Primary CTA | Dark mode renders as | Use |
|---|---|---|---|---|---|
| `cream` (default) | Ink | Cobalt | Cobalt pill → orange on hover | Midnight · cream text · Electric ink | Most sections, hero |
| `blue` | Ink | Cobalt | Cobalt pill → ink | Slate · cream text · Electric ink | Supporting bands, footer |
| `peach` | Ink | Ink | Ink pill → cobalt | Dusk · cream text · Peach ink | Supporting modules, closing blocks |
| `cobalt` | Cream | Cream | Cream pill → orange | Cobalt (unchanged) · Ember accents | Big moments: philosophy, contact, mobile menu |
| `orange` | Ink | Ink | Ink pill → cobalt | Ember · midnight text | Rare loud strip (ticker), one module |
| `ink` | Cream | Orange | Orange pill → cream | Ink · Ember accents | Once per page max (showcase gallery) |

**Colour mode mechanics:** `<html data-theme="light|dark">` (set before first paint by the inline script in `index.html`, then `src/lib/theme.ts`; `useTheme()` in React; `ThemeToggle` in the header). Theme tokens (`--background`, `--foreground`, `--surface`, `--primary`, `--accent`…) feed the tones; components only use `--color-*`. Details: `docs/brand/DESIGN_SYSTEM.md` → *Colour mode*.

Home rhythm: cream hero → orange ticker → cream services (multi-tone modules) → peach Scalvo platform → ink showcase → cobalt philosophy → blue work → cream clients → cobalt contact → blue footer.

## 3. Building a new page — checklist

1. **Route.** Create `src/pages/<route>/<Route>Page.tsx` + `index.ts` (named export), page-only sections in `sections/`. Add the path to `src/config/routes.ts` and a `React.lazy` route in `src/app/AppRoutes.tsx`.
2. **Meta.** Render `<title>… — Adsflux</title>` inside the page component (React 19 hoists it).
3. **Plan the tone rhythm** before writing JSX: list sections with tones. Mostly cream; one or two cobalt moments, not adjacent; blue/peach to support; ≤ 1 orange band; ≤ 1 ink band. The footer is blue, so don't end on a blue section (end on cobalt `CtaSection` or cream).
4. **Hero.** The header is sticky and opaque in normal flow, so no header offset is needed. Use `Section spacing="none" texture` with your own padding, `Container size="xl"`, a mono masthead row (`.label`), and a display headline: a grotesk lead + a serif punch line (`--font-display`, `--text-display`) with one `<em>` word and a `Burst`. One `TextReveal trigger="mount"`.
5. **Sections.** Compose from `Section` + `Container size="xl"` + `SectionHeading` (`index="01"`, `eyebrow`, `title` with one `<em>` phrase, short `description`, optional `actions`). Number sections in order.
6. **Composition.** Prefer collage (overlapping `MediaFrame`s, `Parallax`, `ImageReveal`, an offset shadow, a `Stamp`) and asymmetric 12-col splits over uniform grids. No card grids.
7. **CTAs.** One primary `ButtonLink` per view (`withArrow` for forward motion); others `secondary` or `ghost`. Label: "Start a project" (from `primaryCta`). End with `<CtaSection>` (cobalt default) or a contact block.
8. **Motion.** `Reveal` for blocks, `Stagger` for lists, `ImageReveal` for media, at most one or two `TextReveal`s, one `ScrollHighlightText` at most. Don't animate everything.
9. **Content.** Copy in `src/config/*` or `src/features/<x>/content.ts`, not inside primitives. Flag sample content and show `<Badge>Sample content</Badge>`.
10. **Verify.** `npm run check` (zero warnings) and `npm run build` (initial JS ≤ 120 KB gzip) pass; no horizontal scroll at 390 / 768 / 1024 / 1440; keyboard-only navigation works with visible focus; reduced motion checked; every tone used has passing contrast **in light and dark mode** (flip the header toggle).

## 4. Modifying existing UI

- Find the token or primitive first. Need a new visual value? Add a **semantic token** in `tokens.css`: in the cream (`:root`) and blue blocks (via a theme token if it differs by mode) **and** in the light and dark blocks of peach, cobalt, orange and ink.
- Extend a primitive with a new typed `variant`/prop rather than overriding styles at the call site.
- Change service names/summaries only in `src/config/services.ts`; per-service visuals in `src/features/services/looks.ts` (`MODULE_RHYTHM`).
- Change site copy (hero lines, supporting message, markets, socials) only in `src/config/site.ts`; nav and CTA in `src/config/navigation.ts`.
- Keep the home tone rhythm intact (documented in `src/pages/home/HomePage.tsx`). If you move a section, re-check adjacency.

## 5. Layout principles

- **Cream leads, tones punctuate.** A full-bleed tone change is an event; earn it.
- **12-column, asymmetric:** `SectionHeading layout="split"` (title 8 cols, aside 4); collages with irregular spans and staggered offsets; slight rotation (≤ 2°) on at most two "pasted" pieces.
- **Typography-led.** A section can be one big sentence. Paragraphs ≤ 3 sentences, ≤ 60ch.
- **Editorial details:** mono indexes `(01)`, masthead rows with hairline rules, oversized serif numbers, pull quotes with a serif italic phrase.
- `Container size="xl"` for editorial sections, `"sm"` for forms/prose. `Section spacing="lg"` for key moments. `texture` (paper) on hero, statement and tone bands, not everywhere.
- Same identity, varied composition: don't copy-paste one layout across pages.

## 6. Components

Import from `@/components/ui`, `@/components/motion`, `@/components/sections`, and features through their `index.ts`.

- **Primitives:** `Button` / `ButtonLink` (`variant` primary·secondary·ghost, `size` sm·md·lg, `withArrow`), `AppLink` (`href`), `Badge` (outline·solid·highlight, `dot`), `Burst` (`color` shape-1·shape-2·current, `rays` 8·12, `spin`), `Stamp` (`text`), `Eyebrow` (`index`), `Container` (`size`), `Section` (`tone`, `spacing`, `texture`, `divider`), `SectionHeading` (`title`, `eyebrow`, `index`, `description`, `actions`, `as`, `layout`), `MediaFrame` (`ratio`, `src`, `videoSrc` + `poster`, `alt`, `art`, `artTone`, `placeholderLabel`, `placeholderMeta`, `isVideo`, `priority`, `width`, `height`), `PlaceholderArt`, `Field` + `Input`/`Textarea`/`Select`, `Dropdown`, `Wordmark`, `Monogram` (`variant` cobalt·cream·orange).
- **Motion:** `Reveal`, `Stagger`/`StaggerItem`, `TextReveal` (`trigger` mount·inView), `ImageReveal` (`from`), `Parallax` (`distance`, `axis` x·y), `ScrollHighlightText`, `Marquee`. `MotionProvider` is already mounted.
- **Sections:** `CtaSection` (`title` with `<em>`, `primaryAction`, `secondaryAction`, `tone` cobalt·orange·peach·blue).
- **Layout (already in `RootLayout`):** `SiteHeader` (mono-indexed nav, pill CTA), `MobileMenu` (cobalt sheet), `SiteFooter` (soft-blue signature), `ScrollManager`.
- **Features:** `ServiceModules` (multi-tone modules, `MODULE_RHYTHM`), `CampaignCollage` (reels row + stills collage; sticky discipline chips bring the chosen category's results to the top), `CaseStudyFeature` (challenge / what we made / outcomes only if real), `TestimonialSection` (editorial spread, `emphasis` phrase in serif), `PricingTable`, `ContactForm`.

## 7. Motion rules

- Motion tells the story; it never decorates. Expo-out easing, ≤ 32px travel, play once. Durations/easings from `@/lib/motion` or CSS tokens.
- `motion/react` under `LazyMotion strict`: **use `m.div`, never `motion.div`**.
- GSAP only for scroll-linked work, via `loadScrollTrigger()` from `@/lib/gsap` (lazy). Use `gsap.context()` and `revert()` on cleanup. Never import `gsap` statically.
- No Lenis (deliberate). No scroll-jacking.
- **Respect reduced motion:** `MotionConfig reducedMotion="user"` handles `m.*` transforms; GSAP components check `usePrefersReducedMotion()` and render static; CSS loops (`Marquee`, `Stamp`, `Burst spin`) must stop in a `prefers-reduced-motion` block; videos don't autoplay (their play/sound controls stay).
- **Gotchas:** never put `whileInView` on an element that starts fully clipped (inside an `overflow: hidden` mask or `clip-path: inset(100%…)`): observe the visible parent and drive children via variants (see `TextReveal` and `ImageReveal`, whose observer is the outer unclipped element).
- Budget: initial JS ≤ 120 KB gzip (currently ~122 KB — over). Don't add animation libraries.

## 8. Responsive & accessibility

- Mobile-first, `min-width` breakpoints `640 / 768 / 1024 / 1280 / 1536`. Fluid type tokens, not breakpoint font tweaks. Grid tracks holding big type: `minmax(0, Nfr)`. Sections with oversized type or parallax: `overflow: hidden`.
- No horizontal scroll at 360/390, 768, 1024, 1440. Collages simplify on mobile, they don't disappear.
- WCAG 2.2 AA via tone tokens (section 1 rule 3). Semantic HTML, one `h1`, labelled `nav`s, visible `:focus-visible`, targets ≥ 44px, `aria-pressed` on toggle chips.
- Animated text keeps a `.visually-hidden` copy with animated words `aria-hidden`. Decorative graphics (`Burst`, `Stamp`, placeholder art, collage) are `aria-hidden`. Real photography needs real alt text.

## 9. Imagery & copy

- **Imagery in dark mode:** never `invert()`, filter or blend photography; campaign images, the hero cards and the phone keep their colours. Only token-driven graphics (blob, brush strokes, orbit, placeholder art) adapt.
- **Imagery:** authentic campaign photography and video only. Until supplied, `MediaFrame` renders `PlaceholderArt` (`sun`, `arch`, `stripes`, `halftone`, `burst`, `stack`) in a tone that contrasts with its section. Videos: `MediaFrame videoSrc + poster` (MP4 H.264 + AAC, ≤ 15 s, ≤ 4 MB; autoplay muted while visible, built-in play/pause + opt-in sound controls, no autoplay under reduced motion; reels via `npm run videos`). Images: never hand-place files. Originals go in `assets/originals/`, `npm run assets` generates AVIF + WebP variants into `public/assets/<group>/`, and you register them in `src/assets/assetRegistry.ts` (alt, subject, placement, attribution), then render with `<MediaFrame image={…} sizes="…" />`. Only the hero LCP image gets `priority`, and never wrap it in an entrance animation. Inventory and rationale: `docs/assets/ASSET_INVENTORY.md`. Client attribution is unconfirmed, so use neutral category captions, no client names or results.
- **Copy:** short, declarative, concrete, sentence case, British/Indian spelling, `₹` and `L` for lakh. Headlines ≤ ~8 words with one `<em>` phrase on the payoff. CTA: "Start a project". No jargon ("leverage", "360°", "best-in-class", "next-level").
- **Truthfulness:** showcase, work, testimonials and pricing content is SAMPLE (`IS_SAMPLE_*` flags). Never invent metrics, quotes or names. `outcomes` only with verified, client-approved data. Socials render "soon" until URLs are set; `siteConfig.url`/`email` are empty; the contact form needs `VITE_CONTACT_ENDPOINT`.

## 10. Avoid

Generic agency visuals (rockets, growth charts, handshakes) · SaaS dashboard aesthetics (KPI tiles, icon grids) · rounded or bubbly cards · glassmorphism, glows, neon · gradient backgrounds · predominantly black pages or more than one ink band · pure-black dark mode, neon green, inverted images, heavy theme-switch animations · orange text on cream/cobalt · oversized grotesk everywhere instead of serif display moments · more than one `<em>` phrase per heading · extra colours, fonts or weights · faux-bold serif · stock photos or AI illustrations · retyped or recoloured logos · decorative animation that doesn't reveal hierarchy · the same layout copy-pasted across pages.
