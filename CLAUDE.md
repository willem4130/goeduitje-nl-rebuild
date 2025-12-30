# Goeduitje.nl - Full-Stack Website

Booking platform for recreational activities in the Netherlands. Next.js 14 full-stack app with workshop booking, admin CMS, and dynamic content management.

## Tech Stack

- **Framework**: Next.js 14 + React 18 + TypeScript 5
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **API**: tRPC + TanStack Query
- **UI**: shadcn/ui (Radix) + Tailwind CSS 4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Email**: Resend | **Rich Text**: TipTap (planned)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (tRPC, emails)
│   ├── admin/             # Admin dashboard (reviews, settings, content)
│   └── [pages]/           # Public pages (onze-uitjes, contact, faq, etc.)
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   └── [feature].tsx     # Feature components
├── server/api/routers/   # tRPC routers (workshop, reviews, feedback, etc.)
├── lib/                  # Utilities (prisma, validations)
└── hooks/                # Custom React hooks

prisma/
├── schema.prisma         # Database models
└── seed-*.ts            # Seed scripts (workshops, faq, team, etc.)
```

## Database Models

**Active**: Workshop, WorkshopVariant, PriceTier, WorkshopConfig, GoogleReview, Feedback, Recipe, User
**Planned**: FAQ, TeamMember, Testimonial, PageContent, SiteSetting

## Code Quality - Zero Tolerance

```bash
bun run typecheck && bun run lint
```

Fix ALL errors before continuing. No exceptions.

## Deployment

**Preview**: https://goeduitje-nl-rebuild.vercel.app/
Push to `main` → Vercel auto-deploys

## Organization Rules

- tRPC routers → `/server/api/routers/[name].ts`
- Admin pages → `/app/admin/[section]/page.tsx`
- Seed scripts → `/prisma/seed-[name].ts`
- UI primitives → `/components/ui/` (shadcn only)
- Max 300 lines per file

## Never Do

- Create custom UI primitives (use shadcn/ui)
- Write CSS animations (use Framer Motion)
- Hardcode content that should be in database
- Skip typecheck before committing
