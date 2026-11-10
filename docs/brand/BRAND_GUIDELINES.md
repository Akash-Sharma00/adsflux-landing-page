# Adsflux Brand Guidelines

> **We make brands impossible to ignore.**
> Good marketing gets attention. Great creative makes people care.

Visual direction: **Electric Editorial**. Live reference: run the site and open **`/brand`**.
Implementation: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · Logo: [LOGO_GUIDELINES.md](./LOGO_GUIDELINES.md) · Agent skill: `.agents/skills/adsflux-brand/SKILL.md`.

---

## 1. Who we are

Adsflux is a creative and growth agency for ambitious brands in **India and international markets** ("India & worldwide"). We combine strategy, storytelling and performance under one roof.

| Service | One-line promise |
|---|---|
| Digital marketing strategy | Growth plans built on audience truth, not channel habits. |
| Performance marketing | Paid media engineered for profitable, compounding growth. |
| UGC & influencer | Creators who make your audience stop scrolling and start buying. |
| Creative & video production | Campaign films, ad creative and content made to perform. |
| Branding & brand strategy | Identities with a point of view — and the system to scale it. |
| Social media management | Always-on social that builds culture, not just calendars. |
| SEO & content marketing | Search visibility and content that earns attention for years. |
| AI-powered creative | Faster testing and more variations, directed by human taste. |

The canonical list (titles, summaries, capabilities) lives in `src/config/services.ts`. Change it there and nowhere else.

## 2. Positioning & direction

**Adsflux looks like an independent creative studio and works with the accountability of a performance agency.**

The direction, **Electric Editorial**, borrows from:

- **Independent creative studios**: a confident point of view, work-first pages, no corporate filler.
- **Fashion editorials**: serif display type, generous crops, collage, sharp frames.
- **Culture magazines**: masthead rows, mono metadata, numbered sections, pull quotes.
- **Experimental campaigns**: a loud signal colour, a sticker, a ticker, a burst. Used with control.

What it is **not**: a generic "digital marketing agency" (no rocket ships, growth-chart clip art or stock handshakes), a SaaS template (no KPI tiles, icon grids or dashboards), or a dark "tech" site.

**Two modes, one studio.** Light mode is Electric Editorial: warm cream paper, cobalt highlights, orange graphic accents. Dark mode is **Midnight Editorial**: the same magazine with the lights down. It is cinematic and premium: midnight paper (not black), warm ivory type, cobalt and orange accents, depth from slate surfaces and hairlines. It is not a neon "tech" dark theme. Layout, type, imagery, motion and copy are identical in both modes; only the tokens change. Visitors get light mode by default and can switch with the header toggle.

## 3. Personality

| We are | Which means | We are not |
|---|---|---|
| **Bold** | Big type, few words, clear opinions | Loud for the sake of it |
| **Creative** | Unexpected compositions, collage, asymmetry | Random or decorative |
| **Experimental** | We try formats, mix serif and grotesk, break the grid on purpose | Unusable or illegible |
| **Confident** | Short declarative sentences, no hedging | Arrogant or jargon-heavy |
| **Contemporary** | Creators, AI, performance, social-first formats | Trend-chasing |
| **Premium** | Restraint, craft in details, real photography | Cold, corporate or exclusive |
| **Culturally relevant** | Work people choose to watch, references people recognise | Out of touch or try-hard |

## 4. Voice & messaging

**Rules**

1. **Short.** Headlines ≤ 8 words where possible. Paragraphs ≤ 3 sentences.
2. **Declarative.** "We make brands impossible to ignore." Not "We aim to help brands become more visible."
3. **Concrete over abstract.** "Campaign films" beats "creative solutions".
4. **One idea per block.** If a section says two things, split it.
5. **One emphasised phrase per heading.** Wrap it in `<em>` and it renders in Instrument Serif italic: "Eight ways we make brands *impossible to ignore.*" Emphasise the payoff, not filler words.
6. **Sentence case** everywhere. Write the name as "Adsflux" in running text.
7. **British/Indian English** spelling (optimisation, programme, colour). Use `₹` for INR and `L` for lakh (`₹2L – ₹5L / month`).

**Messaging hierarchy** (source: `src/config/site.ts`, page sections)

| Level | Copy | Where |
|---|---|---|
| Positioning | We make brands impossible to ignore. | Page title, OG title, services heading |
| Hero lead | Good marketing gets attention. | Hero, grotesk line (`siteConfig.heroLead`) |
| Hero punch | Great creative makes people *care.* | Hero, serif display line (`siteConfig.heroPunch`) |
| Supporting | We combine strategy, storytelling and performance to help ambitious brands grow. | Under the hero (`siteConfig.supportingMessage`) |
| Philosophy | Attention is *earned.* Growth is *engineered.* | Philosophy section |
| Pillars | Strategy · Storytelling · Performance | Hero masthead, stamp, philosophy principles |
| Contact | Have something worth *making noise* about? | Contact section |
| Footer | Strategy, storytelling *and* performance — for brands with something to say. | Footer signature |
| Primary CTA | Start a project | Header, hero, mobile menu, footer (`primaryCta` in `src/config/navigation.ts`) |

**Do / Don't**

| Do | Don't |
|---|---|
| "Campaigns that *earn the scroll.*" | "We deliver best-in-class, results-driven solutions." |
| "Start a project" | "Click here to get started today!" |
| "Every idea measured, every rupee accountable." | "Leverage", "360°", "next-level", "game-changing" |
| Name the format: "UGC reel", "Product film" | "Content", "assets", "deliverables" with no detail |

## 5. Colour

Six colours per mode: the light palette below and the Midnight Editorial dark palette (section 5b). **Do not add colours beyond these two palettes.** Hex values live only in `src/styles/tokens.css`.

| Name | Hex | Role |
|---|---|---|
| **Paper Cream** | `#F5F0E7` | Primary background. Most of every page is cream. |
| **Electric Cobalt** | `#263BDB` | Major moments: primary CTAs, selected full-bleed sections (philosophy, contact), the mobile menu, accent ink on light tones. |
| **Signal Orange** | `#FF633E` | Controlled secondary accent: fills, stickers, chips, the burst, one ticker band. **Never text** on cream or cobalt. |
| **Ink Black** | `#171717` | Typography and contrast. At most **one ink band per page**. |
| **Soft Blue** | `#DCE5FF` | Supporting compositions: bands, modules, the footer. |
| **Dusty Peach** | `#E8B8A5` | Supporting compositions: modules, placeholder art, warm moments. |

**Balance.** Cream leads. Cobalt marks the big moments (typically two per page, never adjacent). Blue and peach support. Orange is a spark: one loud strip plus small fills. Ink appears once at most. **No predominantly black pages, no gradient backgrounds, no neon.** (Dark mode is not a black page: it is the Midnight Editorial palette below, chosen by the visitor or their OS.)

**Derived tints** (mixes of brand colours for measured contrast reasons, not new hues):

| Token | Hex | Mix | Use |
|---|---|---|---|
| Ink soft | `#4F4D4B` | Ink 75% over Cream | Secondary text on cream, blue, peach |
| Cream soft | `#CCCCE5` | Cream 80% over Cobalt | Secondary text on cobalt |
| Cream dim | `#A7A49E` | Cream 65% over Ink | Secondary text on ink |
| Danger (light) | `#B42318` | Functional | Form errors on light tones only |
| Danger (cobalt) | `#FFD2C4` | Functional | Form errors on cobalt only |

**Measured contrast (WCAG 2.x).** These numbers shape every rule above.

| Pair (text on background) | Ratio | Verdict |
|---|---|---|
| Ink on Cream | 15.79 | Pass: body and headings |
| Ink on Soft Blue | 14.25 | Pass |
| Ink on Dusty Peach | 10.10 | Pass |
| Ink on Signal Orange | 6.07 | Pass: the only text colour on orange |
| Cream on Cobalt | 6.77 | Pass: the text colour on cobalt |
| Cobalt on Cream | 6.77 | Pass: accent ink on cream |
| Cobalt on Soft Blue | 6.11 | Pass: accent ink on blue |
| Cobalt on Dusty Peach | 4.33 | Large text and graphics only. The peach tone therefore uses **ink** as its accent ink |
| Ink soft on Cream / Blue / Peach | 7.41 / 6.69 / 4.74 | Pass: secondary text |
| Cream soft on Cobalt | 4.88 | Pass: secondary text |
| Cream dim on Ink | 7.21 | Pass: secondary text |
| Orange on Ink | 6.07 | Pass: accent ink on the ink tone |
| Danger `#B42318` on Cream / Blue | 5.79 / 5.23 | Pass |
| Danger `#FFD2C4` on Cobalt | 5.59 | Pass |
| **Orange text on Cream** | **2.60** | **Fail.** Orange is a fill, never text on cream |
| **Orange text on Cobalt** | **2.60** | **Fail** |
| **Ink text on Cobalt** | **2.33** | **Fail.** Cobalt always carries cream text |
| **Cream text on Soft Blue** | **1.11** | **Fail.** Blue always carries ink text |

## 5b. Dark mode colour — Midnight Editorial

| Name | Hex | Role |
|---|---|---|
| **Midnight** | `#11131B` | Dark page background. Blue-black, never pure black. |
| **Slate** | `#1D2230` | Surfaces and supporting bands (the blue tone, the footer). |
| **Paper Cream** (as ivory) | `#F5F0E7` | All primary type on dark. |
| **Mist** | `#A8A9BD` | Muted text, control outlines, editorial rules. |
| **Electric Cobalt (lifted)** | `#5268FF` | The dark-mode primary for **graphics**: the hero blob, shapes, offset shadows, large type. Never small text, never button text. |
| **Signal Orange (lifted) / Ember** | `#FF754F` | Fills, bursts, brush strokes, the ticker band. Unlike light mode, Ember **may be text** on midnight, slate and ink (≥ 5.98:1). |
| **Graphite** | `#353949` | Hairline borders. |

Electric Cobalt `#263BDB` stays as it is: cobalt bands are still the big moments, and the primary button stays cobalt with cream text in both modes.

**Derived dark tints** (mixes, not new hues):

| Token | Hex | Mix | Use |
|---|---|---|---|
| Electric ink | `#7B8AF9` | Electric 75% over Cream | Accent text, links, indexes, focus rings on midnight and slate |
| Slate raised | `#282C39` | Cream 5% over Slate | Panels raised above a slate band |
| Dusk | `#262429` | Peach 10% over Midnight | The dark peach band: a warm counterpoint to midnight |

**Balance in dark mode.** Midnight leads, the way cream does in light mode. Cobalt still marks the big moments; slate and dusk support; Ember is the spark. The ink band stays (a neutral black wall against blue-black). Photography is never inverted, filtered or recoloured.

**Measured contrast, dark mode (WCAG 2.x).**

| Pair (text on background) | Ratio | Verdict |
|---|---|---|
| Cream on Midnight / Slate / Dusk | 16.33 / 13.98 / 13.54 | Pass: body and headings |
| Mist on Midnight / Slate / Dusk / Ink | 8.01 / 6.86 / 6.64 / 7.75 | Pass: secondary text |
| Electric ink on Midnight / Slate / Ink | 6.04 / 5.17 / 5.84 | Pass: accent ink |
| Ember on Midnight / Slate | 6.98 / 5.98 | Pass: accent ink |
| Midnight on Ember | 6.98 | Pass: the text colour on the Ember band and on Ember fills |
| Ink on Ember | 6.75 | Pass: CTA text on the ink band |
| Peach on Dusk | 8.66 | Pass: accent ink on the dusk band |
| Cream on Cobalt | 6.77 | Pass: the primary button in both modes |
| Danger `#FFD2C4` on Midnight / Slate | 13.48 / 11.53 | Pass |
| **Electric `#5268FF` on Midnight** | **4.22** | **Large text and graphics only** |
| **Cream on Electric** | **3.87** | **Fail for body.** Never button text, hence the cobalt CTA |
| **Cobalt `#263BDB` text on Midnight** | **2.41** | **Fail.** Cobalt is a fill on dark, never text |

## 6. Tones

Every section is set in one of six **tones**. A tone is a full colour scheme (background, text, muted text, accent, CTA, logo colours), not just a background.

| Tone | Background | Text | Accent ink | Primary CTA | Use |
|---|---|---|---|---|---|
| `cream` (default) | Cream | Ink | Cobalt | Cobalt pill | Most sections, hero, clients |
| `blue` | Soft Blue | Ink | Cobalt | Cobalt pill | Supporting bands (selected work), footer |
| `peach` | Dusty Peach | Ink | Ink | Ink pill | Supporting modules and closing blocks |
| `cobalt` | Cobalt | Cream | Cream | Cream pill | Big moments: philosophy, contact, mobile menu |
| `orange` | Orange | Ink | Ink | Ink pill | Rare loud strips: ticker band, one service module |
| `ink` | Ink | Cream | Orange | Orange pill | Once per page at most: the showcase gallery |

**Home page rhythm:** cream hero → orange ticker → cream services (multi-tone modules) → ink showcase → cobalt philosophy → blue work → cream clients → cobalt contact → blue footer. Never place two bands of the same tone side by side without a divider.

**The same tones in dark mode.** Tone names don't change; their rendering does. Pick tones exactly as in light mode and the dark rhythm follows.

| Tone | Dark background | Text | Accent ink | Primary CTA |
|---|---|---|---|---|
| `cream` (default) | Midnight | Cream | Electric ink | Cobalt pill → Ember |
| `blue` | Slate | Cream | Electric ink | Cobalt pill → Cream |
| `peach` | Dusk | Cream | Peach | Cream pill → Cobalt |
| `cobalt` | Cobalt | Cream | Cream | Cream pill → Ember |
| `orange` | Ember | Midnight | Midnight | Midnight pill → Cobalt |
| `ink` | Ink | Cream | Ember | Ember pill → Cream |

## 7. Typography

| Family | Role | Weights |
|---|---|---|
| **Instrument Serif** | Expressive display: hero punch line, CTA statements, philosophy lines, big numbers, quotes, every `<em>` accent | 400 only, roman + italic |
| **Space Grotesk** | Section headings (h1–h4 by default), navigation, buttons, UI | 500, 700 |
| **DM Sans** | Body copy, descriptions, forms. Base size 17px | 400, 500, 600 |
| **DM Mono** | Labels and metadata: eyebrows, indexes, captions, badges, form labels. Uppercase, +0.06em tracking | 400 (500 available) |

- **Serif for expressive display moments and `<em>` accents. Grotesk for section headings at moderate sizes.** Don't set oversized geometric sans everywhere; the drama comes from the serif.
- The signature move: a grotesk heading with one serif-italic phrase ("Campaigns that *earn the scroll.*"), or a grotesk lead set against a giant serif line (the hero).
- Instrument Serif has no bold. Never fake one (the site sets `font-synthesis: none`).
- Body copy never exceeds **60 characters per line** (`--measure`).
- Mono labels are small and uppercase. Use them for metadata, never for sentences.
- No other fonts, and no weights outside the table.

## 8. Shape, texture & graphic elements

- **Sharp frames, pill controls.** Images, modules, panels and menus have square corners (radius 0). Buttons, tags, chips and dots are pills. Nothing in between. **No rounded cards.**
- **Offset "print" shadow** (`--shadow-offset`): a solid block offset behind a lifted image, like a misregistered print. No blurred drop shadows except the dropdown overlay.
- **Paper texture**: a subtle paper-fibre overlay on selected sections (the `texture` prop). Never on every section.
- **The signal burst**: the eight-ray star from the logo, used as a graphic accent (headline punctuation, ticker separator, CTA corner, stamp centre). Decorative only.
- **The stamp**: a circular rotating text sticker with a burst in the middle. One per view at most.
- **Hairline rules and mono indexes**: `(01) Services`, masthead rows, numbered lists.
- **No** glassmorphism, frosted panels, glows, neon, gradients, 3D blobs or floating icon decorations.

## 9. Imagery & video

**Authentic campaign photography and video only**: real campaigns, productions, creators, products and behind-the-scenes from Adsflux work, with usage rights confirmed.

- Crop with intent: tight product details, off-centre subjects, editorial framing. Collage and overlap are encouraged.
- Keep colour natural. No heavy filters, duotones or colour overlays.
- **Until real media is supplied**, every frame renders an art-directed `PlaceholderArt` composition in brand tones (`sun`, `arch`, `stripes`, `halftone`, `burst`, `stack`). **Never fill the gap with stock photography or AI imagery.**
- Images: AVIF or WebP, ≤ 250 KB, sized for the slot, with `width`/`height` set.
- Video creatives: MP4 (H.264 + AAC), ≤ 15 s, ≤ 4 MB, always with a poster frame. They autoplay muted only while on screen, carry play/pause and sound pills (sound is opt-in, one audible video at a time), and never autoplay for reduced-motion users.
- Never hand-place files: originals go in `assets/originals/`, `npm run assets` generates optimized variants into `public/assets/`, and each image is registered in `src/assets/assetRegistry.ts`. Workflow and current inventory: `docs/assets/ASSET_INVENTORY.md`.

## 10. Content truthfulness

The following are **SAMPLE content**, flagged in code (`IS_SAMPLE_SHOWCASE`, `IS_SAMPLE_WORK`, `IS_SAMPLE_TESTIMONIALS`, header comments). The showcase, work and clients sections show a "Sample content" badge while their flag is `true`; any section rendering sample content should do the same:

- Showcase items (`src/features/showcase/content.ts`)
- Case studies (`src/features/work/content.ts`)
- Testimonials (`src/features/testimonials/content.ts`)
- Pricing tiers (`src/features/pricing/content.ts`)

Before launch:

- Replace them with real, approved work and quotes. Get written permission for every quote, name and logo.
- **Never invent results, metrics, quotes or named people.** Case-study `outcomes` render only when real, client-approved numbers are provided.
- Social profiles in `siteConfig.socials` render as "soon" until a URL is set.
- `siteConfig.url` and `siteConfig.email` are empty; the contact form needs `VITE_CONTACT_ENDPOINT`.
- Confirm pricing, or leave the pricing layout unpublished.
