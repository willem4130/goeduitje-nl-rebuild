# Goeduitje.nl - Public Website

Public-facing website for Goeduitje team activities. Users discover, customize, and book corporate team-building experiences.

**IMPORTANT**: This repo is PUBLIC WEBSITE only. All admin functionality is in goeduitje-backend.

## Project Structure

```
src/
├── app/
│   ├── (landing)/[slug]/         # City landing pages (40 cities)
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

40 SEO-optimized landing pages for kookworkshops across the Netherlands.

**Source**: `src/lib/city-data.ts` (single source of truth)

| Type | Count | Display |
|------|-------|---------|
| Featured cities | 13 | Image grid on `/onze-uitjes/kookworkshop` |
| Other cities | 27 | Text links below grid |

All cities have landmark images in `public/images/cities/[slug].jpg`.

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

## Deployment

**Production**: https://goeduitje-nl-rebuild.vercel.app

Push to `main` → Vercel auto-deploys
