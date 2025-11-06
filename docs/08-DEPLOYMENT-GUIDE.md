# Deployment Guide

> **Production deployment procedures for Goeduitje.nl**

---

## 🚀 Deployment Options

### Recommended: Vercel

Vercel is the recommended platform for deploying Next.js applications.

**Pros**:

- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments
- Built-in analytics
- Edge Functions
- Excellent Next.js support

---

## 📋 Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing (`npm test`, `npm run test:e2e`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)

### Environment Setup

- [ ] Production database configured
- [ ] Environment variables set
- [ ] API keys for production services
- [ ] Custom domain configured (optional)

### Content & SEO

- [ ] All content migrated
- [ ] Images optimized
- [ ] Meta tags on all pages
- [ ] Sitemap generated
- [ ] robots.txt configured

### Security

- [ ] `.env` not committed
- [ ] API keys secure
- [ ] CORS configured (if needed)
- [ ] Rate limiting enabled (if needed)

---

## 🔧 Vercel Deployment

### Step 1: Prepare Repository

```bash
# Ensure latest code is pushed
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### Step 3: Configure Project

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `goeduitjefullstackwebsite`

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

### Step 4: Set Environment Variables

Add all variables from `.env`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://goeduitje.nl
NODE_ENV=production
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_...
# ... other variables
```

**Important**: Don't include `NEXT_PUBLIC_` prefix for secret keys.

### Step 5: Deploy

Click "Deploy" and wait for build to complete.

---

## 🗄️ Database Setup

### Production Database

Use a managed PostgreSQL service:

**Options**:

- [Neon](https://neon.tech/) - Serverless Postgres (recommended)
- [Supabase](https://supabase.com/) - Postgres + Backend
- [Railway](https://railway.app/) - Full infrastructure
- [Render](https://render.com/) - Managed Postgres

### Database Migration

```bash
# Set DATABASE_URL to production
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Seed database (if needed)
npx prisma db seed
```

---

## 🔐 Environment Variables Guide

### Required for Production

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="https://goeduitje.nl"
NODE_ENV="production"

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@goeduitje.nl"
```

### Optional Services

```env
# Stripe (if using payments)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cal.com (if using booking)
CAL_COM_API_KEY="..."

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

---

## 🌐 Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to Project Settings > Domains
2. Add `goeduitje.nl` and `www.goeduitje.nl`
3. Note the DNS records provided

### 2. Configure DNS

Add these records at your domain registrar:

```
A     @       76.76.21.21
CNAME www     cname.vercel-dns.com
```

### 3. Verify Domain

Wait for DNS propagation (can take up to 48 hours)

### 4. Update Environment Variable

```env
NEXT_PUBLIC_APP_URL="https://goeduitje.nl"
```

---

## 📊 Monitoring Setup

### Vercel Analytics

Automatically enabled for all deployments.

View in Vercel Dashboard > Analytics

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

### Google Analytics 4

```typescript
// app/layout.tsx
import Script from 'next/script'

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys:

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests to any branch

### GitHub Actions (Optional)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
```

---

## 🐛 Troubleshooting

### Build Fails

**Check**:

- TypeScript errors
- Missing environment variables
- Dependencies installed correctly

```bash
# Local build test
npm run build
```

### Database Connection Issues

**Check**:

- `DATABASE_URL` is correct
- Database is accessible from Vercel (check IP whitelist)
- Migrations are up to date

### Environment Variables Not Working

**Check**:

- Variables are set in Vercel dashboard
- `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding variables

---

## 📈 Post-Deployment

### Verify Deployment

- [ ] Website loads at production URL
- [ ] All pages accessible
- [ ] Forms work correctly
- [ ] Database connections working
- [ ] Email sending works
- [ ] Analytics tracking

### Performance Check

```bash
# Run Lighthouse
npm install -g @lhci/cli
lhci autorun --url=https://goeduitje.nl
```

Target scores:

- Performance: 95+ (desktop), 90+ (mobile)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### SEO Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain ownership
- [ ] Set up Google Business Profile
- [ ] Add site to Bing Webmaster Tools

---

## 🔄 Updating Production

### Standard Updates

```bash
# Make changes locally
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel deploys automatically
```

### Database Migrations

```bash
# 1. Test migration locally
npx prisma migrate dev --name add_new_field

# 2. Commit migration files
git add prisma/migrations
git commit -m "db: add new field"
git push

# 3. Vercel runs migrations automatically
# (if configured in package.json postinstall script)
```

### Rollback

In Vercel Dashboard:

1. Go to Deployments
2. Find previous working deployment
3. Click "..." > "Promote to Production"

---

## 📚 Related Documentation

- [Environment Variables](./deployment/ENVIRONMENT-VARIABLES.md)
- [Database Migration](./deployment/DATABASE-MIGRATION.md)
- [Monitoring](./deployment/MONITORING.md)
- [Vercel Setup](./deployment/VERCEL-SETUP.md)

---

**Last Updated**: November 6, 2025
