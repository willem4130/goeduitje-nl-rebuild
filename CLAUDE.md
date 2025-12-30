# Goeduitje.nl - Public Website

Public-facing website for Goeduitje recreational team activities. Users discover, customize, and book corporate team-building experiences.

**IMPORTANT**: This repo is for the PUBLIC WEBSITE only. All admin functionality is in the BACKEND repo.

## Architecture

| Repo                            | Purpose                  | URL                             |
| ------------------------------- | ------------------------ | ------------------------------- |
| **goeduitje-nl-rebuild** (this) | Public website, no admin | goeduitje-nl-rebuild.vercel.app |
| **goeduitje-backend**           | ALL admin functionality  | goeduitje-backend.vercel.app    |

## Project Structure

```
src/
├── app/                      # Next.js App Router (PUBLIC PAGES ONLY)
│   ├── api/                  # API routes (tRPC, emails, webhooks)
│   ├── onze-uitjes/          # Workshop/activity pages
│   ├── checkout/             # Payment flow
│   ├── faq/                  # FAQ page (reads from DB)
│   ├── onze-medewerkers/     # Team page (reads from DB)
│   ├── ons-verhaal/          # About page (reads from PageContent)
│   └── [pages]/              # Other public pages
├── components/               # React components
│   ├── ui/                   # shadcn/ui primitives (DO NOT MODIFY)
│   └── [feature].tsx         # Feature components
├── server/api/routers/       # tRPC routers (public read operations)
├── lib/                      # Utilities
└── trpc/                     # tRPC client/server setup

prisma/
├── schema.prisma             # Database models (source of truth)
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

## Database

**Shared with Backend**: Both repos connect to the SAME Neon PostgreSQL database.

- Frontend: Uses Prisma ORM (manages migrations)
- Backend: Uses Drizzle ORM (read/write, no migrations)

## Code Quality - Zero Tolerance

```bash
bun run typecheck && bun run lint
```

Fix ALL errors before continuing. No exceptions.

## Deployment

**Preview**: https://goeduitje-nl-rebuild.vercel.app/
Push to `main` → Vercel auto-deploys

## Admin Access

**All admin functionality is in the backend repo:**

- goeduitje-backend.vercel.app/content/faq - FAQ management
- goeduitje-backend.vercel.app/content/team - Team members
- goeduitje-backend.vercel.app/content/testimonials - Testimonials
- goeduitje-backend.vercel.app/content/recipes - Recipes
- goeduitje-backend.vercel.app/workshops - Workshop requests
- And more...

## Organization Rules

- tRPC routers → `/server/api/routers/[name].ts`
- Seed scripts → `/prisma/seed-[name].ts`
- UI primitives → `/components/ui/` (shadcn only)
- Max 300 lines per file

## Never Do

- Create admin pages in this repo (use backend)
- Create custom UI primitives (use shadcn/ui)
- Write CSS animations (use Framer Motion)
- Hardcode content that should be in database
- Skip typecheck before committing
- Run Drizzle migrations (Prisma is source of truth)
