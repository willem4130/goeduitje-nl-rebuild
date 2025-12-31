# Goeduitje.nl - Public Website

Public-facing website for Goeduitje team activities. Users discover, customize, and book corporate team-building experiences.

**IMPORTANT**: This repo is PUBLIC WEBSITE only. All admin functionality is in goeduitje-backend.

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # tRPC + webhooks (Stripe, cron)
│   ├── onze-uitjes/[slug]/       # Workshop detail pages
│   ├── ons-verhaal/              # About page (from PageContent)
│   ├── jullie-ervaringen/        # Testimonials page
│   ├── recepten/                 # Recipes page
│   ├── faq/                      # FAQ page
│   ├── checkout/                 # Stripe payment flow
│   └── admin/                    # Legacy admin (use backend instead)
├── components/
│   ├── ui/                       # shadcn/ui (DO NOT MODIFY)
│   └── *.tsx                     # Feature components (41 files)
├── server/api/routers/           # tRPC routers (11 modules, incl. media)
├── emails/                       # Resend email templates
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities + Stripe/Prisma clients
└── trpc/                         # tRPC client/server setup

prisma/
├── schema.prisma                 # Database models (SOURCE OF TRUTH)
└── seed-*.ts                     # Seed scripts

public/
├── images/                       # Static images (hero, workshops, logos)
└── videos/                       # Hero background videos
```

## Tech Stack

Next.js 14 + React 18 + TypeScript | Prisma ORM + PostgreSQL (Neon) | tRPC + TanStack Query | shadcn/ui + Tailwind CSS 4 | Framer Motion | Stripe | Resend

## Code Quality - Zero Tolerance

```bash
bun run typecheck && bun run lint
```

Fix ALL errors before continuing. No exceptions.

## Organization Rules

- tRPC routers → `/server/api/routers/[name].ts`
- Components → `/components/[feature].tsx` (max 300 lines)
- Hooks → `/hooks/use-[name].ts`
- Email templates → `/emails/[name].tsx`
- UI primitives → `/components/ui/` (shadcn only, never modify)

## Database

**Shared with Backend**: Both repos connect to same Neon PostgreSQL.

- Frontend Prisma: manages migrations (source of truth)
- Backend Drizzle: read/write only (no migrations)

## Key Integrations

- **Stripe**: Checkout flow + webhooks at `/api/webhooks/stripe`
- **Google Reviews**: Synced via cron at `/api/cron/refresh-google-reviews`
- **Resend**: Transactional emails (contact, booking confirmations)

## Media Gallery (Database-Driven Images)

**Backend is system of record** - Images are managed in backend admin, fetched via tRPC.

```typescript
// Content images
api.media.getAll(); // All visible content images
api.media.getFeatured(); // Homepage featured images

// Site assets (hero, logos)
api.media.getHeroMedia(); // Returns { videos: {desktop, mobile}, posters: {desktop, mobile} }
api.media.getLogos(); // Returns { nav, footer }
```

Components with graceful fallbacks: `hero-video.tsx`, `top-navigation.tsx`, `footer.tsx`

## Never Do

- Create admin pages here (use goeduitje-backend)
- Run Drizzle migrations (Prisma is source of truth)
- Modify `/components/ui/` (shadcn managed)
- Hardcode content/images that should be in database
- Skip typecheck before committing

## Deployment

**Production**: https://goeduitje-nl-rebuild.vercel.app
Push to `main` → Vercel auto-deploys
