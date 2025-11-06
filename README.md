# goeduitjefullstackwebsite

A production-ready Next.js 16 full-stack application with PostgreSQL, Prisma, tRPC, shadcn/ui, and comprehensive testing setup.

## 🚀 Tech Stack

### Core Framework

- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety

### Database & ORM

- **PostgreSQL** - Relational database
- **Prisma 6.19.0** - Next-generation ORM

### API Layer

- **tRPC 11.7.1** - End-to-end typesafe APIs
- **@tanstack/react-query 5.90.7** - Async state management
- **Zod 4.1.12** - Schema validation

### UI Components

- **shadcn/ui** - Beautifully designed components
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components

### Code Quality

- **ESLint 9** - Linting with flat config
- **Prettier 3.6.2** - Code formatting
- **Husky 9.1.7** - Git hooks
- **lint-staged 16.2.6** - Run linters on staged files

### Testing

- **Vitest 4.0.7** - Unit testing framework
- **Playwright 1.56.1** - E2E testing
- **@testing-library/react 16.3.0** - React testing utilities

### Environment & Deployment

- **@t3-oss/env-nextjs 0.13.8** - Type-safe environment variables
- **Vercel** - Deployment platform (configured)

## 📁 Project Structure

```
goeduitjefullstackwebsite/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/trpc/[trpc]/     # tRPC API endpoint
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # Shared UI components
│   │   └── ui/                   # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   │
│   ├── lib/                      # Core library code
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── utils.ts              # Utility functions
│   │
│   ├── server/                   # Server-side code
│   │   └── api/
│   │       ├── routers/          # tRPC routers
│   │       │   └── user.ts       # User router example
│   │       ├── root.ts           # Main tRPC router
│   │       └── trpc.ts           # tRPC initialization
│   │
│   ├── trpc/                     # tRPC client configuration
│   │   ├── client.tsx            # Client-side tRPC
│   │   ├── server.tsx            # Server-side tRPC caller
│   │   └── query-client.tsx      # React Query client
│   │
│   ├── hooks/                    # Custom React hooks
│   └── types/                    # TypeScript type definitions
│
├── prisma/
│   └── schema.prisma             # Database schema with User/Post models
│
├── tests/
│   ├── setup/
│   │   └── vitest.setup.ts       # Vitest configuration
│   ├── unit/                     # Unit tests (Vitest)
│   └── e2e/                      # E2E tests (Playwright)
│       └── homepage.spec.ts      # Example E2E test
│
├── .husky/                       # Git hooks
│   └── pre-commit                # Lint-staged hook
│
├── env.ts                        # Type-safe env validation
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment variable template
├── components.json               # shadcn/ui config
├── eslint.config.mjs             # ESLint flat config
├── prettier.config.js            # Prettier config
├── playwright.config.ts          # Playwright config
├── vitest.config.mts             # Vitest config
├── vercel.json                   # Vercel deployment config
└── tsconfig.json                 # TypeScript config (strict mode)
```

## 🔧 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended)
- **PostgreSQL** database running locally or remotely

### Installation

1. **Install dependencies:**

```bash
bun install  # or npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/goeduitjefullstackwebsite?schema=public"
NODE_ENV="development"
```

3. **Initialize the database:**

```bash
# Create database migration
bunx prisma migrate dev --name init

# Generate Prisma Client
bunx prisma generate
```

### Development

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📜 Available Scripts

### Development

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server

### Code Quality

- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint errors
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting
- `bun run typecheck` - Run TypeScript type checking

### Testing

- `bun run test` - Run unit tests (Vitest watch mode)
- `bun run test:ui` - Run Vitest with UI
- `bun run test:e2e` - Run E2E tests (Playwright)
- `bun run test:e2e:ui` - Run Playwright with UI

## 🗄️ Database

The project includes example Prisma models:

- **User** - User entity with email, name, and posts relationship
- **Post** - Post entity with title, content, published status

### Prisma Commands

```bash
# Create a new migration
bunx prisma migrate dev --name migration_name

# Apply migrations in production
bunx prisma migrate deploy

# Open Prisma Studio (database GUI)
bunx prisma studio

# Reset database (development only)
bunx prisma migrate reset
```

## 🔌 tRPC API

Example tRPC usage:

### Server-side (in Server Components):

```typescript
import { api } from "@/trpc/server";

const users = await api.user.getAll();
```

### Client-side (in Client Components):

```typescript
"use client";
import { api } from "@/trpc/client";

export function UserList() {
  const { data: users } = api.user.getAll.useQuery();
  return <div>{/* render users */}</div>;
}
```

## 🎨 UI Components

Add new shadcn/ui components:

```bash
bunx shadcn@latest add [component-name]

# Examples:
bunx shadcn@latest add dialog
bunx shadcn@latest add form
bunx shadcn@latest add table
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub:**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will detect Next.js automatically

3. **Set environment variables in Vercel:**
   - Add `DATABASE_URL` in project settings
   - Set `NODE_ENV=production`

### Database Setup for Production

For production, consider using:

- **Vercel Postgres** - Integrated PostgreSQL
- **Supabase** - PostgreSQL with additional features
- **PlanetScale** - MySQL-compatible serverless database
- **Railway** - PostgreSQL hosting

## ⚠️ Important Notes

### Environment Variables

- All environment variables are validated at build time using `@t3-oss/env-nextjs`
- Never commit `.env` files to version control
- Update `.env.example` when adding new variables

### Git Hooks

- Pre-commit hook runs lint-staged (ESLint + Prettier on staged files)
- Commits will fail if linting errors are found
- Use `git commit --no-verify` to skip (not recommended)

### Type Safety

- TypeScript strict mode is enabled
- tRPC provides end-to-end type safety from database to frontend
- Zod schemas validate runtime data

## 📚 Next Steps

1. **Configure your database:**
   - Update Prisma schema with your models
   - Run migrations: `bunx prisma migrate dev`

2. **Create API endpoints:**
   - Add routers in `src/server/api/routers/`
   - Export them in `src/server/api/root.ts`

3. **Build UI components:**
   - Create pages in `src/app/`
   - Use shadcn/ui components from `src/components/ui/`
   - Add custom components in `src/components/`

4. **Write tests:**
   - Unit tests in `tests/unit/`
   - E2E tests in `tests/e2e/`

5. **Set up authentication (optional):**
   - Consider NextAuth.js or Clerk
   - Add auth middleware
   - Protect tRPC routes

## 🐛 Troubleshooting

### Build fails with Prisma error

```bash
bunx prisma generate
bun run build
```

### Type errors in tRPC

- Ensure `@trpc/react-query` is installed
- Restart TypeScript server in your IDE

### Database connection issues

- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database credentials

## 📄 License

MIT

---

**Built with ❤️ using the latest Next.js stack (November 2025)**
