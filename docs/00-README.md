# Goeduitje.nl - Documentation Hub

> **Welcome to the Goeduitje.nl rebuild project documentation**
> This documentation provides everything you need to understand, develop, and maintain the Goeduitje.nl website.

---

## 📚 Quick Navigation

### Getting Started

- **New to the project?** Start with [01-PROJECT-OVERVIEW.md](./01-PROJECT-OVERVIEW.md)
- **Need to set up locally?** See [07-DEVELOPMENT-GUIDE.md](./07-DEVELOPMENT-GUIDE.md)
- **Deploying to production?** Check [08-DEPLOYMENT-GUIDE.md](./08-DEPLOYMENT-GUIDE.md)

### For Developers

- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) - System architecture and tech stack
- [03-COMPONENTS-GUIDE.md](./03-COMPONENTS-GUIDE.md) - Component library reference
- [06-API-REFERENCE.md](./06-API-REFERENCE.md) - tRPC API documentation
- [07-DEVELOPMENT-GUIDE.md](./07-DEVELOPMENT-GUIDE.md) - Development workflows

### For Designers

- [04-DESIGN-SYSTEM.md](./04-DESIGN-SYSTEM.md) - Colors, typography, spacing
- [05-CONTENT-MAPPING.md](./05-CONTENT-MAPPING.md) - Site structure and pages

### For Marketers

- [09-SEO-GEO-GUIDE.md](./09-SEO-GEO-GUIDE.md) - SEO and local search optimization
- [05-CONTENT-MAPPING.md](./05-CONTENT-MAPPING.md) - Content structure

---

## 📖 Main Documentation

### [01. Project Overview](./01-PROJECT-OVERVIEW.md)

What this project is, who it's for, and what it does.

### [02. Architecture](./02-ARCHITECTURE.md)

Technical architecture, tech stack decisions, and system design.

### [03. Components Guide](./03-COMPONENTS-GUIDE.md)

Complete component library reference with usage examples.

### [04. Design System](./04-DESIGN-SYSTEM.md)

Colors, typography, spacing, and design tokens.

### [05. Content Mapping](./05-CONTENT-MAPPING.md)

Site structure, pages, and content organization.

### [06. API Reference](./06-API-REFERENCE.md)

tRPC procedures, endpoints, and data schemas.

### [07. Development Guide](./07-DEVELOPMENT-GUIDE.md)

Local setup, development workflows, and best practices.

### [08. Deployment Guide](./08-DEPLOYMENT-GUIDE.md)

Deployment procedures and environment configuration.

### [09. SEO & GEO Guide](./09-SEO-GEO-GUIDE.md)

SEO optimization and local search strategies.

---

## 📁 Detailed Documentation

### Components

- [UI Components](./components/UI-COMPONENTS.md) - shadcn/ui component catalog
- [Custom Components](./components/CUSTOM-COMPONENTS.md) - Custom-built components
- [Component Templates](./components/COMPONENT-TEMPLATES.md) - Templates for new components

### Content

- [Content Inventory](./content/CONTENT-INVENTORY.md) - Full content map
- [Pages](./content/PAGES.md) - Page structures and templates
- [Data Models](./content/DATA-MODELS.md) - Database schema documentation

### API

- [tRPC Procedures](./api/TRPC-PROCEDURES.md) - All API endpoints
- [Data Types](./api/DATA-TYPES.md) - TypeScript types and Zod schemas
- [Stripe Integration](./api/STRIPE-INTEGRATION.md) - Payment processing
- [Email Integration](./api/EMAIL-INTEGRATION.md) - Email service setup

### Development

- [Code Standards](./development/CODE-STANDARDS.md) - Coding conventions
- [Git Workflow](./development/GIT-WORKFLOW.md) - Git practices
- [Testing Guide](./development/TESTING-GUIDE.md) - Testing strategies
- [Environment Setup](./development/ENVIRONMENT-SETUP.md) - Local dev setup

### Deployment

- [Vercel Setup](./deployment/VERCEL-SETUP.md) - Vercel configuration
- [Database Migration](./deployment/DATABASE-MIGRATION.md) - Database migrations
- [Environment Variables](./deployment/ENVIRONMENT-VARIABLES.md) - Env var reference
- [Monitoring](./deployment/MONITORING.md) - Monitoring and logging

### SEO

- [Meta Tags](./seo/META-TAGS.md) - Meta tag implementation
- [Structured Data](./seo/STRUCTURED-DATA.md) - JSON-LD schemas
- [Sitemap](./seo/SITEMAP.md) - Sitemap configuration
- [GEO Targeting](./seo/GEO-TARGETING.md) - Local SEO strategies

---

## 🚀 Quick Start

### For New Developers

1. **Read the Overview**

   ```
   Read: 01-PROJECT-OVERVIEW.md
   ```

2. **Understand the Architecture**

   ```
   Read: 02-ARCHITECTURE.md
   ```

3. **Set Up Your Environment**

   ```
   Read: development/ENVIRONMENT-SETUP.md
   Follow the setup instructions
   ```

4. **Start Developing**
   ```
   Read: 07-DEVELOPMENT-GUIDE.md
   npm run dev
   ```

### For Content Editors

1. Access admin panel: `/admin`
2. See admin documentation in [03-COMPONENTS-GUIDE.md](./03-COMPONENTS-GUIDE.md#admin-components)

### For Deployment

1. **Review the checklist**

   ```
   Read: 08-DEPLOYMENT-GUIDE.md
   ```

2. **Configure environment**

   ```
   Read: deployment/ENVIRONMENT-VARIABLES.md
   ```

3. **Deploy**
   ```
   git push origin main
   ```

---

## 🛠️ Tech Stack Overview

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **API**: tRPC 11
- **Database**: PostgreSQL with Prisma ORM
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query
- **Email**: Resend
- **Payments**: Stripe
- **Booking**: Cal.com
- **Deployment**: Vercel

For more details, see [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)

---

## 📋 Common Tasks

### Adding a New Page

1. Create page file in `app/(public)/`
2. Add route to navigation in `lib/constants/navigation.ts`
3. Update sitemap in `app/sitemap.ts`
4. Add metadata for SEO
5. Document in `docs/content/PAGES.md`

### Adding a New Component

1. Create component in appropriate directory
2. Add to `components/index.ts` (if public)
3. Write unit tests
4. Document in `docs/components/CUSTOM-COMPONENTS.md`

### Modifying Design Tokens

1. Edit `app/globals.css` for color variables
2. Update `lib/constants/theme-config.ts` for other tokens
3. Document changes in `docs/04-DESIGN-SYSTEM.md`

### Adding a New API Endpoint

1. Create procedure in `server/api/routers/`
2. Add to main router in `server/api/root.ts`
3. Document in `docs/api/TRPC-PROCEDURES.md`

---

## 🆘 Need Help?

- **Common Issues**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Contributing**: Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Glossary**: Check [GLOSSARY.md](./GLOSSARY.md)
- **FAQ**: Browse [FAQ.md](./FAQ.md)

---

## 📊 Project Status

**Current Phase**: Planning
**Version**: 1.0
**Last Updated**: November 6, 2025

See [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) for the complete rebuild plan.

---

## 📝 Documentation Standards

This documentation follows these principles:

1. **Clear**: Easy to understand for all skill levels
2. **Concise**: No unnecessary information
3. **Complete**: Covers all aspects of the project
4. **Current**: Kept up-to-date with code changes
5. **Consistent**: Follows the same format throughout

### Updating Documentation

When you make changes to the codebase:

1. Update relevant documentation files
2. Update the "Last Updated" date
3. Follow the documentation templates
4. Keep examples practical and tested

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

---

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Made with ❤️ for Goeduitje.nl**
