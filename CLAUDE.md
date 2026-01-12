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
│   ├── recepten/                 # Recipes list page
│   │   └── [slug]/               # Recipe detail pages
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

## Site Assets (Backend-Managed)

**Backend is source of truth for site assets** - Logos, hero videos, and OG images are managed in the backend admin and fetched by the frontend.

### How It Works

1. **Server Component** (`layout.tsx`) fetches from backend API at request time
2. URLs passed as **props** to client components (TopNavigation, Footer)
3. Fallback to `/public/` static files if API fails

### Key Files

| Purpose        | File                                                         |
| -------------- | ------------------------------------------------------------ |
| Fetch function | `src/lib/site-assets.ts`                                     |
| Server fetch   | `src/app/layout.tsx` (async, calls `getSiteAssets()`)        |
| Client layout  | `src/components/client-layout.tsx` (receives props)          |
| Nav component  | `src/components/top-navigation.tsx` (accepts `logoUrl` prop) |
| Footer         | `src/components/footer.tsx` (accepts `logoUrl` prop)         |

### Fallbacks

Static files in `/public/` are used as fallbacks:

- `/images/logo/logo-nav.png`
- `/images/logo/logo-footer.png`
- `/images/hero/hero-poster.jpg`
- `/videos/hero/hero-background.mp4`

## Never Do

- Create admin pages here (use goeduitje-backend)
- Run Drizzle migrations (Prisma is source of truth)
- Modify `/components/ui/` (shadcn managed)
- Use `useQuery` hooks in TopNavigation, Footer, or HeroVideo
- Skip typecheck before committing

## Session Changes Log

**IMPORTANT**: After each development session, update `SESSION_CHANGES.html` with all adjustments made.

This HTML file serves as a client-facing changelog that can be shared to review all modifications. Each session should document:

- What was changed
- Which files were modified
- Before/after details where relevant

Open the file in a browser to view a nicely formatted list of all changes.

## Open Kookworkshops Agenda

Workshop dates for "Open Kookworkshops" are managed in a single file:

```
src/lib/open-workshops.ts
```

This data syncs automatically to:

- `/onze-uitjes/kookworkshop` (Open Kookworkshops tab agenda)
- `/booking` (booking calendar)

Update dates here when new workshop dates are scheduled.

## Recipes

Authentic Middle Eastern recipes from Goeduitje cooking workshops. Data managed via backend admin.

### Structure

| Route              | Purpose                           |
| ------------------ | --------------------------------- |
| `/recepten`        | Recipe list with category filters |
| `/recepten/[slug]` | Individual recipe detail page     |

### Categories (in order)

1. Voorgerecht
2. Hoofdgerecht
3. Bijgerecht
4. Dessert

### Key Files

| File                                | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| `prisma/seed-recipes.ts`            | Seed 13 authentic recipes with Wix images  |
| `src/app/recepten/page.tsx`         | Recipe list with search & category filters |
| `src/app/recepten/[slug]/page.tsx`  | Recipe detail with ingredients & steps     |
| `src/server/api/routers/recipes.ts` | tRPC router for recipe CRUD                |

### Seeding Recipes

```bash
npx tsx prisma/seed-recipes.ts
```

### Image Hosting

Recipe images are hosted on Wix (`static.wixstatic.com`) from the original goeduitje.nl site. The domain is configured in `next.config.mjs` under `images.remotePatterns`.

## Deployment

**Production**: https://goeduitje-nl-rebuild.vercel.app
Push to `main` → Vercel auto-deploys
