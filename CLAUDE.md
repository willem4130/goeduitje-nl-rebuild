# Goeduitje.nl - FRONTEND

Booking platform for recreational activities in the Netherlands. Next.js 14 full-stack app with workshop booking, Stripe payments, and admin management.

## Repository Separation - CRITICAL

**This repo (goeduitje-nl-rebuild)**: Frontend UI, pages, components, client-side code
**Backend repo (goeduitje-backend)**: Workshop admin CMS, quote generation, backend APIs

Before committing, ask: "Is this for the public website UI?" → Frontend repo. "Is this for workshop admin/backend?" → Backend repo.

## Tech Stack

- **Framework**: Next.js 14 + React 18 + TypeScript 5
- **Database**: PostgreSQL + Prisma ORM
- **API**: tRPC + TanStack Query
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS 4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Payments**: Stripe | **Email**: Resend | **Booking**: Cal.com

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (tRPC, Stripe, emails)
│   ├── admin/             # Admin dashboard
│   ├── booking/           # Cal.com integration
│   ├── checkout/          # Stripe checkout
│   └── [pages]/           # Public pages (onze-uitjes, contact, etc.)
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives (Button, Card, etc.)
│   └── [feature].tsx     # Feature components (carousel, configurator)
├── server/api/routers/   # tRPC routers
├── trpc/                 # tRPC client setup
├── lib/                  # Utilities (prisma, stripe, validations)
└── hooks/                # Custom React hooks

prisma/schema.prisma      # Database models
public/images/            # Static assets
```

## Code Quality - Zero Tolerance

After editing ANY file:

```bash
bun run typecheck && bun run lint && bun run format:check
```

Fix ALL errors before continuing. No exceptions.

## Organization Rules

- UI primitives → `/components/ui` (shadcn/ui only)
- Feature components → `/components/[name].tsx`
- Pages → `/app/[route]/page.tsx`
- API routes → `/app/api/[endpoint]/route.ts`
- Utilities → `/lib/[name].ts`
- Single responsibility per file, max 300 lines

## Component Standards

- Use shadcn/ui components exclusively (never build custom primitives)
- Animations with Framer Motion only
- Carousels with Embla Carousel
- Icons from Lucide React or Tabler Icons

## Deployment

**Production**: Push to `main` → Vercel auto-deploys to https://www.goeduitje.nl
**Preview**: Push to any other branch → Vercel creates preview URL

```bash
# Before pushing to main
bun run typecheck && bun run lint
git push origin main
```

## Never Do

- Create custom UI primitives (use shadcn/ui)
- Write custom CSS animations (use Framer Motion)
- Build carousel from scratch (use Embla)
- Create custom form components (use React Hook Form)
- Mix frontend/backend code in same commit
