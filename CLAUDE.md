# Goeduitje.nl - Public Website

Public-facing website for Goeduitje team activities. Users discover, customize, and book corporate team-building experiences.

**IMPORTANT**: This repo is PUBLIC WEBSITE only. All admin functionality is in goeduitje-backend.

## Project Structure

```
src/
├── app/
│   ├── (landing)/[slug]/         # City landing pages (87 pages)
│   ├── teambuilding/             # Teambuilding category page (static)
│   ├── bedrijfsuitjes/           # Bedrijfsuitjes category page (static)
│   ├── workshops/                # Workshops category page (static)
│   ├── kookworkshop/              # Kookworkshop detail page (primary URL)
│   ├── api/                      # tRPC + webhooks
│   ├── onze-uitjes/[slug]/       # Workshop detail pages (6, excl. kookworkshop)
│   ├── onze-medewerkers/         # Team photos (Server Component + Client content)
│   ├── onze-impact/              # Impact page with ToC diagrams (static images)
│   ├── recepten/[slug]/          # Recipe pages (13)
│   ├── open-kookworkshops/        # Open workshop booking (t/m 15 persons)
│   ├── jullie-ervaringen/        # Google Reviews page
│   ├── bedankt/                  # Thank-you page after configurator submission
│   └── checkout/                 # Stripe payment flow
├── components/
│   ├── ui/                       # shadcn/ui (DO NOT MODIFY)
│   ├── city-gallery.tsx          # Locaties section component
│   ├── workshop-configurator.tsx # Booking configurator + small group popup
│   ├── testimonials-carousel.tsx # Google Reviews carousel
│   └── *.tsx                     # Feature components
├── lib/
│   ├── site-config.ts            # SITE_URL (from NEXT_PUBLIC_SITE_URL env var)
│   ├── city-data.ts              # City images & data (40 cities)
│   ├── open-workshops.ts         # Types + fallback price (data is in DB)
│   └── *.ts                      # Utilities
├── server/api/routers/
│   ├── openSessions.ts           # Open workshop sessions (DB-driven, with capacity)
│   ├── booking.ts                # Booking CRUD (with sessionId FK)
│   ├── recipes.ts                # Recipe CRUD (getAll, getBySlug, create, update, delete, togglePublish)
│   ├── reviews.ts                # Google Reviews (visibility filtering)
│   ├── testimonials.ts           # Legacy testimonials
│   └── *.ts                      # Other routers
└── prisma/
    ├── schema.prisma             # Database schema (source of truth)
    ├── seed-workshops.ts         # Workshop pricing data
    ├── seed-recipes.ts           # 13 authentic Middle Eastern recipes
    └── seed-open-workshops.ts    # Migrate hardcoded dates to OpenWorkshopSession table
```

## Total Pages: 136

| Type                  | Count | Template                                                            |
| --------------------- | ----- | ------------------------------------------------------------------- |
| Static pages          | 22    | Individual page.tsx files                                           |
| City landing pages    | 87    | `(landing)/[slug]/page.tsx`                                         |
| Workshop detail pages | 7     | `onze-uitjes/[slug]/page.tsx` + `/kookworkshop`                     |
| Recipe pages          | 13    | `recepten/[slug]/page.tsx`                                          |
| Utility pages         | 7     | bedankt, checkout/\*, error, loading, cookies, privacy, voorwaarden |

## Tech Stack

Next.js 14 | TypeScript | Prisma + PostgreSQL (Neon) | tRPC | shadcn/ui + Tailwind CSS 4 | Framer Motion | Stripe | Resend

## Code Quality

```bash
npm run typecheck && npm run lint && npm run test:run
```

Fix ALL errors before committing. No exceptions.

## Testing

### Test Stack

- **Unit/Integration**: Vitest 4 + Testing Library + jsdom
- **E2E**: Playwright (Chromium)
- **Coverage**: @vitest/coverage-v8 (97.8% lines, 98.3% functions)

### Run Tests

```bash
npm run test:run          # Unit + integration (392 tests)
npm run test:coverage     # With coverage report
npm run test:e2e          # Playwright E2E (37 tests, needs dev server)
npm run test:integration  # Form→DB→Admin round-trip (needs live deployments)
npm run typecheck         # TypeScript check
npm run lint              # ESLint
```

### Test Structure

```
tests/
├── setup/vitest.setup.ts        # Global mocks (Prisma, Stripe, Resend, env)
├── unit/
│   ├── lib/                     # Utility + validation tests (5 files)
│   └── api/                     # tRPC router + API route tests (16 files)
├── integration/
│   ├── prisma-schema-validation.test.ts  # All Prisma models verified
│   ├── backend-schema-sync.test.ts       # Prisma↔Drizzle sync for shared tables
│   ├── checkout-route.test.ts            # Stripe checkout route tests
│   ├── send-email-route.test.ts          # Email sending route tests
│   ├── form-to-db-flow.test.ts           # Workshop + contact form → DB flow
│   └── form-roundtrip.test.ts            # Live: form → DB → admin API
└── e2e/
    ├── homepage.spec.ts           # Hero, nav, footer, CTA
    ├── navigation.spec.ts         # Page loads, routing
    ├── contact.spec.ts            # Contact form validation + input
    ├── booking.spec.ts            # Booking form, dates, gift card
    ├── configurator.spec.ts       # Workshop configurator interaction
    └── responsive.spec.ts         # Mobile viewport tests
```

### Forms → Database → Admin Pipeline

| Frontend Form | URL | Component File | DB Table | Backend Admin API | Admin UI |
| --- | --- | --- | --- | --- | --- |
| Workshop Configurator (multi-step) | `/` and `/onze-uitjes` (`#configurator`) | `src/components/workshop-configurator.tsx` | `WorkshopConfig` | `/api/workshops/configs` | ✅ `/workshops/configs` |
| Contact Form | `/contact` | `src/components/contact-form.tsx` | `Feedback` | `/api/content/feedback` | ✅ `/feedback` |
| Compact Contact Form | Footer (all pages) | `src/components/compact-contact-form.tsx` | `Feedback` | `/api/content/feedback` | ✅ `/feedback` |
| Feedback Form | `/feedback` | `src/app/feedback/page.tsx` | `Feedback` | `/api/content/feedback` | ✅ `/feedback` |
| Open Kookworkshop Booking | `/open-kookworkshops` | `src/app/open-kookworkshops/page.tsx` | `Booking` | `/api/bookings` | ✅ `/bookings` |

### /test Command

Available via `/test` in Claude Code (Shift+\`). Runs all tests, coverage, typecheck, lint.

## Key Features

### Open Kookworkshops (/open-kookworkshops)

- Max **t/m 15 personen** per booking
- **Database-driven**: Sessions stored in `OpenWorkshopSession` table, managed via admin backend at `/sessions`
- **Dynamic capacity**: Available seats computed from actual paid bookings (`maxCapacity - SUM(numberOfPeople)`)
- Price per person stored per session (default €60), fallback constant in `src/lib/open-workshops.ts`
- tRPC router: `src/server/api/routers/openSessions.ts` — `getUpcoming` query with Dutch date formatting
- Bookings linked via `sessionId` FK on `Booking` model
- **Date picker UI**: compact list grouped by month (e.g. "Maart 2026"), collapses after selection with "Wijzig" to reopen, auto-scrolls to form
- "Vol" badge when session is full, "Nog X plekken" when low availability
- **3 consumers**: booking page, workshop configurator popup (first 3 dates), `/onze-uitjes/[slug]` sidebar
- Seed script: `prisma/seed-open-workshops.ts` (idempotent, migrates old hardcoded data)

### Workshop Configurator

- Small group popup (<8 persons) suggests open workshops
- "Bekijk agenda" button links to `/open-kookworkshops`
- Located in `src/components/workshop-configurator.tsx`
- On submit → redirects to `/bedankt` + pushes GA4 purchase event via dataLayer
- Saves `companyName` and `btwNumber` for zakelijk bookings
- Confirmation email includes type, company info, and phone number

### Email System (DB-Driven)

- **Sender**: `guus@goeduitje.nl` (env var `FROM_EMAIL` in `src/lib/resend.ts`)
- **DB templates**: `EmailTemplate` model stores editable templates with `{variable}` placeholders
- **Fallback**: If no DB template exists (or `isActive: false`), hardcoded React email components in `src/emails/` are used
- **Logging**: Every sent email is logged to `EmailLog` table (resolved subject, body, variables, status)
- **Admin**: Templates editable at `/email-templates` in backend (TipTap rich text editor). Sent emails viewable at `/email-log`
- **Seed**: `npx tsx prisma/seed-email-templates.ts` populates default templates

| Email Type | Trigger | Template Key |
| --- | --- | --- |
| Workshop configurator confirmation | After configurator submit | `workshop-confirmation` |
| Contact form confirmation | After contact/compact form submit | `contact-confirmation` |
| Booking confirmation | After gift card or Stripe payment | `booking-confirmation` |

**Email template files** (React fallbacks): `src/emails/workshop-confirmation.tsx`, `src/emails/contact-confirmation.tsx`, `src/emails/booking-confirmation.tsx`

### Google Reviews

- Real reviews from Google Places API + bulk scraper
- Visibility controlled via `isVisible` field in database
- Admin control in goeduitje-backend `/google-reviews`
- **Google Places API** (legacy): max 5 reviews per sort order (10 total). Auto-refreshes every 24h via `checkAndRefreshCache()` in `src/server/api/routers/reviews.ts`
- **Bulk scraper** (`scripts/scrape-google-reviews.ts`): Uses `google-maps-review-scraper` npm package to fetch ALL reviews via Google Maps internal `listugcposts` endpoint. No API keys needed. Run periodically to import new reviews:
  ```bash
  npx tsx scripts/scrape-google-reviews.ts
  ```
- The scraper deduplicates by author name + timestamp. Existing reviews are skipped, edited reviews are updated.

### Lunch & Diner Pricing

- Uses **9% BTW** (food service rate, not 21%)
- Minimum persons displayed: Buffet 30, Lunch 15, Diner 15
- Prices in `prisma/seed-workshops.ts`

### GTM / GA4 Tracking

- GTM container `GTM-PZCH2S3R` loaded via `next/script` in `src/app/layout.tsx`
- Env var: `NEXT_PUBLIC_GTM_ID` (set on Vercel production)
- GTM noscript fallback in `<body>` for crawlers
- GA4 `purchase` event pushed via `window.dataLayer` on configurator submit → `/bedankt`
- Conversion tracking on `/bedankt` thank-you page

### Dynamic Pricing on Landing Pages

All prices on the 87 city landing pages are **fetched from the DB** (not hardcoded). The `(landing)/[slug]/page.tsx` Server Component queries `Workshop` + `PriceTier` models via Prisma and renders prices dynamically.

- **Revalidation**: `export const revalidate = 300` (5 minutes)
- **Fallback**: If DB returns no data, hardcoded fallback values are used
- **To change prices**: Update `PriceTier` records in DB — all landing pages reflect changes within 5 minutes
- **Migration scripts**: Use targeted scripts (e.g. `prisma/migrate-stadsspel-tiers.ts`) for production price changes. **Never run `seed-workshops.ts` on production** — it deletes all workshops first.

## City Landing Pages

87 SEO-optimized landing pages via `src/app/(landing)/[slug]/page.tsx`.

**City data source**: `src/lib/city-data.ts` (images & featured/other)
**Landing page data**: `ALL_LANDING_PAGES` array in `(landing)/[slug]/page.tsx`

| Type                | Count | Display                                                                                |
| ------------------- | ----- | -------------------------------------------------------------------------------------- |
| Kookworkshop cities | 40    | `kookworkshop-[city]` slugs                                                            |
| Vegetarisch         | 1     | `vegetarische-kookworkshop-nijmegen`                                                   |
| Teambuilding        | 2     | `teambuilding-nijmegen`, `teambuilding-arnhem`                                         |
| Bedrijfsuitje       | 3     | `bedrijfsuitje-nijmegen`, `bedrijfsuitje-arnhem`, `kookworkshop-voor-bedrijven-arnhem` |
| Stadsspel           | 40    | `stadsspel-[city]` slugs (all kookworkshop cities)                                     |
| Featured cities     | 13    | Image grid on `/onze-uitjes/kookworkshop`                                              |
| Other cities        | 27    | Text links below grid                                                                  |

Non-kookworkshop pages use `TypedLandingPage` component with type-specific themes (blue/green/indigo), content, and FAQ.
All cities have landmark images in `public/images/cities/[slug].jpg`.

### SEO Pattern (Programmatic SEO)

All 87 city landing pages follow the same programmatic SEO pattern established by the kookworkshop pages:

1. **Varied taglines per city** — Each city gets a tagline that ends up in the `<title>` tag (`Stadsspel Nijmegen | Unieke ervaring | Goed Uitje`). Key cities (Nijmegen, Arnhem, Wageningen, etc.) have unique hand-crafted taglines. Other cities use a default from a wider pool. The taglines are **structurally aligned** between kookworkshop and stadsspel for the same city (e.g. kookworkshop-arnhem: "Dé culinaire ervaring" → stadsspel-arnhem: "Dé interactieve speurtocht").
2. **City-specific hero images** — All 40 cities have landmark images in `public/images/cities/[slug].jpg`, resolved via `getCityImage()` in `src/lib/city-data.ts`.
3. **City-specific regions** — Special regions like "de Achterhoek", "de regio Nijmegen" are shared between kookworkshop and stadsspel entries for the same city.
4. **All pages in sitemap** — All kookworkshop and stadsspel city pages are listed in `src/app/sitemap.ts`.
5. **Dynamic pricing from DB** — Prices are fetched from Prisma, not hardcoded.

**When adding a new city**: Add entries to BOTH `KOOKWORKSHOP_CITIES` and the stadsspel section of `ALL_LANDING_PAGES` in `(landing)/[slug]/page.tsx`, add the city image to `public/images/cities/`, add the city to `src/lib/city-data.ts`, and add both slugs to `src/app/sitemap.ts`.

### Stadsspel Content (Client Feedback 2026-03-21)

Key content decisions for stadsspel pages (from client feedback in `staddspel-pages/Feedback for text stadsspel-pagina's/`):

- **"speurtocht in"** (not "door") — Hero, USPs, meta description, workshop cards all use "in" for stadsspel context
- **FAQ "Hoe werkt het"** uses "door of in" — The FAQ answer specifically uses "door of in {city}" to reflect flexibility
- **Flexible location** — "Het stadsspel kan op elke (toegankelijke) plek gespeeld worden" (not locked to city center)
- **Duration** — "afhankelijk van de opzet van het spel" (not "route en tempo")
- **Combineren** — Mentions both kookworkshop AND Arabisch buffet as combination options
- **Pricing** — Synced with main stadsspel page via DB (10-20 pers: €32,50 / 20+: €22,50)

## Category Pages

3 static SEO category pages linking to workshop detail pages:

| Page              | Target keywords                | File                              |
| ----------------- | ------------------------------ | --------------------------------- |
| `/teambuilding`   | teambuilding, teamuitje        | `src/app/teambuilding/page.tsx`   |
| `/bedrijfsuitjes` | bedrijfsuitje, personeelsuitje | `src/app/bedrijfsuitjes/page.tsx` |
| `/workshops`      | workshops, workshop boeken     | `src/app/workshops/page.tsx`      |

## Onze Medewerkers

Team photos page uses **Server Component** pattern (not client-side tRPC):

- `src/app/onze-medewerkers/page.tsx` — Server Component, fetches via Prisma, exports metadata, `revalidate = 300`
- `src/app/onze-medewerkers/content.tsx` — Client Component with animations, receives data as props
- Clean 3×2 grid (2-col mobile, 3-col desktop), portrait aspect ratio cards
- Team members: Zinab, Yara, Duha, Marloes, Guus (names match photo filenames)

## Onze Impact / Theory of Change

Theory of Change diagrams are **static images** (not dynamic SVG):

- `public/images/impact/toc-medewerker.png` — downloaded from original Wix site
- `public/images/impact/toc-deelnemer.png` — downloaded from original Wix site
- Displayed via `<Image>` in `src/app/onze-impact/page.tsx` with `overflow-x-auto` for mobile scrolling

## SEO

### Technical SEO Files

| File                 | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `src/app/robots.ts`  | Crawl rules + sitemap reference                                         |
| `src/app/sitemap.ts` | Dynamic sitemap: static pages + DB workshops/recipes + 87 landing pages |
| `src/app/layout.tsx` | Organization + WebSite JSON-LD (global)                                 |

### Per-Page Metadata

Pages using `"use client"` can't export metadata directly. These use **layout.tsx** files for metadata:

| Layout file                            | Provides metadata for                        |
| -------------------------------------- | -------------------------------------------- |
| `src/app/onze-uitjes/layout.tsx`       | `/onze-uitjes` (client page)                 |
| `src/app/ons-verhaal/layout.tsx`       | `/ons-verhaal` (client page)                 |
| `src/app/jullie-ervaringen/layout.tsx` | `/jullie-ervaringen` + LocalBusiness JSON-LD |
| `src/app/faq/layout.tsx`               | `/faq` (client page)                         |
| `src/app/onze-impact/layout.tsx`       | `/onze-impact` (client page)                 |
| `src/app/recepten/layout.tsx`          | `/recepten` (client page)                    |

Server component pages export metadata directly:

- `src/app/contact/page.tsx` — metadata export
- `src/app/onze-uitjes/[slug]/page.tsx` — dynamic OG/Twitter + Service JSON-LD
- `src/app/recepten/[slug]/page.tsx` — dynamic OG/Twitter

### OG Image URLs

Workshop and recipe images stored in DB may be relative paths (`/images/workshops/...`). The `generateMetadata` functions prepend `SITE_URL` to relative paths for OG/Twitter tags. Already-absolute URLs (e.g. Wix CDN) are passed through unchanged.

### Site URL Configuration

All SEO URLs (sitemap, robots, JSON-LD, OG tags) use `SITE_URL` from `src/lib/site-config.ts`.

- **Env var**: `NEXT_PUBLIC_SITE_URL` (defaults to `https://www.goeduitje.nl`)
- **Domain migration**: Change one env var in Vercel — no code changes needed
- **Config file**: `src/lib/site-config.ts`

### SEO Redirects

75 old Wix URLs handled via redirect schema (`/Redirect schema/Goeduitje.nl - Redirect schema.xlsx`):

- **17 explicit 301 redirects** in `next.config.mjs` (path changes like `/contactpagina` → `/contact`)
- **52 same-path URLs** served directly by existing pages/landing pages (no redirect needed)
- **4 intentionally skipped** (pages exist at old URL: `/feedback`, `/recepten`, `/kookworkshop-voor-bedrijven-arnhem`, `/vegetarische-kookworkshop-nijmegen`)
- **2 empty destinations** in schema (`/stadsspel-arnhem`, `/stadsspel-nijmegen`) — landing pages exist at those URLs
- Case-sensitive redirects (e.g. `/teambuilding-Nijmegen`) handled by middleware.ts URL normalization

## Images

All client photos from `/All photo positions/Fotos nieuwe website maart 2026/` are processed and in use:

```
public/images/
├── workshops/     — 6 workshop cards + hero images + videos
├── ons-verhaal/   — hero-left, hero-right, doen, visie, impressie-uitjes.mp4
├── impact/        — 4 impact photos + 2 ToC diagram images
├── team/          — zinab, yara, duha, marloes, guus
├── recipes/       — 7 recipe photos (rest use old Wix URLs)
├── cities/        — 40 city landmark images
├── hero/          — hero-poster.jpg, hero-poster-mobile.jpg
└── logo/          — logo-nav.png, logo-footer.png
```

## Database

**Shared with Backend**: Both repos connect to same Neon PostgreSQL.

- Frontend Prisma: manages migrations (source of truth)
- Backend Drizzle: read/write only (no migrations)

After schema changes:

```bash
npm run db:push && npm run db:generate
```

## Commit Workflow

```bash
# 1. Make changes
# 2. Run quality checks
npm run typecheck && npm run lint

# 3. Commit (use --no-verify if lint-staged has issues)
git add <files> && git commit --no-verify -m "message"

# 4. Push (auto-deploys to Vercel)
git push
```

## Recipes

13 authentic Middle Eastern recipes from Goeduitje's kookworkshops, stored in DB (`Recipe` model).

**Seed file**: `prisma/seed-recipes.ts` (authentic recipes with Wix CDN images)
**⚠️ NOT** `prisma/seed.ts` — that file contains generic Italian/Thai recipes, not authentic Goeduitje content.

**tRPC router**: `src/server/api/routers/recipes.ts` — full CRUD (getAll, getBySlug, getById, create, update, delete, togglePublish)

To reseed recipes:

```bash
npx tsx prisma/seed-recipes.ts
```

## CLAUDE.md Maintenance

**Always update this file** when making structural changes: adding new pages, routes, layouts, database models, seed files, SEO files, or changing architecture patterns. This file is the primary context for AI agents working on this codebase.

## ⚠️ PRODUCTION-READY — Change Policy

**This website is near-production. Only minor tweaks and fixes are allowed on the frontend.**

- **NEVER change navigation items, page structure, or layout without explicit owner approval.** The top navigation (`src/components/top-navigation.tsx`) and footer (`src/components/footer.tsx`) are locked down.
- **NEVER add, remove, or reorder pages in navigation** — this requires explicit sign-off from the project owner.
- **Ask before any visual/UX change** that affects the live site experience (layout shifts, component removals, color changes, font changes, etc.)
- Minor bug fixes, typo corrections, and backend-only changes are fine without approval.
- When in doubt, **report what you'd change and wait for approval** instead of making the change.

### Current Navigation (LOCKED — do not modify without approval)

```
Onze uitjes | Ons verhaal | Onze medewerkers | Onze impact | Jullie ervaringen
```

## Never Do

- Create admin pages here (use goeduitje-backend)
- Run Drizzle migrations (Prisma is source of truth)
- Modify `/components/ui/` (shadcn managed)
- Modify top navigation items or footer structure without explicit owner approval
- Skip typecheck before committing
- Use 21% BTW for food service (use 9%)
- Run `seed-workshops.ts` on production — it deletes ALL workshops first. Use targeted migration scripts instead (e.g. `prisma/migrate-stadsspel-tiers.ts`)
- Add `export const dynamic = "force-dynamic"` to root layout — causes redirect bug via prefetch race condition. Use per-page `dynamic` exports or `{ next: { revalidate: N } }` on fetches instead
- Use client-side tRPC `useQuery` for pages that can be Server Components — use Prisma directly in Server Components instead (see onze-medewerkers pattern)
- Use `StaggerChildren` with CSS `columns` layout — the `useInView` + `opacity: 0` initial state creates a deadlock where the container has no measurable height, so `IntersectionObserver` never fires. Use a plain `<div>` instead for column layouts with dynamic content.

## Reference Docs

- `docs/ACTIVE_DEBUG_SESSION.md` — debug session history (all issues resolved)
- `docs/IMAGE_UPLOAD_GUIDE.md` — client-facing guide for CMS-managed images
- Client image Excel: `/Users/willemvandenberg/Dev/Goeduitjeweb/All photo positions/Fotos nieuwe website maart 2026/Alle_afbeeldingen_Goeduitje.xlsx`
- Pages audit Excel: `/Users/willemvandenberg/Dev/Goeduitjeweb/All current pages/Wix Webpaginas _2026.02.19.xlsx`
- Pages audit report: `/Users/willemvandenberg/Dev/Goeduitjeweb/All current pages/AUDIT_REPORT.md`

## Deployment

**Production**: https://goeduitje-nl-rebuild.vercel.app

Push to `main` → Vercel auto-deploys. Also deployable via `npx vercel --prod`.

### Vercel Environment Variables (Production)

| Variable                | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `DATABASE_URL`          | Neon PostgreSQL connection string                |
| `NEXT_PUBLIC_APP_URL`   | Public app URL                                   |
| `NEXT_PUBLIC_GTM_ID`    | Google Tag Manager container ID (`GTM-PZCH2S3R`) |
| `GOOGLE_PLACES_API_KEY` | Google Places API for reviews                    |
| `GOOGLE_PLACE_ID`       | Google Place ID for Goeduitje                    |
| `SKIP_ENV_VALIDATION`   | Skip t3-env validation on build                  |

## ⚠️ CMS Image/Video Override Pattern

When replacing images or videos on CMS-managed pages (like /ons-verhaal), simply replacing the file on disk is NOT enough. The `PageContent` database table may have an old URL stored that overrides the default/local file path.

**Always do BOTH when replacing media on CMS pages:**

1. Replace the file on disk in `public/`
2. Update the `PageContent` database record to point to the new path

**To check:** Query the DB for the page/section/key:

```bash
node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.pageContent.findMany({where:{page:'PAGE',section:'SECTION'}}).then(r=>{console.log(JSON.stringify(r,null,2));return p.\$disconnect()})"
```

**To fix:** Update the record's value to the correct path, and optionally delete the old file to prevent it from ever being served again.
