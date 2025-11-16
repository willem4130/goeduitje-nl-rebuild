# Logo Implementation Guide

## Brand Identity

**Goeduitje.nl** uses a clever visual identity centered around an onion (Dutch: "ui"), which plays on the word "uitje" (outing/trip).

**Tagline**: "uitjes met een verhaal, om te janken zo goed"
(Outings with a story, so good you'll cry - playing on the onion theme)

## Logo Assets

### Available Logos

1. **logo-full.png** (1.0MB)
   - Onion illustration + "GOEDUITJE" wordmark + tagline
   - Use: Footer, about pages, marketing materials
   - Dimensions: ~2000px width (high-resolution)

2. **logo-simplified.png** (1.0MB)
   - Onion illustration + "GOEDUITJE" wordmark only
   - Use: Header navigation, favicons, social cards
   - Dimensions: ~2000px width (high-resolution)

## Logo Usage Guidelines

### Header Navigation

- **Desktop**: Simplified logo (onion + wordmark) at 180px height
- **Mobile**: Onion icon only or small simplified logo at 40px height
- **Background**: Light background with full-color logo
- **Spacing**: Minimum 16px clear space around logo

### Footer

- Use full logo with tagline
- Maximum width: 280px
- Can be centered or left-aligned based on design

### Favicons

Required sizes (to be generated):

- `favicon.ico` (16x16, 32x32, 48x48 multi-res)
- `apple-touch-icon.png` (180x180)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Social Media / Open Graph

- `og-image.png` (1200x630) - For Facebook, LinkedIn
- `twitter-image.png` (1200x600) - For Twitter/X
- Should feature simplified logo on branded background

## Color Specifications

Based on logo analysis:

- **Primary Brand Green**: `#A4BF2F` (approximated from wordmark)
- **Accent Purple/Magenta**: `#B94684` (from onion illustration)
- **Tagline Blue**: `#0066B3` (from tagline text)

## Technical Implementation

### Next.js Image Optimization

```tsx
import Image from "next/image";

// Header logo
<Image
  src="/images/logo/logo-simplified.png"
  alt="Goeduitje.nl"
  width={180}
  height={60}
  priority
/>

// Footer logo
<Image
  src="/images/logo/logo-full.png"
  alt="Goeduitje.nl - uitjes met een verhaal, om te janken zo goed"
  width={280}
  height={93}
/>
```

### Metadata Configuration

```typescript
export const metadata: Metadata = {
  title: "Goeduitje.nl - Workshops & Teambuildinguitjes in Nederland",
  description:
    "Ontdek unieke workshops en teambuildinguitjes met een verhaal. Van koken tot kunst, van Amsterdam tot Limburg.",
  openGraph: {
    images: ["/images/logo/og-image.png"],
    siteName: "Goeduitje.nl",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
```

## Action Items

- [ ] Generate favicon variants from logo-simplified.png
- [ ] Create og-image.png (1200x630) with logo on branded background
- [ ] Create twitter-image.png (1200x600)
- [ ] Update navigation component with logo
- [ ] Add footer component with full logo
- [ ] Configure Next.js metadata
- [ ] Test logo rendering on all viewports
- [ ] Ensure WCAG AA contrast compliance

## Brand Protection

- Never stretch or distort logos
- Maintain minimum clear space
- Don't place logo on busy backgrounds without overlay
- Don't change logo colors
- Don't separate onion from wordmark in simplified logo
- Maintain aspect ratio at all times

## File Naming Conventions

- `logo-full.png` - Complete logo with tagline
- `logo-simplified.png` - Onion + wordmark only
- `logo-icon.png` - Onion only (for favicons)
- `og-image.png` - Social sharing image
- `twitter-image.png` - Twitter card image

---

**Last Updated**: 2025-11-16
**Status**: In Implementation
