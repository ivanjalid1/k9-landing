# K9 Movement website

Multi-page marketing site for K9 Movement (premium dog training & pet care, Halton Region, Ontario).
Vite + React 19 + TypeScript + Tailwind CSS 4, React Router 7 (declarative `BrowserRouter`) and Motion
(`motion/react`) for animation. Builds to static files.

## Page map

| Path | Page | Built from |
| --- | --- | --- |
| `/` | Home | `Hero`, `Values`, `ServicesOverview` (cards link to the pages below), `StoryTeaser`, `Statement` marquee, `FinalCTA` |
| `/training` | Dog training | `PageHeader`, `TrainingDetail` (assessment + programs), `Process` (3 steps), `Statement`, `FinalCTA` |
| `/pet-care` | Walks, drop-ins, house sitting, boarding | `PageHeader`, `CareServices` (expandable rate tables, `#walks` / `#overnight` anchors, transportation), `FinalCTA` |
| `/about` | Emma, Angel & Romeo | `PageHeader`, `Founder` (Emma, her own text, two photos, quote), `Pack` (Angel, Romeo, Bonita, Casper; text in `src/data/pack.ts`), `Values`, `FinalCTA` |
| `/service-area` | Halton Region | `PageHeader`, `ServiceArea` (towns link to anchors), `TownDetails` (`#oakville`, `#burlington`, `#milton`, `#halton-hills`), `FinalCTA` |
| `/faq` | FAQ | `PageHeader`, `FaqList` (accordion), `FinalCTA` |
| `/contact` | Contact | `PageHeader`, `ContactBlock` |
| `*` | 404 | `PageHeader` with links home / contact |

Pages live in `src/pages/pages.tsx`; paths and labels in `src/data/pages.ts` (nav and footer read from there).
Each page sets its own `<title>`, meta description, canonical and Open Graph title/description/url via
`useSeo()` (`src/lib/seo.ts`). `index.html` keeps the home-page defaults for crawlers that don't run JS.

## Run and build

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
npm run lint
```

Deploy: upload the contents of `dist/` to the web root.

- **Apache:** `public/.htaccess` is copied into `dist/` and sends every non-file path (`/training`, `/faq`, …) to `index.html`.
- **Vercel:** `vercel.json` rewrites all routes to `/index.html` (static files are served first).

Direct links and refreshes on any page work with either.

## Where to change things

| What | Where |
| --- | --- |
| **Book Now URL** (every booking / assessment / apply button) | `BOOK_NOW_URL` in `src/config.ts` (default `https://k9movement.com/form`, marked TODO) |
| Phone, email, Instagram, website | `CONTACT` in `src/config.ts` |
| Towns in the service area | `SERVICE_AREA` in `src/config.ts` |
| Services, descriptions, rates, notes | `src/data/services.ts` |
| FAQ questions and answers | `src/data/faq.ts` |
| Town paragraphs (service-area page) | `src/data/towns.ts` |
| Page paths / nav labels | `src/data/pages.ts` |
| Placeholder photos | `PHOTOS` in `src/config.ts` |
| Colours, fonts, cut-corner and texture styles | `src/index.css` |

## Brand assets

`brand-assets/` holds the designer's original files and is never modified. `npm run assets`
(`scripts/optimize-assets.mjs`, uses `sharp`) regenerates the web versions:

- `src/assets/photos/` real photos from `brand-assets/About Us (Fini)/` (HEIC decoded with ffmpeg, JPEG orientation from EXIF, then cropped/resized to WebP):

  | File | Source | Used in |
  | --- | --- | --- |
  | `hero-angel-romeo.webp` | General Images / Fondo Portada Angel y Romeo.png | Home hero background |
  | `creek-1000/2000.webp` | General Images / Angel & Romeo.JPG | Final call-to-action background (all pages) |
  | `angel-portrait.webp` | Angel / Angel2.heic (3:4 crop) | Home "Meet Angel & Romeo" teaser |
  | `romeo-portrait.webp` | Romeo / Romeo2.heic (3:4 crop) | Home teaser |
  | `angel-water.webp` | Angel / Angel.JPG (crop) | About, "The pack" |
  | `romeo-grass.webp` | Romeo / Romeo.heic (crop) | About, "The pack" |
  | `bonita.webp` | Bonita / Bonita2.jpg | About, "The pack" |
  | `casper.webp` | Casper / Casper.jpg | About, "The pack" |
  | `emma-field.webp`, `emma-woods.webp` | Emma / Emma.JPG, Emma2.JPG | About, "Meet Emma" |

  Not used: `Angel3.heic` (snow, extra), `Bonita.avif` (heavy black window bars, 622px). The AI studio avatars
  (`Angel & Romeo Avatars/`) are no longer used anywhere.
- `src/assets/leaves/` the four leaf SVGs (copied unchanged), used as small swaying accents on light sections.
- `src/assets/pine/` five pine/spruce/fir elements as WebP (≤560px).
- `src/assets/patterns/` Stride Pattern 2 (statement band) and Trailhead Map (services and service area).
- `src/assets/logo/`, `src/assets/icons/` SVGs copied unchanged. The e-mail icon only exists with its text label, so its viewBox is cropped to the icon.
- `public/favicon.svg` (colour isotype), `public/apple-touch-icon.png`, `public/og-image.jpg` (1200×630).

## Typography: font substitution

Headlines are meant to be set in **Snaga Uni Display**, which is a commercial font and not on Google Fonts.
For now they use **Archivo** at its widest setting (`font-stretch: 125%`, weight 800), loaded from Google Fonts
in `index.html`. Body text is **DM Sans**.

To switch to the real font, put the licensed `.woff2` files in `src/assets/fonts/` and uncomment the
`@font-face` block at the top of `src/index.css`. The font stack already lists Snaga first. You can then
remove `Archivo` from the Google Fonts link in `index.html`.

## Animation

Library: **Motion** (`motion/react`). Shared variants and hooks are in `src/lib/motion.ts`; reusable pieces
(`Reveal`, `Stagger`, `Pine`, `Magnetic`, `Tilt`, `WordReveal`) in `src/components/motion.tsx`; CSS keyframes
(pine sway, hero Ken Burns, marquee, 45° texture drift, button sweep) in `src/index.css`.

- Only `transform`, `opacity` and `clip-path` are animated, except the accordion rows, which open with a `grid-template-rows` transition so the content height is exact.
- `<MotionConfig reducedMotion="user">` plus explicit checks: with *reduce motion* on, entrances become plain fades, parallax/tilt/magnetic effects are off and CSS loops stop.
- Parallax distances are roughly halved below 768px; hover effects only apply to devices that support hover.

## FAQ items waiting for Emma

These are in `src/data/faq.ts` with `todo: true` and are **not shown** on the site until answered
(remove the `todo` flag and write the answer):

- What is your cancellation policy? (notice period, fees, holiday bookings)
- Are you insured? (insurance / bonding details)
- How do I pay? (accepted payment methods, when payment is due)
- Does my dog need to be vaccinated? (requirements for walks, pack walks and boarding)

## TODO before launch

- [ ] Confirm `BOOK_NOW_URL` points at the live intake form.
- [ ] One Unsplash placeholder remains (`PHOTOS` in `src/config.ts`): the **Our approach (values)** background, a dark misty forest (`photo-1448375240586-882707db888b`). The cards cover most of it, so the dog photos don't suit it; ideal is a wide, dark forest or trail shot.
- [ ] Ask the designer for a larger export of `Fondo Portada Angel y Romeo` (source is 1264px wide; the home hero shows it at up to ~1000px, slightly soft on retina screens).
- [ ] Add the licensed Snaga Uni Display webfont (see above).
- [ ] Confirm the boarding copy ("rates confirmed once your application has been reviewed") and the house-sitting surcharges (taken from the old site).
- [ ] Answer the four FAQ placeholders above.
- [ ] Review the town paragraphs in `src/data/towns.ts` (kept general on purpose; add real local detail if wanted).
- [ ] Optional: add real client testimonials once available. None are shown, to avoid placeholder reviews.
- [ ] Optional SEO step: prerender each route to static HTML (e.g. a prerender plugin) so non-JS crawlers see per-page titles.

## Screenshots

`screenshots/` has, for every page at 375px and 1440px, a first-screen capture (`<page>-<width>.png`, taken after the
entrance animation) and a full-page capture (`-full.png`), plus four mid-scroll home-page shots per width
(`home-<width>-scroll-N.png`) with animations running. To regenerate, start the dev server and run
`npm run screenshots` (or `node scripts/screenshots.mjs http://localhost:5173 screenshots [--reduced]`).
The script also prints each page title and whether there is horizontal overflow.
