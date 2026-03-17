## Session State - 2026-03-09

I'm continuing work on **Goeduitje.nl** in `/Users/willemvandenberg/Dev/Goeduitjeweb/goeduitje-nl-rebuild`.

**Tech Stack**: Next.js 14 | TypeScript | Prisma + PostgreSQL (Neon) | tRPC | shadcn/ui + Tailwind CSS 4 | Framer Motion | Stripe | Resend | Bun

**Master Plan**: `/Users/willemvandenberg/Dev/Goeduitjeweb/Plan to finilize/SEO_FINALIZE_PLAN.md` — 5 issues for desktop-ready SEO launch.

**What's Done**:

- ✅ Issue 1: URL Mismatches — 7x 301 redirects in `next.config.mjs`
- ✅ Issue 2: Footer query param links — replaced with static URLs to category pages
- ✅ Issue 5: Category pages — 3 static pages: `/teambuilding` (blue), `/bedrijfsuitjes` (green), `/workshops` (amber)
- ✅ Issue 5: City landing pages — 7 new type-specific landing pages (teambuilding, bedrijfsuitje, stadsspel for Nijmegen/Arnhem)
- ✅ `TypedLandingPage` component with per-type themes, content, FAQ, workshop cards
- ✅ Browser-checked all 4 page types in production — layout consistent, no errors
- ✅ Fixed dummy phone number → real `+31652675891`, added aria-labels
- ✅ Issue 3: City pages missing prices — Added to all 40+ kookworkshop city landing pages:
  - Quick info bar (€55 p.p. / 2,5 uur / 8 personen) after hero
  - Price tiers table (8-10: €70, 11-15: €60, 16+: €55 excl btw) with link to full variants
  - "Wat is inbegrepen" checklist (6 items matching seed data)
- ✅ Build verified: 48+ landing pages, typecheck + lint clean

**Current State**: Issues 1, 2, 3, 5 fully complete. Ready to start **Issue 4**.

**Next Steps (Issue 4: Bedankt page + GA4 tracking)**:

1. Create `/bedankt` page — dedicated thank-you page after configurator submission
   - Show confirmation summary (workshop type, date, participants)
   - Include social proof / next steps
2. Integrate GTM / GA4 — add tracking script to root layout (`src/app/layout.tsx`)
   - Use environment variable for GTM_ID / GA_MEASUREMENT_ID
3. Implement dataLayer `purchase` event on configurator submission
   - Push GA4 ecommerce spec event with transaction_id, value, currency, items[]
4. Update configurator redirect: currently goes to `/jullie-ervaringen`, change to `/bedankt`
   - File: `src/components/workshop-configurator.tsx`

**Key Decisions Made**:

- Used 301 redirects (Option B) for URL mismatches
- Category pages are static server components with hardcoded data (not DB-fetched)
- Non-kookworkshop landing pages use separate `TypedLandingPage` component
- Kookworkshop pricing on city pages is hardcoded (Arabische variant tiers), with link to full detail page for other variants
- `LandingPageData` interface has `type?: LandingType` and `displayTitle?: string` fields
- `extractCitySlug()` helper handles all slug prefixes

**Important Context**:

- CLAUDE.md says: NEVER add `export const dynamic = "force-dynamic"` to root layout
- CLAUDE.md says: Use `--no-verify` for commits if lint-staged has issues
- Workshop slugs in DB: `kookworkshop`, `stadsspel`, `the-game`, `koffie-thee-workshop`, `beachvolleybal-workshop`, `lunch-diner`
- Lunch & Diner uses 9% BTW (not 21%)
- The `TypedLandingPage` component (non-kookworkshop) is at the bottom of `page.tsx` (~lines 1120+)
- The kookworkshop rendering is the original component (~lines 575-1115)
- Production URL: https://goeduitje-nl-rebuild.vercel.app
- Changes are NOT yet committed or pushed

**Key Files**:

- `src/app/(landing)/[slug]/page.tsx` — main landing page file (~1700 lines now, kookworkshop + TypedLandingPage)
- `prisma/seed-workshops.ts` — workshop pricing data (source of truth for prices)
- `src/lib/city-data.ts` — city images & data
- `src/app/teambuilding/page.tsx` — reference for price display format on category pages
- `src/components/workshop-configurator.tsx` — configurator to modify for Issue 4 (redirect + dataLayer)
- `src/app/layout.tsx` — root layout for GTM script injection (Issue 4)
- `/Users/willemvandenberg/Dev/Goeduitjeweb/Plan to finilize/SEO_FINALIZE_PLAN.md` — master plan
