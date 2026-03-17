# Active Debug Session — Onze Medewerkers + Image Pipeline

**Last updated**: 2026-03-17
**Status**: IN PROGRESS — team photos not rendering on /onze-medewerkers

---

## Critical Bug: /onze-medewerkers shows loading spinner forever

### What's been verified ✅
1. **tRPC router** (`src/server/api/routers/team.ts`): `getAll` accepts `.input(z.object({...}).optional())` — works with `{}` input
2. **API endpoint**: `GET /api/trpc/team.getAll?input={"json":{}}` returns 6 team members correctly
3. **DB records updated**: 5 of 6 team members have real image paths (`/images/team/zinab.jpg` etc.), 6th has placeholder
4. **Image files exist on disk**: `public/images/team/` has zinab.jpg, yara.jpg, duha.jpg, marloes.jpg, guus.png
5. **Images serve on Vercel**: `curl -sI https://goeduitje-nl-rebuild.vercel.app/images/team/zinab.jpg` → 200 OK
6. **Code fix deployed**: `useQuery({})` instead of `useQuery(undefined)` — confirmed in deployed JS chunk
7. **Build passes**: No TypeScript errors, only ESLint warning about `<img>` tag
8. **Deployed chunk verified**: `page-4551af718b2f4004.js` contains `.getAll.useQuery({},{staleTime:3e5,r`
9. **TRPCProvider is in the layout**: `src/components/client-layout.tsx` wraps children in `<TRPCProvider>`

### What's still broken ❌
- Page renders loading spinner (Loader2 animate-spin) and NEVER transitions to the actual team content
- This happens both on Vercel production AND local dev server
- Server-rendered HTML shows the spinner (expected for "use client" page)
- Client-side JavaScript should hydrate and make the tRPC call, but something fails silently

### What to investigate next
1. **Compare with a WORKING tRPC page** — e.g. `/jullie-ervaringen` or `/ons-verhaal` which both use `api.*.useQuery` and render fine. What's different?
2. **Check browser console** — open DevTools on the live page, look for errors in Console tab and failed requests in Network tab
3. **Check if the tRPC batch link is the issue** — the client uses `httpBatchLink` (`src/trpc/client.tsx`). Maybe the `team.getAll` call is being batched with a failing call
4. **Try the simplest possible test** — create a minimal page that ONLY calls `api.team.getAll.useQuery({})` and renders the result, nothing else. If that works, the issue is in the component code. If not, it's in the tRPC setup.
5. **Check `content.getByPage`** — this endpoint is BROKEN (`❌ content.getByPage — BROKEN with both {} and no input`). If any component on the page (or in the layout) calls this endpoint and it fails, it might crash the whole tRPC batch

### Broken tRPC endpoints found
| Endpoint | Status | Used by |
|----------|--------|---------|
| `team.getAll` | ✅ Fixed (was sending null, now sends {}) | onze-medewerkers |
| `faq.getAll` | ❌ Still sends `undefined` in code (`src/app/faq/page.tsx:14`) | /faq |
| `workshop.list` | ❌ Still sends `undefined` in code (`src/components/workshop-carousel.tsx:68`) | Homepage, /onze-uitjes |
| `content.getByPage` | ❌ Endpoint itself broken with {} input | Homepage, /ons-verhaal, /jullie-ervaringen |
| `testimonials.getFeatured` | ✅ No input needed | testimonials-carousel, compact-testimonials |
| `reviews.getStats` | ✅ No input needed | social-proof-stats, jullie-ervaringen |
| `recipes.getAll` | ✅ Works | /recepten |
| `recipes.getCategories` | ✅ Works | /recepten |

### Key hypothesis
**The `httpBatchLink` batches ALL tRPC calls on a page together.** If the homepage or layout makes a `content.getByPage` call that fails, AND if team.getAll is batched with it, the whole batch could fail. This would explain why the page shows a spinner forever — the query never resolves.

However, onze-medewerkers page itself only calls `team.getAll`. Unless a component in the layout (like the nav or footer) also makes tRPC calls that get batched.

### Files involved
- **Page**: `src/app/onze-medewerkers/page.tsx` — "use client", calls `api.team.getAll.useQuery({})`
- **tRPC client**: `src/trpc/client.tsx` — creates tRPC client with httpBatchLink
- **tRPC router**: `src/server/api/routers/team.ts` — getAll procedure
- **Layout**: `src/components/client-layout.tsx` — wraps children in TRPCProvider
- **DB**: TeamMember model in `prisma/schema.prisma`

---

## Image Pipeline Status

### All Column G images from Excel
Every image mentioned in column G of `/Users/willemvandenberg/Dev/Goeduitjeweb/All photo positions/Fotos nieuwe website maart 2026/Alle_afbeeldingen_Goeduitje.xlsx` has been:
1. ✅ Source file found in the client folder
2. ✅ Processed with `sips` (resized, compressed)
3. ✅ Placed in `public/images/` in the correct subdirectory
4. ✅ Referenced in code or DB

### Image file locations
```
public/images/
├── workshops/     — kookworkshop.jpg, stadsspel.jpg, the-game.jpg, koffie-thee.jpg,
│                    beachvolleybal.jpg, lunch-diner.jpg, kookworkshop-hero.jpg,
│                    stadsspel-hero.jpg, the-game-hero.jpg, lunch-diner-hero.jpg,
│                    open-kookworkshop.jpg, wat-uniek-maakt.jpg, koffie-thee.mp4
├── ons-verhaal/   — hero-left.jpg, hero-right.jpg, doen.jpg, visie.jpg, impressie-uitjes.mp4
├── impact/        — team-keuken.jpg, koken-deelnemers.jpg, gezellige-sfeer.jpg, team-koken.jpg
├── team/          — zinab.jpg, yara.jpg, duha.jpg, marloes.jpg, guus.png
├── recipes/       — awama.jpg, fatoush.jpg, feteh.jpg, beryani.jpg, dolmah.jpg, kunafe.jpg, champignonsoep.jpg
├── cities/        — 40 city landmark images (definitief, no changes)
├── hero/          — hero-poster.jpg, hero-poster-mobile.jpg (definitief)
└── logo/          — logo-nav.png, logo-footer.png (definitief)
```

### DB records updated
- **Workshop.image**: All 6 workshops point to `/images/workshops/[slug].jpg`
- **Workshop.video**: kookworkshop and stadsspel set to `null` (client provided images, not videos); koffie-thee set to `/images/workshops/koffie-thee.mp4`
- **TeamMember.image**: 5 of 6 updated to `/images/team/[name].jpg`; 6th (Nour) has placeholder
- **Recipe.imageUrl**: 7 of 13 updated to `/images/recipes/[name].jpg`; rest keep old Wix URLs (no client photos provided)

### Excel file updated
Two new columns added to `Alle_afbeeldingen_Goeduitje.xlsx`:
- Column H: "Bronbestand gevonden?" — all ✅
- Column I: "Verwerkt & in gebruik?" — all ✅

### Remaining useQuery(undefined) bugs to fix
These pages still use `useQuery(undefined)` which sends null and causes 400 errors:
- `src/app/faq/page.tsx:14` — change to `useQuery({})`
- `src/components/workshop-carousel.tsx:68` — change to `useQuery({})`

---

## Completed Work This Session

### SEO Finalization (3 tasks) ✅
- URL redirects, footer links, city landing pages, category pages

### Mobile Optimization (13 tasks) ✅
- Theory of Change mobile layout, globals.css spacing, hero dvh, mobile nav, reviews stats, contact page, configurator, workshop detail, medewerkers grid, nav offsets on 8+ pages, landing pages, recipes, checkout pages (Dutch translation)

### Image Replacement ✅ (except team photos rendering)
- 30+ images processed and optimized
- All code references updated
- All DB records updated
- Excel audit completed

### Deployments
- `b643e05` — 📱 Mobile & tablet optimization
- `0d7d10e` — 🖼️ Add optimized client photos
- `4574d21` — 🖼️ Complete image replacement per client Excel
- `3ad8ec1` — 🐛 Fix team member photos code
- `b925c31` — fix: use plain img tag
- `5d2722c` — fix: team API call null input → {} (LATEST)
