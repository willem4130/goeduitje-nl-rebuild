# Goeduitje.nl

Booking platform for recreational activities in the Netherlands. Features booking, payments, and admin management.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (tRPC, Stripe, emails, Instagram)
│   ├── admin/             # Admin dashboard (settings, user management)
│   ├── dashboard/         # User dashboard
│   ├── booking/           # Cal.com booking integration
│   ├── checkout/          # Stripe checkout pages
│   └── layout.tsx         # Root layout with providers
│
├── components/            # React components
│   └── ui/               # shadcn/ui components
│
├── server/api/           # Backend tRPC code
│   ├── routers/          # tRPC procedures by domain
│   ├── root.ts           # Router aggregation
│   └── trpc.ts           # tRPC configuration
│
├── trpc/                 # tRPC client setup
│   ├── client.tsx        # Client-side tRPC + React Query
│   └── server.tsx        # Server-side tRPC
│
├── lib/                  # Utilities & third-party clients
│   ├── prisma.ts         # Database client
│   ├── stripe.ts         # Payment processing
│   ├── resend.ts         # Email client
│   └── validations/      # Zod schemas
│
└── hooks/                # React hooks

prisma/schema.prisma      # Database models
emails/                   # React Email templates
tests/e2e/                # Playwright tests
docs/                     # Project documentation
```

## Organization Rules

**Keep code organized and modularized:**

- API routes → `/app/api`, one endpoint per feature (tRPC, Stripe, emails)
- Page routes → `/app/[route]`, use Next.js App Router conventions
- Components → `/components`, UI primitives in `/components/ui`
- Server logic → `/server/api/routers`, one router per domain
- Client tRPC → `/trpc/client.tsx`, server tRPC → `/trpc/server.tsx`
- Database models → `prisma/schema.prisma`
- Email templates → `/emails`, React Email components
- Utilities → `/lib`, grouped by functionality (Stripe, Prisma, validations)
- Documentation → `/docs`, numbered for sequential reading

**Modularity principles:**

- Single responsibility per file
- Co-locate related code (forms with their validation schemas)
- Use TypeScript path aliases (`@/` → `./src/`)
- Keep tRPC routers focused on one domain
- Separate client and server code clearly

## Code Quality - Zero Tolerance

After editing ANY file, run:

```bash
bun run typecheck && bun run lint && bun run format:check
```

Fix ALL errors/warnings before continuing.

**If changes affect the server (API routes, tRPC, database):**

1. Restart dev server: `bun run dev`
2. Check server startup logs for errors
3. Test affected endpoints/pages
4. Fix ALL warnings before continuing

## Tech Stack

- Next.js 16 + React 19 + TypeScript 5
- PostgreSQL + Prisma ORM
- tRPC + TanStack Query
- shadcn/ui + Tailwind CSS 4 + Framer Motion
- Stripe (payments) + Resend (email) + Cal.com (booking)
- React Hook Form + Zod (validation)
- Vitest + Playwright (testing)

## Development Guidelines

**Use only standard components from the tech stack above:**

- Use Framer Motion for animations
- Use shadcn/ui for UI components
- Leverage existing patterns from the codebase
- No custom implementations when standard solutions exist
