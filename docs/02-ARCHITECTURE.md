# System Architecture

> **Technical architecture and design decisions for Goeduitje.nl**

---

## 🏗️ Architecture Overview

The Goeduitje.nl platform is built as a modern full-stack web application using Next.js 16 with the App Router, providing both server-side rendering and static generation capabilities.

###

High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Browser - React 19, TypeScript, Tailwind CSS)            │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                │ HTTP/WebSocket
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                     Next.js Application                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  App Router  │  │     API      │  │   Middleware │     │
│  │   (Pages)    │  │   (tRPC)     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────────────┬─────────────────────────────┘
                                │
                     ┌──────────┴──────────┐
                     │                     │
         ┌───────────▼──────────┐  ┌──────▼──────────┐
         │   Prisma ORM         │  │  External APIs  │
         │                      │  │  - Stripe       │
         └──────────┬───────────┘  │  - Resend       │
                    │              │  - Cal.com      │
         ┌──────────▼───────────┐  └─────────────────┘
         │  PostgreSQL Database │
         │                      │
         └──────────────────────┘
```

---

## 🔧 Tech Stack

### Frontend

**Core Framework**

- **Next.js 16.0.1**: React framework with App Router
- **React 19.2.0**: UI library with latest features
- **TypeScript 5**: Type-safe JavaScript

**Styling**

- **Tailwind CSS 4**: Utility-first CSS framework
- **tw-animate-css**: Animation utilities
- **class-variance-authority**: Component variant system
- **tailwind-merge**: Utility class merging

**UI Components**

- **shadcn/ui**: Component collection built on Radix UI
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Tabler Icons**: Additional icon set

**State Management**

- **TanStack Query**: Server state management
- **React Hook Form**: Form state management
- **Zod**: Schema validation

**Additional Libraries**

- **next-themes**: Dark mode support
- **sonner**: Toast notifications
- **vaul**: Drawer component
- **recharts**: Data visualization

### Backend

**API Layer**

- **tRPC 11.7.1**: End-to-end typesafe APIs
- **@trpc/server**: tRPC server
- **@trpc/client**: tRPC client
- **@trpc/react-query**: React Query integration

**Database**

- **Prisma 6.19.0**: Next-generation ORM
- **PostgreSQL**: Relational database
- **@prisma/client**: Database client

**Integrations**

- **Stripe**: Payment processing
- **Resend**: Transactional email
- **Cal.com**: Booking system (optional)

**Utilities**

- **superjson**: JSON serialization with type support
- **server-only**: Server-side code protection

### Development Tools

**Testing**

- **Vitest 4.0.7**: Unit testing framework
- **Playwright 1.56.1**: E2E testing
- **@testing-library/react**: React testing utilities
- **jsdom**: DOM testing environment

**Code Quality**

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks
- **lint-staged**: Staged file linting

**Build Tools**

- **@tailwindcss/postcss**: Tailwind PostCSS plugin
- **PostCSS**: CSS processing

---

## 📁 Project Structure

```
goeduitjefullstackwebsite/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
│
├── public/
│   ├── images/                 # Static images
│   ├── fonts/                  # Font files
│   └── icons/                  # Static icons
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes group
│   │   ├── (admin)/           # Admin routes group
│   │   ├── (dashboard)/       # User dashboard group
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   ├── forms/            # Form components
│   │   └── ...
│   │
│   ├── lib/                   # Utilities and config
│   │   ├── utils.ts          # Utility functions
│   │   ├── prisma.ts         # Prisma client
│   │   ├── stripe.ts         # Stripe client
│   │   ├── constants/        # App constants
│   │   └── validations/      # Zod schemas
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.ts
│   │   └── ...
│   │
│   ├── server/                # Server-side code
│   │   └── api/
│   │       ├── trpc.ts       # tRPC setup
│   │       ├── root.ts       # Root router
│   │       └── routers/      # API routers
│   │
│   ├── trpc/                  # tRPC client setup
│   │   ├── client.tsx
│   │   ├── server.tsx
│   │   └── query-client.tsx
│   │
│   └── types/                 # TypeScript types
│       └── ...
│
├── tests/                     # Test files
│   ├── unit/                 # Unit tests
│   └── e2e/                  # E2E tests
│
├── docs/                      # Documentation
│   └── ...
│
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── README.md                # Project readme
```

---

## 🎯 Architecture Decisions

### 1. Next.js App Router

**Decision**: Use Next.js 16 with App Router (not Pages Router)

**Rationale**:

- Server Components by default (better performance)
- Simplified data fetching
- Improved layouts and nested routes
- Better TypeScript support
- Streaming and Suspense support
- Future-proof (App Router is the future)

**Trade-offs**:

- Newer API (less Stack Overflow answers)
- Learning curve for team
- Some libraries not optimized yet

### 2. tRPC for API Layer

**Decision**: Use tRPC instead of REST or GraphQL

**Rationale**:

- End-to-end type safety
- No code generation needed
- Excellent DX with autocompletion
- Integrates seamlessly with React Query
- Less boilerplate than REST
- Simpler than GraphQL for our use case

**Trade-offs**:

- Tight coupling between frontend and backend
- Not ideal for public APIs
- Requires TypeScript

### 3. Prisma ORM

**Decision**: Use Prisma instead of raw SQL or other ORMs

**Rationale**:

- Type-safe database queries
- Excellent developer experience
- Automatic migrations
- Great TypeScript integration
- Visual database browser
- Active development and community

**Trade-offs**:

- Some overhead vs raw SQL
- Learning curve
- Vendor lock-in (minimal)

### 4. PostgreSQL Database

**Decision**: Use PostgreSQL instead of MySQL or MongoDB

**Rationale**:

- Robust relational database
- ACID compliance
- JSON support (when needed)
- Excellent performance
- Great Prisma support
- Industry standard

**Trade-offs**:

- Requires hosted database
- More complex than SQLite
- Not as flexible as MongoDB

### 5. Tailwind CSS

**Decision**: Use Tailwind CSS instead of CSS-in-JS or plain CSS

**Rationale**:

- Rapid development
- Consistent design system
- Small bundle size (purged CSS)
- Great documentation
- Large ecosystem
- Easy customization via config

**Trade-offs**:

- Learning curve for new developers
- Can lead to long className strings
- Requires build step

### 6. shadcn/ui Components

**Decision**: Use shadcn/ui instead of Material-UI or Chakra UI

**Rationale**:

- Copy-paste, full control over code
- Built on Radix UI (accessible)
- Tailwind-based styling
- Customizable
- No package bloat
- Modern design

**Trade-offs**:

- Manual updates required
- Less comprehensive than full libraries
- Need to maintain copied code

### 7. Monorepo vs Separate Repos

**Decision**: Monorepo (single repository)

**Rationale**:

- Shared types between frontend and backend
- Simplified development workflow
- tRPC works best in monorepo
- Easier deployments
- Smaller project size

**Trade-offs**:

- All code in one place (can get large)
- Harder to separate later
- Single version control

### 8. Server Components vs Client Components

**Decision**: Server Components by default, Client Components when needed

**Rationale**:

- Better performance (less JavaScript)
- Improved SEO
- Direct database access
- Reduced client bundle
- Next.js 16 best practice

**When to use Client Components**:

- Need interactivity (onClick, onChange)
- Use React hooks (useState, useEffect)
- Browser APIs (localStorage, window)
- Third-party components requiring client

### 9. Deployment Platform

**Decision**: Vercel for hosting

**Rationale**:

- Made by Next.js creators
- Zero-config deployment
- Excellent DX
- Edge network
- Preview deployments
- Generous free tier
- Built-in analytics

**Trade-offs**:

- Vendor lock-in
- Can get expensive at scale
- Limited backend customization

---

## 🔄 Data Flow

### Page Request Flow

```
1. User requests page (e.g., /activiteiten)
   ↓
2. Next.js Server Component renders
   ↓
3. Server fetches data (tRPC or direct Prisma)
   ↓
4. HTML sent to client (streaming)
   ↓
5. Client hydrates React components
   ↓
6. Client-side interactivity enabled
```

### API Request Flow (tRPC)

```
1. Client calls tRPC procedure
   ↓
2. Request sent to /api/trpc
   ↓
3. tRPC router receives request
   ↓
4. Router calls appropriate procedure
   ↓
5. Procedure interacts with Prisma/DB
   ↓
6. Response validated with Zod
   ↓
7. Type-safe response returned to client
   ↓
8. React Query caches result
```

### Form Submission Flow

```
1. User fills form
   ↓
2. React Hook Form validates (Zod schema)
   ↓
3. Form submits via tRPC mutation
   ↓
4. Server validates again
   ↓
5. Data saved to database (Prisma)
   ↓
6. Side effects triggered (email, etc.)
   ↓
7. Success response to client
   ↓
8. UI updates (toast notification)
```

---

## 🗄️ Database Design

### Entity Relationship Overview

```
User ──< Booking
         │
         ↓
      Activity ──< Testimonial

Page (CMS content)

BlogPost

ContactSubmission
```

### Key Tables

**User**

- Stores user accounts (customers and admins)
- Relations: Bookings

**Activity**

- Services/experiences offered
- Relations: Bookings
- Includes: Pricing, images, description, availability

**Booking**

- Customer bookings
- Relations: User, Activity
- Status: PENDING, CONFIRMED, CANCELLED, COMPLETED

**Testimonial**

- Customer reviews
- Published/unpublished
- Rating system

**Page**

- CMS for flexible page content
- JSON content blocks
- SEO metadata

**BlogPost**

- Blog articles
- Categories, tags, SEO

**ContactSubmission**

- Contact form submissions
- Status tracking

See [content/DATA-MODELS.md](./content/DATA-MODELS.md) for complete schema.

---

## 🔐 Security Architecture

### Authentication & Authorization

```typescript
// Simple role-based access
enum UserRole {
  USER,
  ADMIN,
}

// Middleware checks user role
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
```

### Data Protection

- **Environment Variables**: Sensitive data in `.env` (never committed)
- **API Keys**: Server-side only, never exposed to client
- **Database**: Password-protected PostgreSQL
- **HTTPS**: All traffic encrypted (enforced by Vercel)
- **Input Validation**: Zod schemas on client and server
- **SQL Injection**: Prevented by Prisma (parameterized queries)
- **XSS**: React escapes output by default
- **CSRF**: Next.js built-in protection

---

## 📊 Performance Architecture

### Caching Strategy

**Level 1: CDN (Vercel Edge)**

- Static assets cached globally
- Automatic cache invalidation on deploy

**Level 2: Next.js Caching**

- Static pages generated at build time
- ISR for dynamic-but-cacheable pages
- React Server Components cached

**Level 3: React Query**

- Client-side data caching
- Stale-while-revalidate
- Optimistic updates

**Level 4: Database**

- PostgreSQL query caching
- Connection pooling

### Performance Optimizations

**Code Splitting**

```typescript
// Route-based splitting (automatic)
app/
  activiteiten/page.tsx  → chunk-activiteiten.js
  contact/page.tsx       → chunk-contact.js

// Component-based splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

**Image Optimization**

- Next.js Image component (automatic optimization)
- WebP/AVIF formats
- Responsive images
- Lazy loading
- LQIP placeholders

**Font Optimization**

- next/font with preloading
- WOFF2 format
- Subset fonts
- font-display: swap

---

## 🧩 Component Architecture

### Component Hierarchy

```
Layout Components
  ├── RootLayout (providers, fonts)
  └── PublicLayout (header, footer)
      ├── SiteHeader
      │   ├── MainNav
      │   └── MobileNav
      └── SiteFooter

Page Components
  └── HomePage
      ├── HeroSection
      ├── FeaturedActivities
      ├── TestimonialCarousel
      └── CTASection

UI Components (shadcn/ui)
  ├── Button
  ├── Card
  ├── Input
  └── ... (24+ components)
```

### Component Patterns

**Server Components** (default)

```typescript
// Fetch data directly
export default async function ActivityPage({ params }) {
  const activity = await db.activity.findUnique({
    where: { slug: params.slug }
  });

  return <ActivityDetail activity={activity} />;
}
```

**Client Components**

```typescript
'use client';

export function BookingButton() {
  const [open, setOpen] = useState(false);

  return (
    <Button onClick={() => setOpen(true)}>
      Book Now
    </Button>
  );
}
```

**Hybrid Pattern**

```typescript
// Server Component
export default async function Page() {
  const data = await fetchData(); // server-side

  return <InteractiveClient data={data} />; // client-side
}
```

---

## 🔌 External Integrations

### Stripe (Payments)

```typescript
// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Usage
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: priceId, quantity: 1 }],
  mode: "payment",
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
});
```

### Resend (Email)

```typescript
// lib/resend.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Usage
await resend.emails.send({
  from: "noreply@goeduitje.nl",
  to: customer.email,
  subject: "Booking Confirmation",
  html: emailTemplate,
});
```

### Cal.com (Booking)

```typescript
// Embedded scheduling
<Cal
  calLink="goeduitje/consultation"
  config={{ theme: 'light' }}
/>
```

---

## 🚀 Deployment Architecture

### Hosting: Vercel

```
GitHub Repository
    ↓ (push to main)
Automatic Build
    ↓
Deploy to Vercel Edge Network
    ↓
Global CDN Distribution
```

### Environment Setup

**Development**

- Local PostgreSQL or hosted DB
- Local dev server (`npm run dev`)
- Hot module reloading

**Preview** (per PR)

- Preview database or shared dev DB
- Unique URL per deployment
- Automatic on PR creation

**Production**

- Production PostgreSQL (e.g., Neon, Supabase)
- Custom domain (goeduitje.nl)
- Automatic on merge to main

---

## 📈 Scalability Considerations

### Current Architecture (MVP)

- Single Vercel deployment
- Single PostgreSQL database
- Serverless functions for API

### Future Scaling Options

**If traffic grows**:

- Add database read replicas
- Implement Redis for caching
- Use Vercel Pro (more bandwidth)
- CDN for static assets

**If team grows**:

- Split into microservices (separate repos)
- Add dedicated backend server
- Implement message queue (Bull, Kafka)
- Add monitoring (Datadog, New Relic)

---

## 🔍 Monitoring & Observability

### Built-in Monitoring

- **Vercel Analytics**: Traffic, performance
- **Vercel Logs**: Function logs
- **Next.js**: Build-time warnings

### Recommended Additions

- **Sentry**: Error tracking and monitoring
- **Google Analytics 4**: User analytics
- **LogRocket**: Session replay (optional)
- **Uptime Robot**: Uptime monitoring

---

## 📚 Further Reading

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: November 6, 2025
**Version**: 1.0
**Document Owner**: Technical Team
