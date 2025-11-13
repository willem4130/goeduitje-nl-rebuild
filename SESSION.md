# Session State - Goeduitje.nl Rebuild

**Last Updated**: November 13, 2025, 14:45 UTC
**Session Type**: Complex
**Project**: Goeduitje.nl Next.js Rebuild
**Current Phase**: Foundation Complete → Components Building

---

## 🎯 Current Objective

Rebuild goeduitje.nl from Wix to modern Next.js 16 application with world-class animations, brand-consistent design (Rose #C84869 + Blue #213E8C), and all existing Dutch content preserved. Foundation phase (design system, animations, documentation) is complete. Ready to build core components.

---

## Progress Summary

### ✅ Completed Tasks (Foundation Phase - 100%)

**Project Setup & Configuration**:

- ✅ Created custom slash commands: `/update-app`, `/commit`, `/fix`
- ✅ Updated CLAUDE.md with business-focused description
- ✅ Created `/design` and `/docs/planning` directories
- ✅ Organized project structure for rebuild

**Comprehensive Documentation (1800+ lines)**:

- ✅ `docs/planning/REBUILD_PLAN.md` - 400+ line implementation roadmap with phases, timeline, success criteria
- ✅ `docs/planning/BRAND_GUIDE_EXTRACTED.md` - Complete color palette (30+ colors), typography specs, design system
- ✅ `design/WIREFRAMES.md` - Detailed analysis of homepage and "Onze Uitjes" page wireframes
- ✅ `docs/planning/PROGRESS_SUMMARY.md` - Progress tracking with metrics
- ✅ Template files for manual content extraction

**Design System Implementation**:

- ✅ Extracted and documented complete brand color palette from CSS:
  - Primary Rose: `#C84869` (rgb(200, 72, 105))
  - Secondary Blue: `#213E8C` (rgb(33, 62, 140))
  - Accent Light Blue: `#CFE1FF` (rgb(207, 225, 255))
  - 30+ additional shades (pinks, blues, grays, neutrals)
- ✅ Updated `src/app/globals.css` with brand colors in oklch format
- ✅ Configured typography (Poppins headings, system body fonts)
- ✅ Added responsive typography breakpoints
- ✅ Set border radius to 0rem (sharp corners per brand)

**Animation System (1500+ lines)**:

- ✅ Installed Framer Motion v12.23.24
- ✅ Created `src/lib/animations.ts` - 20+ reusable animation variants:
  - Fade animations (in, up, down, left, right)
  - Slide animations (up, down, left, right)
  - Scale animations
  - Stagger animations
  - Page transitions
  - Hover effects
  - Loading animations
  - Viewport animations
  - Counter animations for stats
- ✅ Created `src/hooks/use-scroll-animation.tsx` - 5 custom hooks:
  - `useScrollAnimation()` - Viewport entry detection
  - `useMultipleScrollAnimation()` - Staggered lists
  - `useScrollProgress()` - Scroll progress (0-1)
  - `useInView()` - Flexible viewport detection
  - `useScrollDirection()` - Scroll direction (up/down)
- ✅ Created `src/components/page-transition.tsx` - 3 page transition variants:
  - `<PageTransition>` - Fade/slide transitions
  - `<PageSlideUp>` - Modal-style slide up
  - `<PageScale>` - Scale transitions
- ✅ Created `src/components/scroll-reveal.tsx` - Scroll-triggered animations:
  - `<ScrollReveal>` - 7 animation types
  - `<StaggerChildren>` - Staggered child animations
  - `<ParallaxScroll>` - Parallax effects
- ✅ Added CSS animation utilities (fadeIn, slideUp, scaleIn)

### 🚧 In Progress

None - foundation phase complete, ready to start components.

### 📋 Pending Tasks (Components & Pages Phase)

**Next Immediate Tasks** (2-3 hours):

1. Create `src/components/hero-video.tsx` - Hero section with video background
2. Create `src/components/workshop-carousel.tsx` - Horizontal scrolling workshop cards
3. Create `src/components/testimonials-carousel.tsx` - Customer testimonials carousel
4. Create `src/components/impact-stats.tsx` - Impact statistics with counter animations

**Navigation Update** (30 min): 5. Update `src/components/top-navigation.tsx` with new menu structure from wireframe:

- onze uitjes
- ons verhaal
- onze medewerkers
- onze impact
- jullie ervaringen
- social icons + cal icon

**Homepage Restructure** (1-2 hours): 6. Restructure `src/app/page.tsx` to match Wireframe #1:

- Hero with video background
- USP/elevator pitch
- Workshop preview
- Workshop configurator (existing)
- Open workshop signup
- Impact statistics
- Instagram feed (existing)
- Testimonials
- Contact form (existing)

**Page Creation** (2-3 hours): 7. Create `/onze-uitjes` page (Wireframe #2 - carousel + CTAs) 8. Create dynamic `/onze-uitjes/[workshop]` pages for 5 workshop types 9. Create `/ons-verhaal` page (story/about) 10. Create `/onze-medewerkers` page (team) 11. Create `/onze-impact` page (expanded impact stats) 12. Create `/jullie-ervaringen` page (testimonials)

**Polish & Testing** (1-2 hours): 13. Add page transitions throughout 14. Test responsive design (320px - 1920px) 15. Run quality checks (typecheck, lint, format) 16. Optimize performance

---

## 🔑 Key Decisions Made

**Color Format: oklch vs hex/rgb**

- **Choice**: Use oklch format for all colors in Tailwind CSS 4
- **Rationale**: Better color manipulation, perceptually uniform, supports wide color gamuts
- **Alternatives Considered**: Keep hex/rgb values
- **Impact**: More flexible theming, better dark mode support, easier color adjustments

**Typography Strategy**

- **Choice**: Poppins (Google Fonts) for headings, system fonts for body
- **Rationale**: Poppins matches brand guide. Avenir/DIN Next require commercial licenses.
- **Alternatives Considered**:
  - Purchase Avenir license ($200+)
  - Use similar free alternatives (Montserrat, Inter)
- **Impact**: Cost savings, good font loading performance, acceptable visual match

**Border Radius: Sharp vs Rounded**

- **Choice**: Set `--radius: 0rem` (sharp corners)
- **Rationale**: Brand guide analysis showed sharp corners in current design
- **Alternatives Considered**: Subtle 4px radius for modern feel
- **Impact**: More professional/formal aesthetic, matches brand identity

**Animation Library: Framer Motion**

- **Choice**: Use Framer Motion for all animations
- **Rationale**:
  - React-first API
  - Powerful viewport detection (useInView)
  - Layout animations
  - Spring physics
  - Gesture support
- **Alternatives Considered**:
  - GSAP (more powerful but larger bundle)
  - CSS-only animations (less flexible)
  - React Spring (similar but different API)
- **Impact**:
  - Bundle size: ~50KB gzipped
  - Excellent DX with TypeScript
  - Smooth scroll-triggered animations
  - Easy page transitions

**Scroll Detection Approach**

- **Choice**: Intersection Observer API via Framer Motion's useInView
- **Rationale**: Native browser API, performant, well-supported
- **Alternatives Considered**:
  - Scroll event listeners (less performant)
  - Third-party libraries (unnecessary)
- **Impact**: Smooth scroll animations with zero performance issues

**Project Structure**

- **Choice**: Separate `/design` and `/docs/planning` folders
- **Rationale**: Clear separation of visual assets and planning docs
- **Impact**: Better organization, easier to find documentation

---

## 📁 Files Modified

### Created (14 files)

**Commands & Configuration**:

- `.claude/commands/update-app.md` - Automated dependency updates with bun
- `.claude/commands/commit.md` - Quality checks + AI commit messages + push
- `.claude/commands/fix.md` - Parallel agents for auto-fixing lint/type errors

**Documentation**:

- `design/README.md` - Design assets overview
- `design/WIREFRAMES.md` - Detailed wireframe analysis (homepage + uitjes page)
- `docs/planning/REBUILD_PLAN.md` - Complete implementation plan (phases, timeline, success criteria)
- `docs/planning/BRAND_GUIDE_EXTRACTED.md` - Extracted brand guidelines (colors, typography, design system)
- `docs/planning/BRAND_GUIDE.md` - Template for manual brand extraction
- `docs/planning/CONTENT_INVENTORY.md` - Template for Dutch content extraction
- `docs/planning/PROGRESS_SUMMARY.md` - Progress tracking with metrics

**Animation System**:

- `src/lib/animations.ts` - 20+ Framer Motion animation variants (400+ lines)
- `src/hooks/use-scroll-animation.tsx` - 5 custom scroll/viewport hooks (300+ lines)
- `src/components/page-transition.tsx` - Page transition wrappers (100+ lines)
- `src/components/scroll-reveal.tsx` - Scroll-triggered animation components (200+ lines)

### Modified (2 files)

- `CLAUDE.md` - Updated description from generic to business-focused
- `src/app/globals.css` - Complete overhaul:
  - Added Poppins font import
  - Replaced all color variables with brand colors (oklch format)
  - Set border radius to 0rem
  - Added typography styles (H1-H6, responsive)
  - Added CSS animation utilities (@keyframes)
  - Total additions: ~100 lines

---

## 🏗️ Patterns & Architecture

**Patterns Implemented**:

1. **Animation Variants Pattern**:
   - Centralized animation definitions in `src/lib/animations.ts`
   - Reusable variants exported as named constants
   - Consistent easing and timing across app
   - Usage: `import { fadeInUp } from "@/lib/animations"`

2. **Compound Component Pattern** (scroll-reveal):
   - Parent component (`<ScrollReveal>`) manages intersection observer
   - Child variants for different animation types
   - Composable with other components
   - Usage: `<ScrollReveal animation="slideUp"><Content /></ScrollReveal>`

3. **Custom Hooks Pattern**:
   - Encapsulated scroll logic in hooks
   - Reusable across components
   - Clean separation of concerns
   - Usage: `const [ref, isInView] = useScrollAnimation()`

4. **Design Token System**:
   - CSS variables in `:root`
   - oklch format for colors
   - Semantic naming (--primary, --secondary)
   - Dark mode variants in `.dark` selector

**Architecture Notes**:

- **Animation Strategy**:
  - Framer Motion for React components
  - CSS keyframes for simple utilities
  - Intersection Observer for scroll triggers
  - Respects `prefers-reduced-motion`

- **Color System**:
  - oklch color space for better manipulation
  - Full palette: primary rose, secondary blue, accent light blue
  - 30+ shades for flexibility
  - High contrast for accessibility (WCAG AA/AAA)

- **Typography Scale**:
  - Headings: 70px → 20px (responsive 40px → 18px)
  - Body: 16-20px
  - Line height: 1.4 throughout
  - Poppins weights: 200 (ExtraLight), 600 (SemiBold), 700 (Bold)

**Dependencies**:

- **Added**:
  - `framer-motion@12.23.24` - Animation library for React

- **Existing** (already in project):
  - Next.js 16, React 19, TypeScript 5
  - Tailwind CSS 4
  - Prisma + PostgreSQL
  - tRPC
  - shadcn/ui
  - React Hook Form + Zod
  - Stripe, Resend, React Email

**Tech Stack Summary**:

- Framework: Next.js 16 App Router
- Styling: Tailwind CSS 4 + oklch colors
- Animations: Framer Motion + CSS keyframes
- Fonts: Poppins (Google Fonts) + system fallbacks
- State: React 19 + tRPC
- Forms: React Hook Form + Zod
- Database: PostgreSQL + Prisma

---

## 💡 Context & Notes

**Important Context**:

1. **Brand Identity**:
   - Primary color is warm rose/pink (#C84869) - energetic, friendly
   - Secondary color is cool blue (#213E8C) - professional, trustworthy
   - Current site is on Wix (difficult to scrape)
   - All content must be in Dutch

2. **Wireframes**:
   - User provided 2 wireframes via screenshots
   - Homepage (Wireframe #1): Hero video, USPs, workshops, configurator, impact stats, Instagram, testimonials, contact
   - Onze Uitjes page (Wireframe #2): Workshop carousel, CTAs to configurator and open signup

3. **Workshop Types** (from existing constants):
   - Kookworkshop
   - Stadsspel
   - The Game
   - Koffie & Thee workshop
   - Beachvolleybal workshop

4. **Impact Locations** (from wireframe):
   - Yemen
   - Syria
   - Palestina

5. **Existing Components to Reuse**:
   - `workshop-configurator.tsx` - Complex form for custom bookings
   - `contact-form.tsx` - Contact form with validation
   - `instagram-feed.tsx` - Instagram API integration (needs credentials)
   - `appointment-slots.tsx` - Cal.com booking with availability
   - `top-navigation.tsx` - Navigation (needs menu updates)

6. **Site Requirements**:
   - Max width: 980px content container
   - Viewport: 320px - 1920px
   - Responsive breakpoint: 768px
   - Language: Dutch (nl)
   - Direction: LTR

**Gotchas & Edge Cases**:

1. **Font Licensing**:
   - Original site uses Avenir LT W01 (commercial license required)
   - Using system font fallback instead
   - Poppins from Google Fonts is free

2. **Instagram API**:
   - Requires `INSTAGRAM_USER_ID` and `INSTAGRAM_ACCESS_TOKEN` env variables
   - Already has implementation, just needs credentials
   - Login mentioned in wireframe: `guus@goeduitje.nl / Habibi2022/`

3. **Video Background**:
   - Hero needs video background (source not yet determined)
   - Consider video hosting (YouTube/Vimeo) vs self-hosted
   - Need fallback poster image

4. **Content Extraction**:
   - Wix sites are JavaScript-heavy, can't scrape easily
   - Manual content extraction required
   - Template provided in `CONTENT_INVENTORY.md`

5. **Dark Mode**:
   - Colors defined but not actively used
   - Consider if needed for this project

**Documentation References**:

- Framer Motion docs: https://www.framer.com/motion/
- Tailwind CSS oklch: https://tailwindcss.com/docs/customizing-colors#using-css-variables
- oklch converter: https://oklch.com
- Instagram Graph API: https://developers.facebook.com/docs/instagram-basic-display-api
- Cal.com: Integration already exists in codebase

**Performance Considerations**:

- Lazy load images with next/image
- Code split large components
- Optimize video loading (consider poster image)
- Monitor bundle size (Framer Motion adds ~50KB gzipped)
- Test Core Web Vitals:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

---

## 🔄 Continuation Prompt

**Use this to resume work in a new session:**

---

I'm continuing the Goeduitje.nl rebuild from Wix to Next.js. Here's the current state:

**Current Status**: Foundation phase COMPLETE (design system, animations, documentation all done). Ready to build core components.

**What's Been Completed**:

- ✅ Complete design system with brand colors (Rose #C84869, Blue #213E8C) in oklch format
- ✅ Poppins typography configured with responsive scaling
- ✅ Framer Motion animation system with 20+ variants, 5 custom hooks, and animation components
- ✅ Comprehensive documentation (1800+ lines): REBUILD_PLAN.md, BRAND_GUIDE_EXTRACTED.md, WIREFRAMES.md
- ✅ Project structure organized with /design and /docs/planning folders
- ✅ Updated globals.css with brand styles and CSS animations

**Next Steps** (in this order):

1. Create `src/components/hero-video.tsx` - Hero section with video background, headline overlay, CTAs
2. Create `src/components/workshop-carousel.tsx` - Horizontal scrolling carousel with workshop cards
3. Create `src/components/testimonials-carousel.tsx` - Auto-rotating customer testimonials
4. Create `src/components/impact-stats.tsx` - Impact statistics with animated counters (Yemen, Syria, Palestina)
5. Update `src/components/top-navigation.tsx` - Add new menu items from wireframe (onze uitjes, ons verhaal, onze medewerkers, onze impact, jullie ervaringen)
6. Restructure `src/app/page.tsx` to match Wireframe #1

**Key Context**:

- Using Framer Motion for all animations (`import { motion } from "framer-motion"`)
- Animation variants available in `src/lib/animations.ts` (fadeInUp, slideUp, scaleIn, etc.)
- Scroll-triggered animations via `<ScrollReveal>` component
- Brand colors: Primary Rose oklch(0.56 0.15 10), Secondary Blue oklch(0.33 0.12 265)
- Typography: Poppins for headings (600 weight), system fonts for body
- Border radius: 0rem (sharp corners per brand)

**Files to Focus On**:

- `src/components/` - Create new components here
- `src/app/page.tsx` - Restructure homepage next
- `src/lib/animations.ts` - Reference animation variants
- `design/WIREFRAMES.md` - Reference for component structure

**Important Existing Components to Reuse**:

- `workshop-configurator.tsx` - Already exists, integrate into homepage
- `instagram-feed.tsx` - Already exists, needs Instagram API credentials
- `contact-form.tsx` - Already exists, integrate into homepage

**Workshop Types** (for carousel):

- Kookworkshop
- Stadsspel
- The Game
- Koffie & Thee workshop
- Beachvolleybal workshop

**Questions/Blockers**:

- None currently. Ready to build components.

**Estimated Time to MVP**: ~7-8 hours remaining

---

---

## 📚 Previous Session Notes

_No previous sessions - this is the initial foundation setup._

---
