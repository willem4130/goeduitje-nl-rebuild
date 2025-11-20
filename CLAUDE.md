# Goeduitje.nl

Booking platform for recreational activities in the Netherlands. Features workshop booking, payments, and admin management with focus on exceptional UX/UI.

## Tech Stack - Standard Tools Only

- **Framework**: Next.js 16 + React 19 + TypeScript 5
- **Database**: PostgreSQL + Prisma ORM
- **API**: tRPC + TanStack Query
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Carousel**: Embla Carousel React
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Payments**: Stripe
- **Email**: Resend + React Email
- **Booking**: Cal.com integration
- **Testing**: Vitest + Playwright

## UX/UI Principles

**Always prioritize user experience:**

1. **Responsive First**: Design works beautifully on all devices (mobile, tablet, desktop)
2. **Performance**: Fast loading, smooth animations, optimized images
3. **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
4. **Consistency**: Use design tokens, spacing system, typography scale
5. **Feedback**: Clear loading states, error messages, success confirmations
6. **Progressive Disclosure**: Show relevant information when needed, avoid overwhelming users

## Component Design Standards

**Use ONLY shadcn/ui components** - Never create custom UI primitives:

- ✅ Use: `<Button>`, `<Card>`, `<Dialog>`, `<Select>`, etc. from `/components/ui`
- ❌ Don't: Create custom button/input/modal components from scratch
- ✅ Customize: Extend shadcn/ui components with composition, not modification
- ✅ Animations: Use Framer Motion for all animations (no custom CSS animations)
- ✅ Carousels: Use Embla Carousel React (already installed)
- ✅ Icons: Use Lucide React only

**Component Organization:**

- UI primitives → `/components/ui` (shadcn/ui components)
- Feature components → `/components` (e.g., `workshop-carousel.tsx`)
- One component per file, co-locate related code
- Export interface types with components

## Responsive Design System

**Breakpoints (Tailwind):**

```
sm:  640px  (tablet)
md:  768px  (small desktop)
lg:  1024px (desktop)
xl:  1280px (large desktop)
```

**Spacing Scale** (use consistently):

```
section-sm:  3rem top/bottom (48px)
section-md:  4rem top/bottom (64px)
section-lg:  6rem top/bottom (96px)
```

**Typography:**

- Mobile-first sizing, scale up for larger screens
- Use design system classes: `text-lg`, `text-xl`, `text-2xl`
- Maintain consistent line-height and letter-spacing

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (tRPC, Stripe, emails)
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── booking/           # Cal.com integration
│   ├── checkout/          # Stripe checkout
│   ├── page.tsx           # Homepage
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives (Button, Card, etc.)
│   ├── workshop-carousel.tsx
│   ├── hero-video.tsx
│   └── ...               # Other feature components
│
├── server/api/           # Backend tRPC
│   ├── routers/          # tRPC routers by domain
│   ├── root.ts           # Router aggregation
│   └── trpc.ts           # tRPC config
│
├── trpc/                 # tRPC client
│   ├── client.tsx        # Client-side tRPC
│   └── server.tsx        # Server-side tRPC
│
├── lib/                  # Utilities
│   ├── prisma.ts         # Database client
│   ├── stripe.ts         # Payments
│   ├── resend.ts         # Email
│   ├── animations.ts     # Framer Motion presets
│   └── validations/      # Zod schemas
│
└── hooks/                # React hooks

prisma/schema.prisma      # Database models
emails/                   # React Email templates
public/images/            # Optimized images
```

## Code Quality - Zero Tolerance

**After editing ANY file, run:**

```bash
bun run typecheck && bun run lint && bun run format:check
```

Fix ALL errors/warnings before continuing.

**If changes affect server (API, tRPC, database):**

1. Restart dev server: `bun run dev`
2. Check server logs for errors
3. Test affected endpoints
4. Fix ALL warnings before continuing

## Organization Rules

**Modularity principles:**

- Single responsibility per file
- Co-locate related code (forms with validation schemas)
- Use TypeScript path aliases (`@/` → `./src/`)
- Keep components under 300 lines (split if larger)
- One component per file, clear naming

**File locations:**

- Pages → `/app/[route]/page.tsx`
- API routes → `/app/api/[endpoint]/route.ts`
- Components → `/components/[name].tsx`
- UI primitives → `/components/ui/[primitive].tsx`
- Utilities → `/lib/[category]/[name].ts`
- Types → Co-located with usage or `/lib/types/`

## Performance Best Practices

1. **Images**: Use Next.js `<Image>` with proper sizing, lazy loading, blur placeholders
2. **Code Splitting**: Dynamic imports for heavy components
3. **Animations**: Use `transform` and `opacity` only (GPU-accelerated)
4. **Bundle Size**: Monitor with `bun run build`, keep under reasonable limits
5. **Database**: Optimize queries, use proper indexing, avoid N+1 problems

## Accessibility Requirements

- ✅ Semantic HTML (`<nav>`, `<main>`, `<article>`, etc.)
- ✅ Proper heading hierarchy (`h1` → `h2` → `h3`)
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators visible
- ✅ Color contrast WCAG AA (4.5:1 text, 3:1 UI)
- ✅ Screen reader testing

## Standard Patterns

**Carousel (Embla):**

```tsx
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
  Autoplay({ delay: 4000 }),
]);
```

**Forms (React Hook Form + Zod):**

```tsx
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

**Animations (Framer Motion):**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## Third-Party Integrations

- **Instagram**: Use EmbedSocial/LightWidget (not Graph API)
- **Payments**: Stripe Checkout + Webhooks
- **Booking**: Cal.com embed
- **Email**: Resend with React Email templates

## Never Do

❌ Create custom UI primitives (use shadcn/ui)
❌ Write custom CSS animations (use Framer Motion)
❌ Build carousel from scratch (use Embla)
❌ Implement auth from scratch (if needed, use NextAuth)
❌ Create custom form components (use React Hook Form)
❌ Build custom icon components (use Lucide React)
