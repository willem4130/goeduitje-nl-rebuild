# Goeduitje.nl Rebuild - Implementation Plan

## Project Overview

Transform goeduitje.nl into a modern, world-class Next.js application with smooth animations, excellent UX, and brand-consistent design while preserving all existing content.

**Timeline**: ~9-10 hours for MVP
**Started**: November 13, 2025

---

## Phase 1: Foundation & Research (1 hour)

### 1.1 Project Structure ✅

- [x] Create `/design` folder for wireframes and design assets
- [x] Create `/docs/planning` folder for documentation
- [ ] Save wireframe images as `design/wireframe-homepage.png` and `design/wireframe-uitjes.png`
- [x] Create `REBUILD_PLAN.md` (this file)
- [ ] Create `BRAND_GUIDE.md` for extracted brand assets
- [ ] Create `CONTENT_INVENTORY.md` for all Dutch text content

### 1.2 Brand Asset Extraction

**ACTION REQUIRED**: Manual extraction from www.goeduitje.nl

Steps:

1. Visit www.goeduitje.nl in browser
2. Open DevTools (Inspect → Computed)
3. Extract exact colors (hex codes):
   - Primary brand color
   - Secondary colors
   - Background colors
   - Text colors
   - Accent colors
4. Identify font families used
5. Document all findings in `BRAND_GUIDE.md`

### 1.3 Content Extraction

**ACTION REQUIRED**: Manual content collection

1. Copy all Dutch text from each page
2. Document in `CONTENT_INVENTORY.md`:
   - Homepage content
   - Onze Uitjes content
   - About/Story content
   - Team member bios
   - Impact statistics
   - Testimonials

### 1.4 Animation Setup

- [ ] Install Framer Motion: `bun add framer-motion`
- [ ] Create `/src/lib/animations.ts` for reusable animation variants
- [ ] Create `/src/hooks/use-scroll-animation.tsx` for scroll-triggered animations
- [ ] Configure transition utilities

---

## Phase 2: Design System Update (20 min)

### 2.1 Colors

- [ ] Update `src/app/globals.css` with extracted brand colors
- [ ] Map brand colors to CSS variables (--primary, --secondary, etc.)
- [ ] Ensure dark mode compatibility
- [ ] Test color contrast ratios for accessibility

### 2.2 Animation Utilities

- [ ] Create smooth page transition wrapper
- [ ] Set up intersection observer for scroll animations
- [ ] Configure hover effect utilities
- [ ] Create loading state components (skeletons, spinners)

---

## Phase 3: Core Components (2-3 hours)

### 3.1 Homepage Components (from Wireframe #1)

**Hero Section**

- [ ] Create `hero-video.tsx`
  - Video background (placeholder or real video)
  - Headline overlay
  - CTA buttons: "Stel je uitje samen" + "Schrijf je in voor open"
  - Smooth fade-in animation

**USP Section**

- [ ] Create `elevator-pitch.tsx`
  - Cards displaying unique selling points
  - Scroll-triggered fade-in animations

**Workshop Preview**

- [ ] Create `workshop-carousel.tsx`
  - Horizontal scrolling carousel
  - Workshop type cards with images
  - Smooth scroll behavior
  - Touch/swipe support for mobile

**Workshop Configurator**

- [x] Use existing `workshop-configurator.tsx`
- [ ] Style updates to match new design
- [ ] Animation enhancements

**Open Workshop Signup**

- [ ] Integrate with Cal.com agenda
- [ ] Use existing `appointment-slots.tsx` or create simplified version
- [ ] Form with fields: name, email, workshop selection

**Impact Statistics**

- [ ] Create `impact-stats.tsx`
  - Simple statistics display
  - Locations: Yemen, Syria, Palestina (from wireframe)
  - Counter animations on scroll into view
  - Icons/flags for visual appeal

**Instagram Feed**

- [x] Use existing `instagram-feed.tsx`
- [ ] Style updates to match new design
- [ ] Ensure API credentials are set

**Testimonials**

- [ ] Create `testimonials-carousel.tsx`
  - Auto-rotating carousel
  - Customer quotes + names
  - Smooth transitions

**Contact CTA**

- [x] Use existing `contact-form.tsx`
- [ ] Style updates to match new design

### 3.2 Onze Uitjes Page Components (from Wireframe #2)

**Workshop Carousel**

- [ ] Reuse `workshop-carousel.tsx` from homepage
- [ ] Grid/carousel toggle option

**Workshop Cards**

- [ ] Create `workshop-card.tsx`
  - Image
  - Title
  - Brief description
  - "Benoemen bedrijf/particulier" link → configurator
  - Hover animations

**Workshop Detail Subpages**

- [ ] Create dynamic route: `/onze-uitjes/[workshop]/page.tsx`
- [ ] Workshop types:
  - Kookworkshop
  - Stadsspel
  - Game (The Game)
  - Koffie & Thee workshop
  - Beachvolleybal workshop
- [ ] Each detail page includes:
  - Hero image
  - Full description
  - Pricing info
  - Participant requirements
  - Duration
  - Locations available
  - CTA to configurator

### 3.3 New Reusable Components

**Animation Wrappers**

- [ ] Create `page-transition.tsx`
  - Framer Motion wrapper for route transitions
  - Fade in/out animations
- [ ] Create `scroll-reveal.tsx`
  - Intersection observer wrapper
  - Configurable animation types (fade, slide, scale)
  - Stagger support for lists

**Loading States**

- [ ] Create `skeleton-card.tsx`
- [ ] Create `loading-spinner.tsx`
- [ ] Update existing components to use loading states

---

## Phase 4: Pages (2-3 hours)

### 4.1 Update Homepage (`/src/app/page.tsx`)

Restructure to match Wireframe #1:

```tsx
<PageTransition>
  <HeroVideo />
  <ElevatorPitch />
  <WorkshopCarousel />
  <WorkshopConfigurator />
  <OpenWorkshopSignup />
  <ImpactStats />
  <InstagramFeed />
  <TestimonialsCarousel />
  <ContactForm />
</PageTransition>
```

### 4.2 Create Onze Uitjes Page

File: `/src/app/onze-uitjes/page.tsx`

Structure from Wireframe #2:

1. Page header with title
2. Workshop carousel
3. Links:
   - "Benoemen bedrijf/particulier" → Workshop configurator
   - "Meld je aan voor open workshop" → Cal.com agenda

### 4.3 Workshop Detail Pages

File: `/src/app/onze-uitjes/[workshop]/page.tsx`

Dynamic routes for:

- `/onze-uitjes/kookworkshop`
- `/onze-uitjes/stadsspel`
- `/onze-uitjes/game`
- `/onze-uitjes/koffie-thee-workshop`
- `/onze-uitjes/beachvolleybal`

Each page:

- Hero section with workshop-specific image
- Detailed description
- What's included
- Pricing tiers
- Duration options
- Location availability
- CTA buttons to configurator

### 4.4 Other Pages

**Ons Verhaal** (`/src/app/ons-verhaal/page.tsx`)

- [ ] Create page
- Gallery/magazine-style layout
- Story sections with images
- Mission and values
- Scroll animations between sections

**Onze Medewerkers** (`/src/app/onze-medewerkers/page.tsx`)

- [ ] Create page
- Team member grid
- Profile cards with photos
- Hover effects revealing bios

**Onze Impact** (`/src/app/onze-impact/page.tsx`)

- [ ] Create page
- Expanded impact statistics
- Maps showing project locations
- Photo galleries from impact projects
- Detailed explanations of initiatives

**Jullie Ervaringen** (`/src/app/jullie-ervaringen/page.tsx`)

- [ ] Create page
- Full testimonials page
- Filter by workshop type
- Video testimonials (if available)
- Star ratings

**Contact** (Update existing)

- [ ] Update `/src/app/contact/page.tsx`
- Style consistency with new design
- Map integration (optional)
- Multiple contact methods

---

## Phase 5: Navigation (30 min)

### 5.1 Update Top Navigation

File: `/src/components/top-navigation.tsx`

New menu structure from wireframe:

- Home (logo as link)
- Onze uitjes
  - Kookworkshop
  - Stadsspel
  - Game
  - Koffie & Thee
  - Beachvolleybal
- Ons verhaal
- Onze medewerkers
- Onze impact
- Jullie ervaringen
- Social icons (Instagram)
- Cal.com icon for booking

### 5.2 Mobile Menu

- [ ] Ensure all new pages accessible
- [ ] Smooth animations for menu open/close
- [ ] Touch-friendly tap targets

---

## Phase 6: Polish & Optimization (1-2 hours)

### 6.1 Animations

- [ ] Add page transitions (Framer Motion) to all routes
- [ ] Implement scroll-triggered animations for all sections
- [ ] Add hover effects to cards, buttons, images
- [ ] Polish loading states
- [ ] Ensure animations respect `prefers-reduced-motion`

### 6.2 Responsive Design

- [ ] Test mobile (320px, 375px, 414px)
- [ ] Test tablet (768px, 1024px)
- [ ] Test desktop (1280px, 1440px, 1920px)
- [ ] Ensure carousels work on touch devices
- [ ] Optimize images for different screen sizes
- [ ] Test landscape orientation on mobile

### 6.3 Performance

- [ ] Lazy load images (next/image)
- [ ] Optimize video loading
- [ ] Code split large components
- [ ] Check bundle size
- [ ] Test Core Web Vitals:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

### 6.4 Third-Party Integrations

- [ ] Set up Instagram API credentials
- [ ] Test Instagram feed loading
- [ ] Verify Cal.com booking integration
- [ ] Test email confirmations (Resend)
- [ ] Verify all forms submit correctly

### 6.5 SEO & Accessibility

- [ ] Add meta descriptions to all pages
- [ ] Set up OpenGraph images
- [ ] Verify heading hierarchy (h1, h2, h3)
- [ ] Add alt text to all images
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader
- [ ] Check color contrast ratios
- [ ] Add ARIA labels where needed

---

## Implementation Order (Recommended)

### Week 1: Foundation

1. ✅ Setup project structure
2. ✅ Create documentation
3. Extract brand colors & content (MANUAL)
4. Install Framer Motion
5. Create animation utilities
6. Update design system

### Week 2: Components

7. Build hero-video component
8. Build workshop-carousel component
9. Build testimonials-carousel component
10. Build impact-stats component
11. Create animation wrappers
12. Update existing components

### Week 3: Pages

13. Restructure homepage
14. Build onze-uitjes page
15. Create workshop detail pages
16. Build ons-verhaal page
17. Build onze-medewerkers page
18. Build onze-impact page
19. Build jullie-ervaringen page
20. Update contact page

### Week 4: Polish

21. Update navigation
22. Add page transitions
23. Implement scroll animations
24. Test responsive design
25. Optimize performance
26. Fix accessibility issues
27. Final QA

---

## Success Criteria

✅ All brand colors match goeduitje.nl
✅ All Dutch content preserved
✅ Smooth animations throughout
✅ Responsive on all devices
✅ Workshop configurator fully functional
✅ Instagram feed working
✅ Cal.com booking integrated
✅ Impact statistics displayed
✅ All 8 main pages created
✅ Zero TypeScript/lint errors
✅ Core Web Vitals pass
✅ Accessibility score 90+

---

## Technical Requirements

### Dependencies to Add

- framer-motion (animations)

### Environment Variables Needed

- INSTAGRAM_USER_ID
- INSTAGRAM_ACCESS_TOKEN
- CAL_COM_USERNAME (or API key)
- RESEND_API_KEY (already set)
- DATABASE_URL (already set)

### Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Chrome Android (latest version)

---

## Risk Mitigation

### Potential Issues

**Issue**: Brand colors don't match exactly
**Solution**: Manual extraction with DevTools, screenshot comparison

**Issue**: Dutch content is incomplete
**Solution**: Manual copy from live site, use Wayback Machine if needed

**Issue**: Animations cause performance issues
**Solution**: Use `will-change`, limit simultaneous animations, respect `prefers-reduced-motion`

**Issue**: Instagram API rate limits
**Solution**: Implement caching (already done), fallback to placeholder

**Issue**: Video background too large
**Solution**: Use video hosting (YouTube/Vimeo embed), optimize with ffmpeg, provide poster image

---

## Next Steps

1. **MANUAL**: Visit goeduitje.nl and extract brand colors → BRAND_GUIDE.md
2. **MANUAL**: Copy all Dutch content from site → CONTENT_INVENTORY.md
3. Install Framer Motion: `bun add framer-motion`
4. Begin component development

---

**Document Status**: Draft
**Last Updated**: November 13, 2025
**Owner**: Development Team
