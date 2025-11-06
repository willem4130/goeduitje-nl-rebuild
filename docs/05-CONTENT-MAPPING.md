# Content Mapping

> **Site structure and content organization for Goeduitje.nl**

---

## 🗺️ Site Structure

### Primary Navigation

```
Home (/)
├── Activiteiten (/activiteiten)
│   └── [Activity Detail] (/activiteiten/[slug])
├── Prijzen (/prijzen)
├── Over Ons (/over-ons)
└── Contact (/contact)
```

### Secondary Pages

```
Boeken (/boeken)
Blog (/blog)
├── [Blog Post] (/blog/[slug])
└── [Category] (/blog/categorie/[slug])
Privacy Policy (/privacy)
Terms & Conditions (/voorwaarden)
Cookies (/cookies)
FAQ (/faq)
```

### Admin Pages

```
Admin Dashboard (/admin)
├── Users (/admin/users)
├── Settings (/admin/settings)
├── Content (/admin/content)
├── Activities (/admin/activiteiten)
├── Bookings (/admin/boekingen)
└── Analytics (/admin/analytics)
```

---

## 📄 Page Templates

### Homepage

**Sections**:

1. Hero Section
2. Featured Activities
3. Why Choose Us
4. Testimonials
5. Photo Gallery
6. Location & Contact
7. CTA Section

**Content Needed**:

- Hero headline and subheadline
- Hero image/video
- Featured activities (6)
- USPs (3-4 points)
- Testimonials (8-10)
- Gallery images (12-20)
- Contact information
- Opening hours

### Activity Listing Page

**Sections**:

1. Page Header
2. Filter/Search Bar
3. Activity Grid
4. Pagination

**Content Needed**:

- Page title and description
- Filter categories
- All activities with:
  - Title
  - Short description
  - Price
  - Duration
  - Thumbnail image

### Activity Detail Page

**Sections**:

1. Hero with Image Gallery
2. Activity Information
3. Booking Widget
4. Reviews/Testimonials
5. Related Activities

**Content Needed**:

- Activity title
- Full description
- Multiple images
- Price and duration
- Capacity
- What's included
- Requirements
- Location
- Customer reviews

### About Page

**Sections**:

1. Company Story
2. Mission & Values
3. Team Members
4. Certifications/Awards

**Content Needed**:

- Company history
- Mission statement
- Values (3-5)
- Team member bios and photos
- Certifications/awards

### Contact Page

**Sections**:

1. Contact Form
2. Contact Information
3. Map
4. Social Media Links

**Content Needed**:

- Office address
- Phone number
- Email address
- Opening hours
- Social media URLs
- Map coordinates

---

## 📝 Content Types

### Activity

```typescript
interface Activity {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  price: number
  duration: number (minutes)
  capacity: number
  images: string[]
  category: string
  featured: boolean
  published: boolean
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}
```

### Blog Post

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: Date;
  seo: SEOMetadata;
}
```

### Testimonial

```typescript
interface Testimonial {
  id: string
  name: string
  content: string
  rating: number (1-5)
  avatar?: string
  published: boolean
}
```

---

## 🎨 Content Blocks System

### Block Types

For flexible content management, implement a block-based system:

```typescript
type ContentBlock =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | GalleryBlock
  | QuoteBlock
  | EmbedBlock;

interface TextBlock {
  type: "text";
  content: string; // Rich text HTML
  alignment?: "left" | "center" | "right";
}

interface ImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface VideoBlock {
  type: "video";
  url: string;
  caption?: string;
}

interface GalleryBlock {
  type: "gallery";
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}
```

---

## 📋 Content Inventory Checklist

### To Be Collected from goeduitje.nl

- [ ] Homepage content
  - [ ] Hero text
  - [ ] Featured activities
  - [ ] USPs
  - [ ] Testimonials
  - [ ] Gallery images
- [ ] All activities/services
  - [ ] Titles and descriptions
  - [ ] Images
  - [ ] Pricing
  - [ ] Details
- [ ] About page content
- [ ] Contact information
- [ ] Legal pages (privacy, terms, cookies)
- [ ] Blog posts (if applicable)
- [ ] Media assets
  - [ ] Logo files
  - [ ] Photos
  - [ ] Videos
- [ ] Brand guidelines
  - [ ] Colors
  - [ ] Fonts
  - [ ] Voice & tone

---

## 🔍 SEO Content Requirements

### Per Page SEO

Every page needs:

- Meta title (50-60 characters)
- Meta description (150-160 characters)
- H1 heading (unique per page)
- Structured data (JSON-LD)
- Alt text for all images
- Internal links

### Homepage SEO

```typescript
metaTitle: "Goeduitje - [Tagline]";
metaDescription: "[Brief description of services and value proposition]";
keywords: ["activities", "experiences", "netherlands", "booking"];
structuredData: LocalBusinessSchema;
```

### Activity Page SEO

```typescript
metaTitle: "[Activity Name] - Goeduitje";
metaDescription: "[Activity description with key benefits]";
keywords: ["activity type", "location", "related keywords"];
structuredData: ServiceSchema + BreadcrumbSchema;
```

---

## 📦 Content Migration Plan

### Phase 1: Inventory

1. Document all existing content
2. Categorize by content type
3. Identify gaps and outdated content

### Phase 2: Preparation

1. Rewrite/update content as needed
2. Optimize for SEO
3. Prepare images (resize, optimize)
4. Create placeholders where needed

### Phase 3: Migration

1. Input content into CMS
2. Add metadata
3. Test on staging
4. Review and approve

---

## 📚 Content Guidelines

### Voice & Tone

**Voice**: Friendly, professional, helpful
**Tone**:

- Welcoming on homepage
- Informative on activity pages
- Supportive on contact/booking pages

### Writing Style

- Short paragraphs (2-3 sentences)
- Bullet points for scanability
- Active voice
- Clear, simple language
- Include calls-to-action

### Image Guidelines

- Minimum resolution: 1920x1080 for hero images
- Aspect ratio: 16:9 for featured images
- File format: JPG for photos, PNG for graphics
- File size: < 500KB (will be optimized)
- Alt text: Descriptive and keyword-rich

---

**Last Updated**: November 6, 2025

**Note**: Content inventory from goeduitje.nl needs to be completed. See `docs/content/CONTENT-INVENTORY.md` (to be created) for detailed content mapping.
