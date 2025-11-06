# Goeduitje.nl Rebuild - Complete Implementation Plan

> **Status**: Planning Phase
> **Timeline**: 6-8 weeks
> **Tech Stack**: Next.js 16 + React 19 + tRPC + Prisma + PostgreSQL + Tailwind CSS 4

---

## 🎯 PROJECT OVERVIEW

This document outlines the complete plan to rebuild https://www.goeduitje.nl using the existing Next.js 16 full-stack boilerplate.

### Objectives

- ✅ Preserve all existing content from goeduitje.nl
- ✅ Build on existing tech stack (Next.js 16, React 19, tRPC, Prisma, shadcn/ui)
- ✅ Achieve top-notch UX, SEO, GEO, and performance
- ✅ Create easily tweakable design system
- ✅ Provide comprehensive documentation

### Success Criteria

- **Performance**: Lighthouse scores 95+ (desktop), 90+ (mobile)
- **Core Web Vitals**: All "Good" ratings (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- **Accessibility**: WCAG 2.1 AA compliant (95+ score)
- **SEO**: 100 SEO score, rich snippets, local SEO optimized
- **Mobile**: Fully responsive, mobile-first design
- **Documentation**: Complete, living documentation for easy maintenance

---

## 📋 PHASE 1: CONTENT INVENTORY & RESEARCH (Week 1)

### 1.1 Website Content Mapping

**Objective**: Document all existing content from https://www.goeduitje.nl

**Tasks**:

- [ ] Visit and analyze all pages on goeduitje.nl
- [ ] Document page structure and hierarchy
- [ ] Inventory all text content, headings, and copy
- [ ] Catalog all images and videos (descriptions for placeholders)
- [ ] Map forms and interactive elements
- [ ] Document business information and services
- [ ] Note contact information, location, hours
- [ ] Identify booking/reservation systems
- [ ] Document pricing structure
- [ ] Collect reviews and testimonials
- [ ] Note social media links and integrations
- [ ] Check for blog/news sections

**Deliverables**:

- `docs/content/CONTENT-INVENTORY.md` - Complete content map
- `docs/content/PAGES.md` - Page-by-page structure
- `docs/content/MEDIA-LIST.md` - All images/videos catalogued

### 1.2 Business Analysis

**Tasks**:

- [ ] Understand goeduitje.nl's value proposition
- [ ] Identify primary and secondary target audiences
- [ ] Map customer journey and conversion points
- [ ] Analyze competitor websites
- [ ] Identify key differentiators
- [ ] Document brand voice and messaging

**Deliverables**:

- Business requirements document
- User personas
- User journey maps

### 1.3 Technical Requirements

**Tasks**:

- [ ] Identify required integrations (booking, payments, maps)
- [ ] Define database schema requirements
- [ ] Plan API endpoints needed
- [ ] List third-party services (Stripe, Resend, Cal.com, etc.)

**Deliverables**:

- Technical requirements document
- Integration architecture diagram

---

## 📐 PHASE 2: ARCHITECTURE & DESIGN SYSTEM (Week 1-2)

### 2.1 Component Architecture

**Existing Foundation** (Already Built):

```
src/components/ui/
- 24+ shadcn/ui components (Button, Card, Input, Form, etc.)
- Theme provider with dark mode
- Tailwind CSS 4 with design tokens
- React Hook Form + Zod validation
```

**New Components to Build**:

```
src/components/
├── layout/
│   ├── site-header.tsx           # Main navigation
│   ├── site-footer.tsx           # Footer with links
│   ├── mobile-nav.tsx            # Mobile menu
│   └── breadcrumbs.tsx           # Breadcrumb navigation
│
├── sections/
│   ├── hero/
│   │   ├── hero-default.tsx
│   │   ├── hero-split.tsx
│   │   └── hero-video.tsx
│   ├── features/
│   │   ├── feature-grid.tsx
│   │   └── feature-showcase.tsx
│   ├── testimonials/
│   │   ├── testimonial-carousel.tsx
│   │   └── testimonial-grid.tsx
│   ├── cta/
│   │   ├── cta-banner.tsx
│   │   └── cta-split.tsx
│   └── pricing/
│       └── pricing-comparison.tsx
│
├── forms/
│   ├── newsletter-form.tsx
│   ├── booking-form.tsx
│   └── search-form.tsx
│
├── media/
│   ├── image-optimized.tsx       # Next.js Image wrapper
│   ├── image-gallery.tsx         # Lightbox gallery
│   ├── video-player.tsx          # Video component
│   └── logo.tsx                  # Site logo
│
├── seo/
│   ├── meta-tags.tsx             # Dynamic meta tags
│   ├── structured-data.tsx       # JSON-LD schema
│   └── breadcrumb-schema.tsx     # Breadcrumb schema
│
└── blocks/
    ├── block-renderer.tsx        # Dynamic content blocks
    ├── text-block.tsx
    ├── image-block.tsx
    ├── video-block.tsx
    └── gallery-block.tsx
```

**Tasks**:

- [ ] Design component hierarchy
- [ ] Create component documentation
- [ ] Build reusable section components
- [ ] Implement content blocks system
- [ ] Create SEO component library

**Deliverables**:

- Component library with Storybook/documentation
- Component templates for easy customization

### 2.2 Design System Enhancement

**Current Foundation**:

- OKLCH color system with CSS variables
- Geist Sans and Geist Mono fonts
- Tailwind CSS 4 with design tokens
- Dark mode support

**Enhancements**:

```typescript
// lib/constants/theme-config.ts
export const themeConfig = {
  colors: {
    brand: {
      primary: "oklch(...)", // Goeduitje brand color
      secondary: "oklch(...)", // Secondary brand color
      accent: "oklch(...)", // Accent color
      success: "oklch(...)",
      warning: "oklch(...)",
      error: "oklch(...)",
    },
    semantic: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      muted: "var(--muted)",
      border: "var(--border)",
    },
  },

  typography: {
    fontFamily: {
      heading: "var(--font-geist-sans)",
      body: "var(--font-geist-sans)",
      mono: "var(--font-geist-mono)",
    },
    scale: {
      hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
      h1: "text-3xl sm:text-4xl md:text-5xl",
      h2: "text-2xl sm:text-3xl md:text-4xl",
      h3: "text-xl sm:text-2xl md:text-3xl",
      h4: "text-lg sm:text-xl",
      h5: "text-base sm:text-lg",
      body: "text-base",
      small: "text-sm",
    },
    weight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  spacing: {
    section: {
      xs: "py-8 md:py-12",
      sm: "py-12 md:py-16",
      md: "py-16 md:py-20",
      lg: "py-20 md:py-28",
      xl: "py-28 md:py-36",
    },
    container: {
      default: "container mx-auto px-4 sm:px-6 lg:px-8",
      narrow: "mx-auto max-w-3xl px-4 sm:px-6",
      wide: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
    },
    stack: {
      xs: "space-y-2",
      sm: "space-y-4",
      md: "space-y-6",
      lg: "space-y-8",
      xl: "space-y-12",
    },
  },

  borderRadius: {
    none: "0",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },

  animations: {
    fadeIn: "animate-in fade-in duration-500",
    slideUp: "animate-in slide-in-from-bottom-4 duration-500",
    scaleIn: "animate-in zoom-in-95 duration-200",
  },
};
```

```typescript
// lib/constants/site-config.ts
export const SITE_CONFIG = {
  name: "Goeduitje",
  description: "Your site description here",
  url: "https://goeduitje.nl",
  ogImage: "https://goeduitje.nl/og-image.jpg",

  company: {
    name: "Goeduitje",
    legalName: "Goeduitje B.V.",
    address: {
      street: "Street Address",
      city: "City",
      postalCode: "1234 AB",
      country: "Netherlands",
    },
    contact: {
      email: "info@goeduitje.nl",
      phone: "+31 XX XXX XXXX",
    },
  },

  social: {
    twitter: "https://twitter.com/goeduitje",
    facebook: "https://facebook.com/goeduitje",
    instagram: "https://instagram.com/goeduitje",
    linkedin: "https://linkedin.com/company/goeduitje",
  },

  features: {
    darkMode: true,
    newsletter: true,
    blog: true,
    booking: true,
    ecommerce: false,
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  },
};
```

**Tasks**:

- [ ] Define brand colors in OKLCH format
- [ ] Create typography scale system
- [ ] Define spacing tokens
- [ ] Set up animation system
- [ ] Document design system in Figma or similar

**Deliverables**:

- `docs/04-DESIGN-SYSTEM.md` - Complete design system documentation
- Theme configuration files
- Design tokens

---

## 🗂️ PHASE 3: SITE STRUCTURE & ROUTING (Week 2)

### 3.1 Route Architecture

```
app/
├── (public)/                      # Public-facing routes
│   ├── layout.tsx                # Header + Footer layout
│   ├── page.tsx                  # Homepage
│   ├── over-ons/
│   │   └── page.tsx              # About page
│   ├── activiteiten/
│   │   ├── page.tsx              # Activities listing
│   │   └── [slug]/page.tsx       # Activity detail
│   ├── prijzen/
│   │   └── page.tsx              # Pricing
│   ├── contact/
│   │   └── page.tsx              # Contact
│   ├── boeken/
│   │   └── page.tsx              # Booking
│   └── blog/
│       ├── page.tsx              # Blog index
│       ├── [slug]/page.tsx       # Blog post
│       └── categorie/
│           └── [slug]/page.tsx   # Category
│
├── (dashboard)/                   # User routes
│   ├── layout.tsx                # Dashboard layout
│   └── dashboard/
│       ├── page.tsx              # User dashboard
│       ├── mijn-boekingen/       # User bookings
│       └── instellingen/         # User settings
│
├── (admin)/                       # Admin routes (existing)
│   ├── layout.tsx                # Admin sidebar layout
│   └── admin/
│       ├── page.tsx              # Admin overview
│       ├── users/                # User management (existing)
│       ├── settings/             # Settings (existing)
│       ├── content/              # Content management
│       ├── activiteiten/         # Manage activities
│       ├── boekingen/            # Manage bookings
│       └── analytics/            # Analytics
│
├── api/                          # API routes (existing)
│   ├── trpc/[trpc]/route.ts     # tRPC endpoint
│   ├── checkout/route.ts         # Stripe checkout
│   ├── send-email/route.ts       # Email API
│   └── webhooks/
│       ├── stripe/route.ts       # Stripe webhooks
│       └── cal/route.ts          # Cal.com webhooks
│
├── layout.tsx                    # Root layout
├── loading.tsx                   # Global loading
├── error.tsx                     # Error handling
└── not-found.tsx                 # 404 page
```

**Tasks**:

- [ ] Create route structure
- [ ] Implement route groups for layouts
- [ ] Set up dynamic routes for content
- [ ] Create loading and error states
- [ ] Implement 404 and error pages

### 3.2 Database Schema

Extend existing Prisma schema:

```prisma
// prisma/schema.prisma

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  bookings  Booking[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  USER
  ADMIN
}

model Activity {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String
  longDescription String @db.Text
  price       Decimal  @db.Decimal(10, 2)
  duration    Int      // in minutes
  capacity    Int
  images      String[] // Array of image URLs
  category    String
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  bookings    Booking[]
  seo         Json?    // SEO metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([published])
}

model Booking {
  id          String   @id @default(cuid())
  activityId  String
  activity    Activity @relation(fields: [activityId], references: [id])
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])

  customerName  String
  customerEmail String
  customerPhone String?
  date         DateTime
  timeSlot     String
  participants Int
  status       BookingStatus @default(PENDING)
  totalPrice   Decimal  @db.Decimal(10, 2)
  notes        String?  @db.Text

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([activityId])
  @@index([userId])
  @@index([date])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  content   String   @db.Text
  rating    Int      // 1-5
  avatar    String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([published])
}

model Page {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  content   Json     // Flexible content blocks
  seo       Json?    // SEO metadata
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([published])
}

model BlogPost {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  excerpt     String
  content     String   @db.Text
  coverImage  String
  author      String
  category    String
  tags        String[]
  published   Boolean  @default(false)
  publishedAt DateTime?
  seo         Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([published])
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String   @db.Text
  status    String   @default("NEW")
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```

**Tasks**:

- [ ] Design complete database schema
- [ ] Create Prisma migrations
- [ ] Seed database with sample data
- [ ] Document data models

**Deliverables**:

- Updated Prisma schema
- Database migrations
- Seeding scripts
- `docs/content/DATA-MODELS.md`

---

## 🎨 PHASE 4: CORE PAGES DEVELOPMENT (Week 2-3)

### 4.1 Homepage

**Sections**:

1. **Hero Section**
   - Compelling headline
   - Subheadline with value proposition
   - Primary CTA (Book Now / Contact)
   - Hero image or video background

2. **Services/Activities Overview**
   - Featured activities grid
   - Quick overview with images
   - Links to individual activities

3. **Why Choose Us / USPs**
   - 3-4 key differentiators
   - Icons and short descriptions

4. **Social Proof**
   - Customer testimonials carousel
   - Star ratings
   - Number of satisfied customers

5. **Photo/Video Gallery**
   - Showcase experiences
   - Lightbox gallery

6. **Location & Contact**
   - Map integration
   - Contact information
   - Opening hours

7. **Final CTA**
   - Call to action
   - Booking button

**Tasks**:

- [ ] Design homepage layout
- [ ] Implement all sections
- [ ] Add animations and interactions
- [ ] Optimize images
- [ ] Implement structured data

**Technical Implementation**:

```typescript
// app/(public)/page.tsx
export default async function HomePage() {
  // Fetch featured activities
  const activities = await db.activity.findMany({
    where: { published: true, featured: true },
    take: 6
  });

  // Fetch testimonials
  const testimonials = await db.testimonial.findMany({
    where: { published: true },
    take: 10
  });

  return (
    <>
      <HeroSection />
      <FeaturedActivities activities={activities} />
      <WhyChooseUs />
      <TestimonialCarousel testimonials={testimonials} />
      <PhotoGallery />
      <LocationContact />
      <CTASection />
    </>
  );
}

// Add metadata
export const metadata: Metadata = {
  title: 'Goeduitje - Your tagline here',
  description: 'Your description here',
  // ... more SEO metadata
};
```

### 4.2 Activities/Services Pages

**Activities Listing Page**:

- Grid view of all activities
- Filtering by category
- Search functionality
- Sort options (price, popularity, name)

**Individual Activity Page**:

- Hero image gallery
- Title and description
- Pricing information
- Duration and capacity
- Booking widget
- Related activities
- Reviews

**Tasks**:

- [ ] Create activity listing page
- [ ] Build activity detail template
- [ ] Implement filtering and search
- [ ] Add booking integration
- [ ] Create activity schema markup

### 4.3 About Page

**Sections**:

- Company story
- Mission and values
- Team members
- Certifications/awards
- History timeline

**Tasks**:

- [ ] Design about page layout
- [ ] Create team member components
- [ ] Add company information
- [ ] Implement Organization schema

### 4.4 Pricing Page

**Enhancement of existing pricing components**:

- Clear pricing tiers/packages
- Feature comparison table
- FAQ section
- CTAs to book

**Tasks**:

- [ ] Adapt existing pricing-card.tsx
- [ ] Create comparison table
- [ ] Add pricing FAQ
- [ ] Implement Offer schema

### 4.5 Contact Page

**Enhancement of existing contact form**:

- Contact form with validation
- Contact information
- Map with location
- Social media links
- Opening hours

**Tasks**:

- [ ] Enhance contact-form.tsx
- [ ] Add Google Maps integration
- [ ] Display contact information
- [ ] Implement form submission to Resend

### 4.6 Booking Page

**Enhancement of existing Cal.com integration**:

- Activity selection
- Date and time picker
- Customer information form
- Booking confirmation
- Email notifications

**Tasks**:

- [ ] Create booking flow
- [ ] Integrate with Cal.com or custom solution
- [ ] Add booking confirmation emails
- [ ] Create booking schema markup

### 4.7 Blog (Optional)

**If blog exists on goeduitje.nl**:

- Blog listing page with pagination
- Individual blog post template
- Categories and tags
- Search functionality

**Tasks**:

- [ ] Create blog templates
- [ ] Implement blog CMS in admin
- [ ] Add RSS feed
- [ ] Implement Article schema

---

## 🚀 PHASE 5: SEO & GEO OPTIMIZATION (Week 3-4)

### 5.1 Technical SEO Implementation

**Meta Tags System**:

```typescript
// lib/seo/generate-metadata.ts
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants/site-config";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  url = SITE_CONFIG.url,
  type = "website",
  publishedTime,
  author,
  keywords = [],
}: GenerateMetadataProps): Metadata {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author }] : undefined,

    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
      siteName: SITE_CONFIG.name,
      locale: "nl_NL",
      ...(publishedTime && { publishedTime }),
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@goeduitje",
    },

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
```

**Structured Data (JSON-LD)**:

```typescript
// components/seo/structured-data.tsx
import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${data['@type']}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          ...data,
        }),
      }}
    />
  );
}

// lib/seo/schemas.ts
export function generateLocalBusinessSchema() {
  return {
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    image: SITE_CONFIG.ogImage,
    '@id': SITE_CONFIG.url,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.company.contact.phone,
    email: SITE_CONFIG.company.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.company.address.street,
      addressLocality: SITE_CONFIG.company.address.city,
      postalCode: SITE_CONFIG.company.address.postalCode,
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.3676, // Replace with actual coordinates
      longitude: 4.9041,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    priceRange: '€€',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
    sameAs: Object.values(SITE_CONFIG.social),
  };
}

export function generateServiceSchema(activity: Activity) {
  return {
    '@type': 'Service',
    name: activity.title,
    description: activity.description,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    areaServed: {
      '@type': 'City',
      name: SITE_CONFIG.company.address.city,
    },
    offers: {
      '@type': 'Offer',
      price: activity.price.toString(),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

**XML Sitemap**:

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { db } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://goeduitje.nl";

  // Static pages
  const staticPages = ["", "/over-ons", "/prijzen", "/contact", "/boeken"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Dynamic activity pages
  const activities = await db.activity.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const activityPages = activities.map((activity) => ({
    url: `${baseUrl}/activiteiten/${activity.slug}`,
    lastModified: activity.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Blog posts
  const posts = await db.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...activityPages, ...blogPages];
}
```

**robots.txt**:

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/dashboard/"],
    },
    sitemap: "https://goeduitje.nl/sitemap.xml",
  };
}
```

**Tasks**:

- [ ] Implement meta tags system
- [ ] Add structured data to all pages
- [ ] Generate XML sitemap
- [ ] Configure robots.txt
- [ ] Add canonical URLs
- [ ] Implement hreflang if multilingual

### 5.2 GEO/Local SEO Optimization

**Location Targeting**:

```typescript
// components/sections/location-contact.tsx
export function LocationContact() {
  return (
    <section>
      {/* Structured data */}
      <StructuredData data={generateLocalBusinessSchema()} />

      {/* NAP (Name, Address, Phone) */}
      <div>
        <h2>{SITE_CONFIG.name}</h2>
        <address>
          {SITE_CONFIG.company.address.street}<br />
          {SITE_CONFIG.company.address.postalCode} {SITE_CONFIG.company.address.city}
        </address>
        <a href={`tel:${SITE_CONFIG.company.contact.phone}`}>
          {SITE_CONFIG.company.contact.phone}
        </a>
      </div>

      {/* Google Maps */}
      <iframe
        src="https://www.google.com/maps/embed?pb=..."
        width="100%"
        height="400"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
```

**Geographic Metadata**:

```typescript
// In layout.tsx or page metadata
export const metadata: Metadata = {
  // ... other metadata
  other: {
    "geo.region": "NL-NH",
    "geo.placename": "Amsterdam",
    "geo.position": "52.3676;4.9041",
    ICBM: "52.3676, 4.9041",
  },
};
```

**Tasks**:

- [ ] Add LocalBusiness schema
- [ ] Ensure NAP consistency
- [ ] Integrate Google Maps
- [ ] Add geographic metadata
- [ ] Create location pages if multiple locations

### 5.3 Performance Optimization

**Image Optimization**:

```typescript
// components/media/image-optimized.tsx
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
}

export function ImageOptimized({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
}: ImageOptimizedProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      className={cn('object-cover transition-transform duration-300', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshGxsdIR0hHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA="
    />
  );
}
```

**Code Splitting**:

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const ChartComponent = dynamic(() => import('@/components/chart-area-interactive'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const BookingModal = dynamic(() => import('@/components/booking-modal'), {
  loading: () => <LoadingSpinner />,
});
```

**next.config.ts Enhancement**:

```typescript
import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Compression
  compress: true,

  // Font optimization
  optimizeFonts: true,

  // Bundle analysis
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "recharts"],
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Performance Targets**:

- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **INP (Interaction to Next Paint)**: < 200 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Lighthouse Performance**: 95+ (desktop), 90+ (mobile)

**Tasks**:

- [ ] Optimize all images (WebP/AVIF)
- [ ] Implement lazy loading
- [ ] Add LQIP placeholders
- [ ] Set up code splitting
- [ ] Configure caching headers
- [ ] Minimize bundle size
- [ ] Set up Lighthouse CI

---

## ♿ PHASE 6: UX & ACCESSIBILITY (Week 4)

### 6.1 UX Best Practices

**Mobile-First Design**:

- Touch-friendly tap targets (min 48x48px)
- Sticky mobile navigation
- Swipeable carousels
- Optimized mobile forms

**Navigation & Information Architecture**:

```typescript
// lib/constants/navigation.ts
export const MAIN_NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Activiteiten", href: "/activiteiten" },
  { label: "Prijzen", href: "/prijzen" },
  { label: "Over Ons", href: "/over-ons" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAVIGATION = [
  {
    title: "Bedrijf",
    links: [
      { label: "Over Ons", href: "/over-ons" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Activiteiten",
    links: [
      { label: "Alle Activiteiten", href: "/activiteiten" },
      { label: "Voor Groepen", href: "/activiteiten?filter=groepen" },
      { label: "Voor Families", href: "/activiteiten?filter=families" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Boeken", href: "/boeken" },
      { label: "Veelgestelde Vragen", href: "/faq" },
      { label: "Klantenservice", href: "/contact" },
    ],
  },
  {
    title: "Juridisch",
    links: [
      { label: "Privacybeleid", href: "/privacy" },
      { label: "Algemene Voorwaarden", href: "/voorwaarden" },
      { label: "Cookiebeleid", href: "/cookies" },
    ],
  },
];
```

**Conversion Optimization**:

- Clear CTAs above the fold
- Multiple booking touchpoints
- Trust indicators (reviews, certifications)
- Simplified booking flow
- Social proof throughout
- Exit-intent popups (optional)

**Loading States**:

```typescript
// components/common/loading-skeleton.tsx
export function ActivityCardSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
```

**Error Handling**:

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Er is iets misgegaan!</h2>
      <p className="mb-4 text-muted-foreground">
        We hebben een fout gedetecteerd. Probeer het opnieuw.
      </p>
      <Button onClick={() => reset()}>Probeer opnieuw</Button>
    </div>
  );
}
```

**Tasks**:

- [ ] Implement mobile-first design
- [ ] Create intuitive navigation
- [ ] Optimize conversion funnel
- [ ] Add loading states everywhere
- [ ] Implement error boundaries
- [ ] Add micro-interactions
- [ ] Create 404 page

### 6.2 Accessibility (WCAG 2.1 AA)

**Implementation Checklist**:

```typescript
// Semantic HTML example
<nav aria-label="Main navigation">
  <ul>
    {MAIN_NAVIGATION.map((item) => (
      <li key={item.href}>
        <Link href={item.href}>{item.label}</Link>
      </li>
    ))}
  </ul>
</nav>

// Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>

// Form accessibility
<Label htmlFor="email">Email *</Label>
<Input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <p id="email-error" className="text-destructive text-sm" role="alert">
    {errors.email.message}
  </p>
)}
```

**Accessibility Features**:

- ✅ Semantic HTML5 elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast (4.5:1 for text, 3:1 for UI)
- ✅ Screen reader compatibility
- ✅ Alt text for images
- ✅ Form labels and associations
- ✅ Skip navigation links
- ✅ Responsive text sizing (no fixed px for text)

**Tasks**:

- [ ] Audit with axe DevTools
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Ensure color contrast
- [ ] Add ARIA labels where needed
- [ ] Test with accessibility tools

---

## 📚 PHASE 7: DOCUMENTATION (Week 4-5)

### 7.1 Documentation Files to Create

See `docs/00-README.md` for complete documentation structure.

**Tasks**:

- [ ] Create all documentation files
- [ ] Document component usage
- [ ] Write API documentation
- [ ] Create development guides
- [ ] Write deployment procedures
- [ ] Document SEO implementation

---

## 🔧 PHASE 8: ADMIN & CMS FEATURES (Week 5)

### 8.1 Content Management

Extend existing admin dashboard:

**Pages to Add**:

- `/admin/content` - Manage pages
- `/admin/activiteiten` - Manage activities/services
- `/admin/boekingen` - View and manage bookings
- `/admin/testimonials` - Moderate reviews
- `/admin/media` - Image library
- `/admin/blog` - Blog post management

**Features**:

- Rich text editor (TipTap or similar)
- Image upload with preview
- SEO metadata fields
- Preview before publish
- Draft/published workflow
- Bulk actions

**Tasks**:

- [ ] Create content management pages
- [ ] Implement rich text editor
- [ ] Add image upload
- [ ] Create media library
- [ ] Implement preview functionality

### 8.2 Analytics Dashboard

**Metrics to Track**:

- Page views and sessions
- Traffic sources
- Popular activities
- Booking conversions
- Form submissions
- User behavior flow

**Tasks**:

- [ ] Integrate Google Analytics 4
- [ ] Create analytics dashboard
- [ ] Add conversion tracking
- [ ] Set up goal tracking

---

## 🧪 PHASE 9: TESTING & QA (Week 5-6)

### 9.1 Testing Strategy

**Unit Tests (Vitest)**:

```bash
npm run test
```

**E2E Tests (Playwright)**:

```typescript
// tests/booking-flow.spec.ts
import { test, expect } from "@playwright/test";

test("complete booking flow", async ({ page }) => {
  // Navigate to homepage
  await page.goto("/");

  // Click on an activity
  await page.click("text=View Activities");
  await page.click(".activity-card:first-child");

  // Click book now
  await page.click("text=Book Now");

  // Fill in booking form
  await page.fill("#name", "John Doe");
  await page.fill("#email", "john@example.com");
  await page.fill("#phone", "+31612345678");

  // Select date and time
  await page.click("#date");
  await page.click("text=Tomorrow");
  await page.click("text=10:00");

  // Submit
  await page.click("text=Confirm Booking");

  // Verify confirmation
  await expect(page.locator("text=Booking Confirmed")).toBeVisible();
});
```

**Performance Testing**:

```bash
# Lighthouse CI
npm install --save-dev @lhci/cli

# Run Lighthouse
lhci autorun
```

**Tasks**:

- [ ] Write unit tests for components
- [ ] Write E2E tests for critical flows
- [ ] Set up Lighthouse CI
- [ ] Run accessibility audits
- [ ] Test on multiple devices
- [ ] Cross-browser testing

### 9.2 QA Checklist

**Functionality**:

- [ ] All pages load correctly
- [ ] Forms validate and submit
- [ ] Booking system works end-to-end
- [ ] Admin dashboard functional
- [ ] Email notifications sent
- [ ] Payment processing works (if applicable)

**Responsive Design**:

- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px+)
- [ ] Large screens (1920px+)

**Cross-Browser**:

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

**Performance**:

- [ ] Lighthouse Performance: 95+ (desktop)
- [ ] Lighthouse Performance: 90+ (mobile)
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] No console errors
- [ ] Images optimized

**SEO**:

- [ ] Meta tags on all pages
- [ ] Structured data implemented
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Canonical URLs set
- [ ] Alt text on images
- [ ] Lighthouse SEO: 100

**Accessibility**:

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Forms properly labeled
- [ ] Lighthouse Accessibility: 95+

---

## 🚀 PHASE 10: DEPLOYMENT & MONITORING (Week 6)

### 10.1 Deployment Setup

**Platform**: Vercel (recommended)

**Environment Variables**:

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="https://goeduitje.nl"
NODE_ENV="production"

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@goeduitje.nl"

# Stripe (if payments needed)
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cal.com (booking)
CAL_COM_API_KEY="..."

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

**Database Setup**:

```bash
# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

**Deployment Steps**:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Set up custom domain
5. Configure DNS
6. Enable automatic deployments
7. Set up preview deployments

**Tasks**:

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Test production deployment

### 10.2 Monitoring & Analytics

**Performance Monitoring**:

- Vercel Analytics (built-in)
- Google Analytics 4
- Core Web Vitals tracking
- Error tracking (Sentry)

**SEO Monitoring**:

- Google Search Console
- Google Business Profile
- Bing Webmaster Tools

**Uptime Monitoring**:

- Vercel status
- Custom health checks
- Ping monitoring

**Tasks**:

- [ ] Set up Google Analytics 4
- [ ] Configure Google Search Console
- [ ] Set up error tracking
- [ ] Create monitoring dashboard
- [ ] Set up alerts

### 10.3 Post-Launch Checklist

**Week 1 After Launch**:

- [ ] Monitor error logs
- [ ] Check analytics setup
- [ ] Verify all forms working
- [ ] Test booking flow
- [ ] Check email delivery
- [ ] Monitor performance metrics
- [ ] Review user feedback

**Week 2-4 After Launch**:

- [ ] Analyze user behavior
- [ ] Optimize based on data
- [ ] Fix any reported issues
- [ ] Improve conversion funnel
- [ ] A/B test key pages
- [ ] Gather customer feedback

---

## 📊 SUCCESS METRICS

### Technical Metrics

**Performance**:

- ✅ Lighthouse Performance: 95+ (desktop), 90+ (mobile)
- ✅ LCP: < 2.5 seconds
- ✅ INP: < 200 milliseconds
- ✅ CLS: < 0.1
- ✅ Initial page load: < 3 seconds

**SEO**:

- ✅ Lighthouse SEO: 100
- ✅ All pages indexed
- ✅ Rich snippets showing
- ✅ Local pack visibility

**Accessibility**:

- ✅ Lighthouse Accessibility: 95+
- ✅ WCAG 2.1 AA compliant
- ✅ Zero critical accessibility issues

**Quality**:

- ✅ Zero console errors
- ✅ Zero broken links
- ✅ All images have alt text
- ✅ All forms working

### Business Metrics

**Traffic**:

- Increase organic search traffic by 50%
- Improve bounce rate by 20%
- Increase pages per session

**Conversions**:

- Increase booking conversions by 30%
- Improve contact form submissions
- Reduce booking abandonment rate

**Engagement**:

- Increase average session duration
- Improve mobile engagement
- Increase return visitor rate

---

## 🎯 KEY DELIVERABLES

1. ✅ **Fully Rebuilt Website** - All goeduitje.nl content migrated
2. ✅ **Placeholder System** - Images and videos with placeholders
3. ✅ **SEO Optimized** - Meta tags, structured data, sitemap
4. ✅ **Performance Optimized** - 95+ Lighthouse scores
5. ✅ **Mobile Responsive** - Mobile-first design
6. ✅ **Accessible** - WCAG 2.1 AA compliant
7. ✅ **Design System** - Easy-to-tweak configuration files
8. ✅ **Documentation** - Comprehensive guides in `/docs`
9. ✅ **Admin CMS** - Content management system
10. ✅ **Production Deployment** - Live on goeduitje.nl with monitoring

---

## 📝 NEXT STEPS

### Immediate Actions Required

1. **Content Inventory**:
   - Grant WebFetch permissions to analyze goeduitje.nl, OR
   - Provide manual content outline of all pages/sections

2. **Brand Assets**:
   - Logo files (SVG preferred)
   - Brand colors (hex/RGB codes)
   - Brand guidelines (if available)

3. **Business Details**:
   - Services/activities offered by goeduitje.nl
   - Target audience and geographic area
   - Key differentiators and USPs
   - Contact information and location
   - Opening hours
   - Pricing structure

4. **Access & Credentials**:
   - Domain registrar access (for DNS)
   - Hosting/Vercel access
   - Database credentials
   - Email service access
   - Google Analytics/Search Console access

### Ready to Start?

Once the content inventory and brand assets are provided, we can begin Phase 1 and work through this comprehensive plan to deliver a world-class website in 6-8 weeks.

---

## 📧 CONTACT & SUPPORT

For questions about this implementation plan:

- Review documentation in `/docs`
- Check `TROUBLESHOOTING.md` for common issues
- Refer to `CONTRIBUTING.md` for development guidelines

---

**Last Updated**: November 6, 2025
**Version**: 1.0
**Status**: Planning Phase
