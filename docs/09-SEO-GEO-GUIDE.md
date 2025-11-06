# SEO & GEO Guide

> **Search engine optimization and local SEO strategies for Goeduitje.nl**

---

## 🎯 SEO Overview

### Goals

- Rank for activity-related keywords in Netherlands
- Appear in local search results
- Drive organic traffic
- Improve click-through rates
- Generate quality leads/bookings

### Target Keywords

- Primary: "[activity type] Nederland", "uitjes Nederland"
- Local: "[activity] Amsterdam", "[activity] Rotterdam"
- Long-tail: "leuke uitjes voor gezinnen", "bedrijfsuitje ideeën"

---

## 🔍 Technical SEO

### Meta Tags Implementation

Every page must have:

```typescript
// app/(public)/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goeduitje - Leuke Uitjes en Activiteiten in Nederland",
  description:
    "Ontdek de leukste uitjes en activiteiten. Boek eenvoudig online. Perfect voor gezinnen, groepen en bedrijven.",
  keywords: ["uitjes", "activiteiten", "nederland", "boeken"],

  openGraph: {
    title: "Goeduitje - Leuke Uitjes en Activiteiten",
    description: "Ontdek de leukste uitjes...",
    url: "https://goeduitje.nl",
    siteName: "Goeduitje",
    images: [
      {
        url: "https://goeduitje.nl/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "nl_NL",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Goeduitje - Leuke Uitjes",
    description: "Ontdek de leukste uitjes...",
    images: ["https://goeduitje.nl/twitter-image.jpg"],
  },

  alternates: {
    canonical: "https://goeduitje.nl",
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
```

### Structured Data (JSON-LD)

#### LocalBusiness Schema

```typescript
// components/seo/structured-data.tsx
export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Goeduitje',
          image: 'https://goeduitje.nl/logo.png',
          '@id': 'https://goeduitje.nl',
          url: 'https://goeduitje.nl',
          telephone: '+31-XX-XXX-XXXX',
          email: 'info@goeduitje.nl',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Straatnaam 123',
            addressLocality: 'Amsterdam',
            postalCode: '1012 AB',
            addressCountry: 'NL',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 52.3676,
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
          sameAs: [
            'https://www.facebook.com/goeduitje',
            'https://www.instagram.com/goeduitje',
            'https://twitter.com/goeduitje',
          ],
        }),
      }}
    />
  )
}
```

#### Service/Product Schema

```typescript
export function ServiceSchema({ activity }: { activity: Activity }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: activity.title,
          description: activity.description,
          provider: {
            '@type': 'Organization',
            name: 'Goeduitje',
          },
          areaServed: {
            '@type': 'City',
            name: 'Amsterdam',
          },
          offers: {
            '@type': 'Offer',
            price: activity.price.toString(),
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
        }),
      }}
    />
  )
}
```

#### Breadcrumb Schema

```typescript
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        }),
      }}
    />
  )
}
```

### XML Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { db } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://goeduitje.nl";

  // Static pages
  const staticPages = [
    "",
    "/activiteiten",
    "/prijzen",
    "/over-ons",
    "/contact",
    "/boeken",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

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

  return [...staticPages, ...activityPages];
}
```

### robots.txt

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

---

## 📍 Local SEO (GEO)

### Google Business Profile

1. **Claim/Create Profile**: [business.google.com](https://business.google.com)
2. **Complete Profile**:
   - Business name
   - Category (e.g., "Activity Center")
   - Address and service area
   - Phone number
   - Website
   - Hours
   - Photos (10+)
   - Description

3. **Regular Updates**:
   - Post weekly updates
   - Respond to reviews
   - Add new photos monthly
   - Update hours for holidays

### NAP Consistency

Ensure Name, Address, Phone are identical across:

- Website
- Google Business Profile
- Social media
- Online directories
- Citations

### Local Citations

List business on:

- Google Business Profile
- Bing Places
- Yelp
- TripAdvisor
- Facebook
- LinkedIn
- Local directories

### Local Keywords

Target location-specific keywords:

- "uitjes Amsterdam"
- "activiteiten Rotterdam"
- "bedrijfsuitje Utrecht"

### Location Pages

Create pages for each service area (if applicable):

```
/locaties/amsterdam
/locaties/rotterdam
/locaties/utrecht
```

---

## 📊 On-Page SEO

### Page Structure

```html
<!-- Single H1 per page -->
<h1>Leuke Uitjes en Activiteiten in Nederland</h1>

<!-- Hierarchical headings -->
<h2>Populaire Activiteiten</h2>
<h3>Voor Gezinnen</h3>
<h3>Voor Bedrijven</h3>

<h2>Waarom Goeduitje?</h2>
```

### Content Optimization

- **Word count**: 500+ words per page
- **Keyword density**: 1-2% (natural)
- **Internal links**: 3-5 per page
- **External links**: 1-2 to authority sites
- **Alt text**: Descriptive for all images
- **CTA**: Clear call-to-action on every page

### URL Structure

```
Good:
https://goeduitje.nl/activiteiten/paintball-amsterdam
https://goeduitje.nl/blog/leuke-uitjes-kinderen

Avoid:
https://goeduitje.nl/activity?id=123
https://goeduitje.nl/p/post1
```

### Image Optimization

- **File names**: `paintball-amsterdam-outdoor.jpg` (not `IMG_1234.jpg`)
- **Alt text**: "Groep vrienden speelt paintball in Amsterdam"
- **Format**: WebP primary, JPEG fallback
- **Size**: < 100KB per image
- **Responsive**: Use srcset

---

## 🚀 Performance SEO

### Core Web Vitals

Target metrics:

- **LCP**: < 2.5 seconds
- **INP**: < 200 milliseconds
- **CLS**: < 0.1

### Page Speed Optimization

- Minimize JavaScript
- Code splitting
- Image lazy loading
- Font optimization
- CDN usage

---

## 📱 Mobile SEO

- Responsive design (mobile-first)
- Touch-friendly elements (48x48px min)
- Fast mobile load time (< 3s)
- No intrusive interstitials
- Mobile-friendly forms

---

## 🔗 Link Building

### Internal Linking

- Link from high-authority pages to new pages
- Use descriptive anchor text
- Create content clusters

### External Links

**Strategies**:

- Guest blogging
- Local partnerships
- Business directories
- PR and media coverage
- Social media engagement

---

## 📈 SEO Monitoring

### Tools to Use

1. **Google Search Console**
   - Monitor indexing
   - Check search performance
   - Fix issues

2. **Google Analytics 4**
   - Traffic sources
   - User behavior
   - Conversions

3. **Lighthouse**
   - Performance scores
   - SEO audit
   - Accessibility

4. **Ahrefs/SEMrush** (optional)
   - Keyword rankings
   - Backlinks
   - Competitor analysis

### Monthly SEO Tasks

- [ ] Review Google Search Console
- [ ] Check keyword rankings
- [ ] Analyze traffic trends
- [ ] Update old content
- [ ] Build new backlinks
- [ ] Respond to reviews
- [ ] Update Google Business Profile

---

## ✅ SEO Checklist

### Before Launch

- [ ] All pages have unique meta titles
- [ ] All pages have meta descriptions
- [ ] Structured data on all pages
- [ ] XML sitemap generated
- [ ] robots.txt configured
- [ ] All images have alt text
- [ ] Internal linking structure
- [ ] Mobile-friendly
- [ ] Fast page speed
- [ ] HTTPS enabled

### Post-Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain ownership
- [ ] Set up Google Analytics
- [ ] Create/claim Google Business Profile
- [ ] Monitor Core Web Vitals
- [ ] Track keyword rankings

---

## 📚 Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Google Business Profile Help](https://support.google.com/business/)

See also:

- [Meta Tags Implementation](./seo/META-TAGS.md)
- [Structured Data Guide](./seo/STRUCTURED-DATA.md)
- [GEO Targeting Strategy](./seo/GEO-TARGETING.md)

---

**Last Updated**: November 6, 2025
