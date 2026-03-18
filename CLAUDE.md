# Goeduitje.nl - Public Website

Public-facing website for Goeduitje team activities. Users discover, customize, and book corporate team-building experiences.

**IMPORTANT**: This repo is PUBLIC WEBSITE only. All admin functionality is in goeduitje-backend.

## Project Structure

```
src/
├── app/
│   ├── (landing)/[slug]/         # City landing pages (49 pages)
│   ├── teambuilding/             # Teambuilding category page (static)
│   ├── bedrijfsuitjes/           # Bedrijfsuitjes category page (static)
│   ├── workshops/                # Workshops category page (static)
│   ├── api/                      # tRPC + webhooks
│   ├── onze-uitjes/[slug]/       # Workshop detail pages (6)
│   ├── onze-medewerkers/         # Team photos (Server Component + Client content)
│   ├── onze-impact/              # Impact page with ToC diagrams (static images)
│   ├── recepten/[slug]/          # Recipe pages (13)
│   ├── booking/                  # Open workshop booking (t/m 15 persons)
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
│   ├── city-data.ts              # City images & data (40 cities)
│   ├── open-workshops.ts         # Workshop dates & pricing
│   └── *.ts                      # Utilities
├── server/api/routers/
│   ├── reviews.ts                # Google Reviews (visibility filtering)
│   ├── testimonials.ts           # Legacy testimonials
│   └── *.ts                      # Other routers
└── prisma/
    ├── schema.prisma             # Database schema (source of truth)
    └── seed-workshops.ts         # Workshop pricing data
```

## Total Pages: 91

| Type                  | Count | Template                      |
| --------------------- | ----- | ----------------------------- |
| Static pages          | 23    | Individual page.tsx files     |
| City landing pages    | 49    | `(landing)/[slug]/page.tsx`   |
| Workshop detail pages | 6     | `onze-uitjes/[slug]/page.tsx` |
| Recipe pages          | 13    | `recepten/[slug]/page.tsx`    |

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
npm run test:run          # Unit + integration (322 tests)
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
│   └── api/                     # tRPC router + API route tests (15 files)
├── integration/
│   ├── prisma-schema-validation.test.ts  # All Prisma models verified
│   ├── backend-schema-sync.test.ts       # Prisma↔Drizzle sync for shared tables
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

| Frontend Form            | DB Table         | Backend Admin API        | Status |
| ------------------------ | ---------------- | ------------------------ | ------ |
| Workshop Configurator    | `WorkshopConfig` | `/api/workshops/configs` | ✅     |
| Contact Form             | `Feedback`       | `/api/content/feedback`  | ✅     |
| Compact Contact (footer) | `Feedback`       | `/api/content/feedback`  | ✅     |
| Booking (Stripe)         | `Booking`        | `/api/bookings`          | ✅     |
| Booking (gift card)      | `Booking`        | `/api/bookings`          | ✅     |

### /test Command

Available via `/test` in Claude Code (Shift+\`). Runs all tests, coverage, typecheck, lint.

## Key Features

### Open Kookworkshops (/booking)

- Max **t/m 15 personen** per booking
- Price: defined in `src/lib/open-workshops.ts`
- Calendar grid for date selection

### Workshop Configurator

- Small group popup (<8 persons) suggests open workshops
- "Bekijk agenda" button links to `/booking`
- Located in `src/components/workshop-configurator.tsx`
- On submit → redirects to `/bedankt` + pushes GA4 purchase event via dataLayer

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

- GTM container loaded in root layout via `NEXT_PUBLIC_GTM_ID` env var
- Purchase event pushed on configurator submission
- Conversion tracking on `/bedankt` thank-you page

## City Landing Pages

49 SEO-optimized landing pages via `src/app/(landing)/[slug]/page.tsx`.

**City data source**: `src/lib/city-data.ts` (images & featured/other)
**Landing page data**: `ALL_LANDING_PAGES` array in `(landing)/[slug]/page.tsx`

| Type                | Count | Display                                                                                |
| ------------------- | ----- | -------------------------------------------------------------------------------------- |
| Kookworkshop cities | 40    | `kookworkshop-[city]` slugs                                                            |
| Vegetarisch         | 1     | `vegetarische-kookworkshop-nijmegen`                                                   |
| Teambuilding        | 2     | `teambuilding-nijmegen`, `teambuilding-arnhem`                                         |
| Bedrijfsuitje       | 3     | `bedrijfsuitje-nijmegen`, `bedrijfsuitje-arnhem`, `kookworkshop-voor-bedrijven-arnhem` |
| Stadsspel           | 2     | `stadsspel-nijmegen`, `stadsspel-arnhem`                                               |
| Featured cities     | 13    | Image grid on `/onze-uitjes/kookworkshop`                                              |
| Other cities        | 27    | Text links below grid                                                                  |

Non-kookworkshop pages use `TypedLandingPage` component with type-specific themes (blue/green/indigo), content, and FAQ.
All cities have landmark images in `public/images/cities/[slug].jpg`.

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

## SEO Redirects

7x 301 redirects in `next.config.mjs` for old Wix URLs → new URLs.

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

## Never Do

- Create admin pages here (use goeduitje-backend)
- Run Drizzle migrations (Prisma is source of truth)
- Modify `/components/ui/` (shadcn managed)
- Skip typecheck before committing
- Use 21% BTW for food service (use 9%)
- Add `export const dynamic = "force-dynamic"` to root layout — causes redirect bug via prefetch race condition. Use per-page `dynamic` exports or `{ next: { revalidate: N } }` on fetches instead
- Use client-side tRPC `useQuery` for pages that can be Server Components — use Prisma directly in Server Components instead (see onze-medewerkers pattern)
- Use `StaggerChildren` with CSS `columns` layout — the `useInView` + `opacity: 0` initial state creates a deadlock where the container has no measurable height, so `IntersectionObserver` never fires. Use a plain `<div>` instead for column layouts with dynamic content.

## Reference Docs

- `docs/ACTIVE_DEBUG_SESSION.md` — debug session history (all issues resolved)
- `docs/IMAGE_UPLOAD_GUIDE.md` — client-facing guide for CMS-managed images
- Client image Excel: `/Users/willemvandenberg/Dev/Goeduitjeweb/All photo positions/Fotos nieuwe website maart 2026/Alle_afbeeldingen_Goeduitje.xlsx`
- Pages audit Excel: `/Users/willemvandenberg/Dev/Goeduitjeweb/All current pages/Wix Webpaginas _2026.02.19.xlsx`

## Deployment

**Production**: https://goeduitje-nl-rebuild.vercel.app

Push to `main` → Vercel auto-deploys

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
