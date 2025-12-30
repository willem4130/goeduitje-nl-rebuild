# Goeduitje.nl - Full-Stack Website

Booking platform for recreational team activities in the Netherlands. Users discover, customize, and reserve corporate team-building experiences. Includes admin CMS for workshops, pricing, and content.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes (tRPC, emails, webhooks)
│   ├── admin/                # Admin CMS (workshops, faq, team, testimonials, reviews)
│   ├── onze-uitjes/          # Workshop/activity pages
│   ├── checkout/             # Payment flow
│   └── [pages]/              # Public pages (contact, faq, pricing, etc.)
├── components/               # React components
│   ├── ui/                   # shadcn/ui primitives (DO NOT MODIFY)
│   └── [feature].tsx         # Feature components
├── server/api/routers/       # tRPC routers
├── lib/                      # Utilities
│   ├── validations/          # Zod schemas
│   └── constants/            # Static data fallbacks
├── hooks/                    # Custom React hooks
├── emails/                   # Resend email templates
└── trpc/                     # tRPC client/server setup

prisma/
├── schema.prisma             # Database models
└── seed-*.ts                 # Seed scripts
```

## Tech Stack

- **Framework**: Next.js 14 + React 18 + TypeScript 5
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **API**: tRPC + TanStack Query
- **UI**: shadcn/ui (Radix) + Tailwind CSS 4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Email**: Resend

## Code Quality - Zero Tolerance

```bash
bun run typecheck && bun run lint
```

Fix ALL errors before continuing. No exceptions.

## Database Models

**Active**: Workshop, WorkshopVariant, PriceTier, WorkshopConfig, GoogleReview, Feedback, Recipe, User, FAQ, TeamMember, Testimonial, PageContent, SiteSetting

## Organization Rules

- tRPC routers → `/server/api/routers/[name].ts`
- Admin pages → `/app/admin/[section]/page.tsx`
- Seed scripts → `/prisma/seed-[name].ts`
- Validations → `/lib/validations/[name].ts`
- UI primitives → `/components/ui/` (shadcn only)
- Max 300 lines per file

## Deployment

**Preview**: https://goeduitje-nl-rebuild.vercel.app/
Push to `main` → Vercel auto-deploys

## Related Repository

**Backend CMS** (separate): `/Users/willemvandenberg/Dev/Goeduitjeweb/goeduitje-backend`

- Handles workshop REQUESTS, quote automation, confirmed bookings
- Different database, runs on port 3003

## Never Do

- Create custom UI primitives (use shadcn/ui)
- Write CSS animations (use Framer Motion)
- Hardcode content that should be in database
- Skip typecheck before committing
- Commit to wrong repository (check CLAUDE.md in each repo)
