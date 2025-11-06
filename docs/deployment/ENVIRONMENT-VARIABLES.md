# Environment Variables

> **Complete guide to environment variables for Goeduitje.nl**

---

## 📋 Overview

Environment variables are stored in `.env` files and should never be committed to git.

---

## 🔐 Required Variables

### Database

```env
DATABASE_URL="postgresql://username:password@host:5432/database"
```

**Description**: PostgreSQL connection string
**Required in**: Development, Production
**Get from**: Neon, Supabase, Railway, or local PostgreSQL

### Application

```env
NEXT_PUBLIC_APP_URL="https://goeduitje.nl"
NODE_ENV="production"
```

**NEXT_PUBLIC_APP_URL**: Your website URL (include protocol)
**NODE_ENV**: Environment (development, production, test)

### Email (Resend)

```env
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@goeduitje.nl"
```

**RESEND_API_KEY**: API key from Resend dashboard
**EMAIL_FROM**: Sender email address (must be verified in Resend)

**Get from**: [resend.com](https://resend.com)

---

## 🔧 Optional Variables

### Stripe (Payment Processing)

```env
STRIPE_SECRET_KEY="sk_test_..."  # or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."  # or pk_live_...
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Required if**: Using payment processing
**Get from**: [stripe.com](https://stripe.com/docs/keys)

**Note**: Use `_test_` keys for development, `_live_` for production

### Cal.com (Booking System)

```env
CAL_COM_API_KEY="cal_..."
NEXT_PUBLIC_CAL_LINK="your-username/event-type"
```

**Required if**: Using Cal.com integration
**Get from**: [cal.com](https://cal.com) API settings

### Google Maps

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza..."
```

**Required if**: Embedding Google Maps
**Get from**: [Google Cloud Console](https://console.cloud.google.com/)

### Analytics

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

**Required if**: Using Google Analytics
**Get from**: [Google Analytics](https://analytics.google.com/)

### Error Tracking (Sentry)

```env
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="..."
```

**Required if**: Using Sentry for error tracking
**Get from**: [sentry.io](https://sentry.io/)

---

## 📁 Environment Files

### `.env.local` (Development)

Use for local development. Not committed to git.

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/goeduitje_dev"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Email (use test mode)
RESEND_API_KEY="re_test_..."
EMAIL_FROM="test@test.com"

# Stripe (test keys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### `.env.production` (Production)

Use for production. Set in Vercel dashboard or hosting platform.

```env
# Database (production)
DATABASE_URL="postgresql://user:pass@prod-db-host:5432/goeduitje_prod"

# App
NEXT_PUBLIC_APP_URL="https://goeduitje.nl"
NODE_ENV="production"

# Email (production)
RESEND_API_KEY="re_live_..."
EMAIL_FROM="noreply@goeduitje.nl"

# Stripe (live keys)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

### `.env.example` (Template)

Committed to git as a template. No actual values.

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="your-email@example.com"

# Optional: Stripe
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# Optional: Cal.com
CAL_COM_API_KEY="cal_..."

# Optional: Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza..."

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

---

## 🔒 Security Best Practices

### DO:

- ✅ Use `.env.local` for development
- ✅ Keep `.env.example` updated
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Use different keys for development/production
- ✅ Rotate keys regularly
- ✅ Use environment-specific values

### DON'T:

- ❌ Commit `.env` files to git
- ❌ Share API keys in chat/email
- ❌ Use production keys in development
- ❌ Hardcode sensitive values in code
- ❌ Use `NEXT_PUBLIC_` for secrets

---

## 🚀 Setting Up in Vercel

1. Go to Project Settings > Environment Variables
2. Add each variable:
   - Key: `DATABASE_URL`
   - Value: `postgresql://...`
   - Environments: Production, Preview, Development
3. Click "Save"
4. Redeploy project

**Note**: Changes to environment variables require a redeployment.

---

## 🔍 Verifying Variables

### In Development

```bash
# Check if variables are loaded
node -e "console.log(process.env.DATABASE_URL)"
```

### In Components

```typescript
// Server-side (works)
const apiKey = process.env.RESEND_API_KEY;

// Client-side (only works with NEXT_PUBLIC_ prefix)
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
```

---

## 📋 Environment Variable Checklist

### Development Setup

- [ ] Create `.env.local` file
- [ ] Add `DATABASE_URL`
- [ ] Add `NEXT_PUBLIC_APP_URL`
- [ ] Add `RESEND_API_KEY`
- [ ] Add optional services (Stripe, etc.)
- [ ] Test application starts

### Production Setup

- [ ] Production database URL
- [ ] Production domain URL
- [ ] Production email API key
- [ ] Production Stripe keys (if used)
- [ ] Analytics ID (if used)
- [ ] Set all variables in Vercel
- [ ] Test deployment

---

## 🆘 Troubleshooting

### Variable not working in client component

**Problem**: `process.env.MY_VAR` is undefined in client component

**Solution**: Add `NEXT_PUBLIC_` prefix: `NEXT_PUBLIC_MY_VAR`

### Variable not updating

**Solution**:

1. Restart dev server
2. Clear `.next` folder
3. In production: redeploy

### Database connection fails

**Solution**:

1. Check `DATABASE_URL` format
2. Verify database is accessible
3. Check credentials are correct
4. Test connection with Prisma Studio

---

**Last Updated**: November 6, 2025
