# Goeduitje.nl - FRONTEND

⚠️ **CRITICAL: THIS IS THE FRONTEND REPOSITORY**

Booking platform for recreational activities in the Netherlands. Features workshop booking, payments, and admin management with focus on exceptional UX/UI.

---

## 🚨 REPOSITORY SEPARATION RULES - NEVER MIX THESE UP!

### THIS REPOSITORY (goeduitje-nl-rebuild) - FRONTEND ONLY

✅ **Commit HERE for:**

- Frontend UI changes (pages, components, styles)
- Workshop configurator form
- Booking pages
- Public-facing pages (homepage, contact, etc.)
- Client-side code in `/src/app`, `/src/components`
- Frontend API routes that DON'T involve workshop management backend
- tRPC client calls
- Feedback page
- Email templates in `/src/emails`

### BACKEND REPOSITORY (goeduitje-backend) - BACKEND ONLY

✅ **Commit THERE for:**

- Workshop request processing backend
- Admin CMS for workshop management
- Database schema for workshops (Drizzle ORM)
- tRPC routers for workshop requests, confirmed workshops
- Quote generation (PDF + AI emails)
- Media gallery management backend
- Workshop status workflow
- Confirmed workshops database
- All backend-specific code in separate `goeduitje-backend` folder

### ⛔ NEVER DO THIS:

- ❌ Commit backend workshop management code to frontend repo
- ❌ Commit frontend UI code to backend repo
- ❌ Mix workshop backend logic with frontend in same commit
- ❌ Push to both repos in same commit

### 🔍 BEFORE EVERY COMMIT - ASK YOURSELF:

1. **"Is this code for the public website UI?"** → Frontend repo
2. **"Is this code for workshop admin/backend?"** → Backend repo
3. **"Does this involve the workshop request database?"** → Backend repo
4. **"Does this change how users see the website?"** → Frontend repo

---

## Tech Stack - Standard Tools Only

- **Framework**: Next.js 14 + React 18 + TypeScript 5
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

## OTAP Pipeline - CRITICAL SETUP

### 🎯 TWO SEPARATE PIPELINES - NEVER MIX!

---

### FRONTEND PIPELINE (THIS REPO)

**Repository**: https://github.com/willem4130/goeduitje-nl-rebuild.git

#### Development (Local)

- Branch: `develop` or feature branches
- Run: `bun run dev` (http://localhost:3000)
- Test: `bun run test` + `bun run test:e2e`
- Quality: `bun run typecheck && bun run lint && bun run format:check`

#### Staging/Preview (Vercel Preview)

- **Trigger**: Push to any branch except `main`
- **URL**: Auto-generated preview URL (https://goeduitje-nl-rebuild-xxx.vercel.app)
- **Purpose**: Test features before production
- **Database**: Use staging database
- **Process**:
  1. Create feature branch: `git checkout -b feature/new-feature`
  2. Make changes and commit: `git commit -m "feat: description"`
  3. Push: `git push origin feature/new-feature`
  4. Vercel auto-deploys preview
  5. Test on preview URL
  6. Create PR to main when ready

#### Production (Vercel)

- **Branch**: `main` only
- **URL**: https://goeduitje-nl-rebuild.vercel.app/ → https://www.goeduitje.nl
- **Trigger**: Merge to `main` or direct push to `main`
- **Database**: Production PostgreSQL
- **Process**:
  1. Ensure all checks pass: `bun run typecheck && bun run lint`
  2. Merge PR to main OR commit directly to main
  3. Push: `git push origin main`
  4. Vercel auto-deploys to production
  5. **CRITICAL**: Verify deployment at https://www.goeduitje.nl
  6. Monitor for errors in Vercel dashboard

---

### BACKEND PIPELINE (SEPARATE REPO)

**Repository**: `willem4130/goeduitje-backend` (TO BE CREATED)

#### Development (Local)

- Branch: `develop` or feature branches
- Run: `bun run dev` (port 3003)
- Test: Backend-specific tests
- Quality: `bun run typecheck && bun run lint && bun run format:check`
- **Database**: Separate development database

#### Staging/Preview (Vercel Preview)

- **Trigger**: Push to any branch except `main`
- **URL**: Auto-generated preview URL
- **Database**: Staging backend database (SEPARATE from frontend!)
- **Process**: Same as frontend staging

#### Production (Vercel)

- **Branch**: `main` only
- **URL**: Backend production URL (to be configured)
- **Database**: Production PostgreSQL (SEPARATE from frontend!)
- **Trigger**: Merge to `main`

---

### 🚨 DEPLOYMENT RULES - FOLLOW STRICTLY

#### Before ANY Commit:

```bash
# Run quality checks
bun run typecheck && bun run lint && bun run format:check

# Fix ALL errors before continuing
# NO exceptions!
```

#### Frontend Deployment Checklist:

- [ ] All quality checks pass
- [ ] Changes are ONLY frontend-related (UI, pages, components)
- [ ] Tested locally on `localhost:3000`
- [ ] Commit to **frontend repo** only
- [ ] Push to correct branch (feature → preview, main → production)
- [ ] Verify deployment on Vercel
- [ ] Check production URL works

#### Backend Deployment Checklist:

- [ ] All quality checks pass
- [ ] Changes are ONLY backend-related (admin, CMS, database, APIs)
- [ ] Tested locally on `localhost:3003`
- [ ] Commit to **backend repo** only
- [ ] Separate database used
- [ ] Push to correct branch
- [ ] Verify deployment
- [ ] Test API endpoints

---

### 🔥 CRITICAL: Database Separation

**Frontend Database** (goeduitje-nl-rebuild):

- Current tRPC endpoints (recipes, reviews, etc.)
- User accounts (if applicable)
- Existing Prisma models

**Backend Database** (goeduitje-backend):

- Workshop requests
- Confirmed workshops
- Admin data
- Media gallery
- Feedback
- **COMPLETELY SEPARATE** - different DATABASE_URL

**NEVER** share databases between frontend and backend!

---

### 📋 Git Workflow Best Practices

#### Feature Development:

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/workshop-form-validation

# 2. Make changes, commit often
git add -A
git commit -m "feat: add email validation to workshop form"

# 3. Push and create PR
git push origin feature/workshop-form-validation
# Create PR on GitHub: feature/workshop-form-validation → main

# 4. After PR approved, merge to main
# Vercel auto-deploys to production
```

#### Hotfix (Emergency Production Fix):

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix bug, test thoroughly
# 3. Commit and push
git commit -m "fix: resolve payment processing error"
git push origin hotfix/critical-bug

# 4. Create PR, get quick review, merge ASAP
# 5. Verify production deployment immediately
```

---

### 🛠️ Environment Variables

#### Frontend (.env.local):

```env
DATABASE_URL="postgresql://..."           # Frontend database
STRIPE_SECRET_KEY="sk_..."
RESEND_API_KEY="re_..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://www.goeduitje.nl"
```

#### Backend (.env.local):

```env
DATABASE_URL="postgresql://..."           # DIFFERENT backend database!
RESEND_API_KEY="re_..."                   # Shared (same account)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."   # Shared (same account)
ANTHROPIC_API_KEY="sk-ant-..."            # For quote email generation
NEXTAUTH_SECRET="..."                     # Different from frontend
NEXTAUTH_URL="http://localhost:3003"
```

**NEVER commit .env files to git!**

---

### 📊 Monitoring & Rollback

#### Monitor Deployments:

- Vercel Dashboard: https://vercel.com/willem4130
- Check deployment logs for errors
- Monitor Sentry (if configured) for runtime errors

#### Rollback if Needed:

1. Go to Vercel dashboard
2. Find previous working deployment
3. Click "Promote to Production"
4. Or: `git revert` bad commit and redeploy

---

### ✅ Pre-Deployment Checklist

Before merging to `main` (production):

- [ ] All tests pass (`bun run test`)
- [ ] Type checking passes (`bun run typecheck`)
- [ ] Linting passes (`bun run lint`)
- [ ] Code formatted (`bun run format:check`)
- [ ] Tested on preview deployment
- [ ] Database migrations run (if applicable)
- [ ] Environment variables configured in Vercel
- [ ] Breaking changes documented
- [ ] Team notified of deployment

## Never Do

❌ Create custom UI primitives (use shadcn/ui)
❌ Write custom CSS animations (use Framer Motion)
❌ Build carousel from scratch (use Embla)
❌ Implement auth from scratch (if needed, use NextAuth)
❌ Create custom form components (use React Hook Form)
❌ Build custom icon components (use Lucide React)
