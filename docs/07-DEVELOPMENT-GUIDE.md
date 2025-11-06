# Development Guide

> **Development workflows and best practices for Goeduitje.nl**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd goeduitjefullstackwebsite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run typecheck        # TypeScript type checking

# Testing
npm run test             # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI

# Database
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Run migrations (dev)
npx prisma migrate deploy # Run migrations (prod)
npx prisma db seed       # Seed database
npx prisma generate      # Generate Prisma Client
```

---

## 🗄️ Database Setup

### Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb goeduitje_dev

# Update .env
DATABASE_URL="postgresql://username:password@localhost:5432/goeduitje_dev"
```

### Cloud Database (Recommended for Development)

Use [Neon](https://neon.tech/) or [Supabase](https://supabase.com/) for free PostgreSQL hosting.

---

## 🔧 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/activity-booking
```

### 2. Make Changes

- Write code
- Follow coding standards
- Add tests
- Update documentation

### 3. Test Changes

```bash
npm run typecheck    # Type check
npm run lint         # Lint
npm run test         # Unit tests
npm run test:e2e     # E2E tests
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add activity booking feature"
```

### 5. Push and Create PR

```bash
git push origin feature/activity-booking
# Create pull request on GitHub
```

---

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Avoid `any` type
- Use strict mode

**Example**:

```typescript
// Good
interface Activity {
  id: string
  title: string
  price: number
}

const activity: Activity = { ... }

// Avoid
const activity: any = { ... }
```

### React Components

- Use functional components
- Server Components by default
- Client Components when needed
- Use TypeScript for props

**Example**:

```typescript
// Server Component
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client Component
'use client'
export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### File Naming

- **Components**: PascalCase (`ActivityCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Pages**: lowercase (`page.tsx`, `layout.tsx`)
- **API Routes**: lowercase (`route.ts`)

### Import Order

```typescript
// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { api } from "@/trpc/client";
import { formatDate } from "@/lib/utils";

// 3. Types
import type { Activity } from "@/types";
```

---

## 🎨 Styling Guidelines

### Tailwind Best Practices

```typescript
// Use utility classes
<div className="flex items-center gap-4 rounded-lg bg-background p-4">

// Use cn() for conditional classes
import { cn } from "@/lib/utils"

<div className={cn(
  "base classes",
  condition && "conditional classes"
)}>
```

### Avoid

```typescript
// Don't use inline styles
<div style={{ padding: '16px' }}>

// Don't hardcode colors
<div className="bg-blue-500">

// Do use design tokens
<div className="bg-primary">
```

---

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// tests/components/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    const button = screen.getByText('Click')
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### E2E Tests

```typescript
// tests/e2e/booking.spec.ts
import { test, expect } from "@playwright/test";

test("complete booking flow", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Book Now");

  await page.fill("#name", "John Doe");
  await page.fill("#email", "john@example.com");

  await page.click("text=Confirm");

  await expect(page.locator("text=Booking Confirmed")).toBeVisible();
});
```

---

## 🔍 Debugging

### Development Tools

```typescript
// Console logging
console.log("Debug:", data);

// React DevTools (install browser extension)
// tRPC DevTools (built-in)
```

### Database Debugging

```bash
# Open Prisma Studio
npx prisma studio

# View logs
npm run dev # Check console
```

### API Debugging

- Use browser DevTools Network tab
- Check tRPC request/response in console
- Use Postman for REST endpoints

---

## 🔐 Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="test@example.com"

# Optional
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
CAL_COM_API_KEY="..."
```

### Security

- Never commit `.env` files
- Use `.env.example` as template
- Keep API keys secret
- Use different keys for dev/prod

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

See also:

- [Code Standards](./development/CODE-STANDARDS.md)
- [Git Workflow](./development/GIT-WORKFLOW.md)
- [Testing Guide](./development/TESTING-GUIDE.md)

---

**Last Updated**: November 6, 2025
