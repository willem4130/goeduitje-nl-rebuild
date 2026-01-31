# Goeduitje.nl - Public Website

Public-facing website for Goeduitje team activities. Users discover, customize, and book corporate team-building experiences.

**IMPORTANT**: This repo is PUBLIC WEBSITE only. All admin functionality is in goeduitje-backend.

## Project Structure

```
src/
├── app/
│   ├── (landing)/[slug]/         # City landing pages (42 pages)
│   ├── api/                      # tRPC + webhooks
│   ├── onze-uitjes/[slug]/       # Workshop detail pages
│   ├── recepten/[slug]/          # Recipe pages
│   ├── booking/                  # Open workshop booking
│   └── checkout/                 # Stripe payment flow
├── components/
│   ├── ui/                       # shadcn/ui (DO NOT MODIFY)
│   ├── city-gallery.tsx          # Locaties section component
│   └── *.tsx                     # Feature components
├── lib/
│   ├── city-data.ts              # City images & data (40 cities)
│   ├── open-workshops.ts         # Workshop dates
│   └── *.ts                      # Utilities
├── server/api/routers/           # tRPC routers
└── emails/                       # Resend templates

public/images/
├── cities/                       # 40 city landmark images
├── workshops/                    # Workshop photos
├── hero/                         # Hero backgrounds
└── logo/                         # Brand logos
```

## Tech Stack

Next.js 14 | TypeScript | Prisma + PostgreSQL (Neon) | tRPC | shadcn/ui + Tailwind CSS 4 | Framer Motion | Stripe | Resend

## Code Quality

```bash
bun run typecheck && bun run lint
```

Fix ALL errors before committing. No exceptions.

## City Landing Pages

42 SEO-optimized landing pages for kookworkshops across the Netherlands.

### City Images

**Source**: `src/lib/city-data.ts` (single source of truth)

| Type | Count | Display |
|------|-------|---------|
| Featured cities | 13 | Image grid on `/onze-uitjes/kookworkshop` |
| Other cities | 27 | Text links below grid |

All 40 cities have landmark images in `public/images/cities/[slug].jpg`.

### Landing Page Structure

- **Hero**: City landmark image (from `getCityImage()`)
- **Impact section**: Generic Goeduitje cooking photo
- **CTAs**: Link to `/onze-uitjes/kookworkshop` and `/contact`

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/city-data.ts` | City data + images |
| `src/app/(landing)/[slug]/page.tsx` | Landing page template |
| `src/components/city-gallery.tsx` | Locaties grid component |

## Database

**Shared with Backend**: Both repos connect to same Neon PostgreSQL.

- Frontend Prisma: manages migrations (source of truth)
- Backend Drizzle: read/write only (no migrations)

## Key Integrations

- **Stripe**: Checkout at `/api/webhooks/stripe`
- **Google Reviews**: Cron at `/api/cron/refresh-google-reviews`
- **Resend**: Transactional emails

## Open Kookworkshops

Workshop dates managed in `src/lib/open-workshops.ts`. Used by:
- `/onze-uitjes/kookworkshop` (agenda tab)
- `/booking` (booking calendar)

## Recipes

Route: `/recepten` and `/recepten/[slug]`

Categories: Voorgerecht → Hoofdgerecht → Bijgerecht → Dessert

Images hosted on Wix (`static.wixstatic.com`).

## Site Assets (Backend-Managed)

Logos and hero videos fetched from backend API with `/public/` fallbacks.

## Never Do

- Create admin pages here (use goeduitje-backend)
- Run Drizzle migrations (Prisma is source of truth)
- Modify `/components/ui/` (shadcn managed)
- Skip typecheck before committing

## Deployment

**Production**: https://goeduitje-nl-rebuild.vercel.app

Push to `main` → Vercel auto-deploys
