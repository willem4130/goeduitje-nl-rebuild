# Goeduitje.nl

A comprehensive web platform for booking recreational activities and team outings in the Netherlands. Features real-time booking, workshop configuration, payment processing, and admin management.

## Project Structure

```
goeduitjefullstackwebsite/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (tRPC, Stripe webhooks, emails)
│   │   ├── admin/             # Admin dashboard with settings & user management
│   │   ├── dashboard/         # User dashboard
│   │   ├── booking/           # Cal.com booking integration
│   │   ├── checkout/          # Stripe checkout success/cancel pages
│   │   ├── contact/           # Contact form page
│   │   ├── pricing/           # Pricing page
│   │   └── layout.tsx         # Root layout with providers
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui design system components
│   │   ├── *-form.tsx        # Form components (contact, settings, user mgmt)
│   │   ├── *-sidebar.tsx     # Navigation components (admin, app)
│   │   ├── data-table.tsx    # TanStack Table component
│   │   ├── chart-*.tsx       # Recharts visualization components
│   │   └── cal-embed.tsx     # Cal.com calendar embed
│   │
│   ├── server/               # Backend server code
│   │   └── api/
│   │       ├── trpc.ts       # tRPC configuration
│   │       ├── root.ts       # tRPC router aggregation
│   │       └── routers/      # tRPC procedures (user, etc)
│   │
│   ├── trpc/                 # tRPC client setup
│   │   ├── client.tsx        # Client-side tRPC with React Query
│   │   ├── server.tsx        # Server-side tRPC utilities
│   │   └── query-client.tsx  # TanStack Query configuration
│   │
│   ├── lib/                  # Utilities & third-party clients
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── stripe.ts         # Stripe server setup
│   │   ├── resend.ts         # Resend email client
│   │   ├── utils.ts          # General utilities (cn(), etc)
│   │   └── validations/      # Zod validation schemas
│   │
│   └── hooks/                # Custom React hooks (use-mobile, etc)
│
├── prisma/
│   └── schema.prisma         # Database models (User, Post)
│
├── emails/                   # React Email templates
│   ├── welcome.tsx
│   ├── contact-confirmation.tsx
│   └── order-confirmation.tsx
│
├── docs/                     # Comprehensive project documentation
│   ├── 00-README.md through 09-SEO-GEO-GUIDE.md
│   ├── IMPLEMENTATION-PLAN.md
│   └── [additional guides]
│
└── tests/
    ├── e2e/                  # Playwright E2E tests
    └── setup/                # Vitest configuration
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

## Tech Stack Summary

- **Framework**: Next.js 16 + React 19 + TypeScript 5
- **Database**: PostgreSQL + Prisma ORM
- **API**: tRPC + TanStack Query
- **UI**: shadcn/ui + Radix UI + Tailwind CSS 4
- **Payments**: Stripe
- **Email**: Resend + React Email
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Playwright
- **Tools**: ESLint, Prettier, Husky
