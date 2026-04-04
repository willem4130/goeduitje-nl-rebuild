# Active Debug Session — Onze Medewerkers + Image Pipeline

**Last updated**: 2026-03-17
**Status**: ✅ RESOLVED — team photos now render on /onze-medewerkers

---

## Fix Applied: /onze-medewerkers converted to Server Component

### Root cause

The page was a `"use client"` component that used `api.team.getAll.useQuery({})` for client-side data fetching. The tRPC client-side query never resolved (likely a hydration or batch link issue), causing the loading spinner to show forever.

### Solution

Split the page into:

1. **Server Component** (`page.tsx`) — fetches team members via Prisma directly, exports metadata, uses `revalidate = 300`
2. **Client Component** (`content.tsx`) — receives `teamMembers` as props, renders all the interactive UI (framer-motion animations, scroll reveals)

This eliminates the client-side tRPC dependency entirely. The page now:

- ✅ Renders team data in the initial HTML (better SEO)
- ✅ No loading spinner — content is immediately visible
- ✅ Revalidates every 5 minutes via ISR
- ✅ All animations and interactivity still work (client component)

### Additional fixes

- `src/app/faq/page.tsx:14` — changed `useQuery(undefined)` → `useQuery({})`
- `src/components/workshop-carousel.tsx:68` — changed `useQuery(undefined)` → `useQuery({})`

### Files changed

- `src/app/onze-medewerkers/page.tsx` — converted from "use client" to Server Component
- `src/app/onze-medewerkers/content.tsx` — new Client Component with all UI
- `src/app/faq/page.tsx` — fixed useQuery input
- `src/components/workshop-carousel.tsx` — fixed useQuery input

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

---

## Completed Work This Session

### SEO Finalization (3 tasks) ✅

- URL redirects, footer links, city landing pages, category pages

### Mobile Optimization (13 tasks) ✅

- Theory of Change mobile layout, globals.css spacing, hero dvh, mobile nav, reviews stats, contact page, configurator, workshop detail, medewerkers grid, nav offsets on 8+ pages, landing pages, recipes, checkout pages (Dutch translation)

### Image Replacement ✅

- 30+ images processed and optimized
- All code references updated
- All DB records updated
- Excel audit completed

### Bug Fixes ✅

- /onze-medewerkers loading spinner → Server Component with Prisma
- faq page useQuery(undefined) → useQuery({})
- workshop-carousel useQuery(undefined) → useQuery({})

### Deployments

- `b643e05` — 📱 Mobile & tablet optimization
- `0d7d10e` — 🖼️ Add optimized client photos
- `4574d21` — 🖼️ Complete image replacement per client Excel
- `3ad8ec1` — 🐛 Fix team member photos code
- `b925c31` — fix: use plain img tag
- `5d2722c` — fix: team API call null input → {} (LATEST)
