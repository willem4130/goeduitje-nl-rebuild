# Goeduitje.nl - Public Website

Public-facing website for Goeduitje team activities. Users discover, customize, and book corporate team-building experiences.

**IMPORTANT**: This repo is PUBLIC WEBSITE only. All admin functionality is in goeduitje-backend.

## Project Structure

```
src/
├── app/
│   ├── (landing)/[slug]/         # City landing pages (41 pages: 40 kookworkshop + 1 vegetarisch)
│   ├── teambuilding/             # Teambuilding category page (static)
│   ├── bedrijfsuitjes/           # Bedrijfsuitjes category page (static)
│   ├── workshops/                # Workshops category page (static)
│   ├── api/                      # tRPC + webhooks
│   ├── onze-uitjes/[slug]/       # Workshop detail pages
│   ├── recepten/[slug]/          # Recipe pages
│   ├── booking/                  # Open workshop booking (t/m 15 persons)
│   ├── jullie-ervaringen/        # Google Reviews page
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

## Tech Stack

Next.js 14 | TypeScript | Prisma + PostgreSQL (Neon) | tRPC | shadcn/ui + Tailwind CSS 4 | Framer Motion | Stripe | Resend

## Code Quality

```bash
npm run typecheck && npm run lint
```

Fix ALL errors before committing. No exceptions.

## Key Features

### Open Kookworkshops (/booking)
- Max **t/m 15 personen** per booking
- Price: defined in `src/lib/open-workshops.ts`
- Calendar grid for date selection

### Workshop Configurator
- Small group popup (<8 persons) suggests open workshops
- "Bekijk agenda" button links to `/booking`
- Located in `src/components/workshop-configurator.tsx`

### Google Reviews
- Real reviews from Google Places API
- Visibility controlled via `isVisible` field in database
- Fake reviews filtered out (isVisible: false)
- Admin control in goeduitje-backend `/google-reviews`

### Lunch & Diner Pricing
- Uses **9% BTW** (food service rate, not 21%)
- Minimum persons displayed: Buffet 30, Lunch 15, Diner 15
- Prices in `prisma/seed-workshops.ts`

## City Landing Pages

48 SEO-optimized landing pages via `src/app/(landing)/[slug]/page.tsx`.

**City data source**: `src/lib/city-data.ts` (images & featured/other)
**Landing page data**: `ALL_LANDING_PAGES` array in `(landing)/[slug]/page.tsx`

| Type | Count | Display |
|------|-------|---------|
| Kookworkshop cities | 40 | `kookworkshop-[city]` slugs |
| Vegetarisch | 1 | `vegetarische-kookworkshop-nijmegen` |
| Teambuilding | 2 | `teambuilding-nijmegen`, `teambuilding-arnhem` |
| Bedrijfsuitje | 3 | `bedrijfsuitje-nijmegen`, `bedrijfsuitje-arnhem`, `kookworkshop-voor-bedrijven-arnhem` |
| Stadsspel | 2 | `stadsspel-nijmegen`, `stadsspel-arnhem` |
| Featured cities | 13 | Image grid on `/onze-uitjes/kookworkshop` |
| Other cities | 27 | Text links below grid |

Non-kookworkshop pages use `TypedLandingPage` component with type-specific themes (blue/green/indigo), content, and FAQ.
All cities have landmark images in `public/images/cities/[slug].jpg`.

## Category Pages

3 static SEO category pages linking to workshop detail pages:

| Page | Target keywords | File |
|------|----------------|------|
| `/teambuilding` | teambuilding, teamuitje | `src/app/teambuilding/page.tsx` |
| `/bedrijfsuitjes` | bedrijfsuitje, personeelsuitje | `src/app/bedrijfsuitjes/page.tsx` |
| `/workshops` | workshops, workshop boeken | `src/app/workshops/page.tsx` |

## SEO Redirects

7x 301 redirects in `next.config.mjs` for old Wix URLs → new URLs.

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

## Active Debug Session

**READ FIRST**: `docs/ACTIVE_DEBUG_SESSION.md` — contains critical in-progress debugging state.

### Priority 1: /onze-medewerkers page broken
Team photos page shows loading spinner forever. tRPC API works, images exist, code is correct, but client-side hydration fails silently. Full investigation state documented in the debug file above.

### Priority 2: Fix remaining useQuery(undefined) bugs
Two more pages send `null` input causing 400 errors:
- `src/app/faq/page.tsx:14` — `useQuery(undefined)` → change to `useQuery({})`
- `src/components/workshop-carousel.tsx:68` — `useQuery(undefined)` → change to `useQuery({})`

### Image reference doc
- `docs/IMAGE_UPLOAD_GUIDE.md` — client-facing guide for CMS-managed images
- Excel with all image positions: `/Users/willemvandenberg/Dev/Goeduitjeweb/All photo positions/Fotos nieuwe website maart 2026/Alle_afbeeldingen_Goeduitje.xlsx`

## Deployment

**Production**: https://goeduitje-nl-rebuild.vercel.app

Push to `main` → Vercel auto-deploys
