# Frequently Asked Questions

> **Common questions about the Goeduitje.nl project**

---

## General

### What is this project?

A full-stack web application for Goeduitje.nl, built with Next.js 16, React 19, TypeScript, tRPC, Prisma, and PostgreSQL. It allows customers to discover and book activities online.

### What tech stack is used?

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: tRPC, Prisma ORM, PostgreSQL
- **Hosting**: Vercel
- **Email**: Resend
- **Payments**: Stripe (optional)

---

## Development

### How do I set up the project locally?

```bash
npm install
cp .env.example .env
# Edit .env with your values
npx prisma migrate dev
npm run dev
```

See [Development Guide](./07-DEVELOPMENT-GUIDE.md) for details.

### How do I add a new page?

1. Create file in `app/(public)/your-page/page.tsx`
2. Add to navigation in `lib/constants/navigation.ts`
3. Update sitemap in `app/sitemap.ts`
4. Add metadata for SEO

### How do I add a new API endpoint?

1. Create procedure in `server/api/routers/your-router.ts`
2. Add to `server/api/root.ts`
3. Use in components via `api.yourRouter.procedure.useQuery()`

### How do I customize colors?

Edit `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.646 0.222 41.116);
  /* Change color values here */
}
```

---

## Deployment

### How do I deploy to production?

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

See [Deployment Guide](./08-DEPLOYMENT-GUIDE.md) for details.

### What environment variables are needed?

Required:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Your domain
- `RESEND_API_KEY` - Email service key

Optional:

- `STRIPE_SECRET_KEY` - Payment processing
- `CAL_COM_API_KEY` - Booking system

See [Deployment Guide](./08-DEPLOYMENT-GUIDE.md#environment-variables) for complete list.

---

## Database

### How do I run database migrations?

```bash
# Development
npx prisma migrate dev --name your_migration_name

# Production
npx prisma migrate deploy
```

### How do I view/edit database data?

```bash
npx prisma studio
```

### How do I reset the database?

```bash
# ⚠️ This deletes all data
npx prisma migrate reset
```

---

## Troubleshooting

### Build fails with TypeScript errors

```bash
npm run typecheck
# Fix errors shown
npx prisma generate  # Regenerate Prisma types
```

### Can't connect to database

Check:

1. `DATABASE_URL` in `.env` is correct
2. PostgreSQL is running
3. Database exists

### Changes not showing up

1. Clear `.next` folder: `rm -rf .next`
2. Restart dev server
3. Hard refresh browser (Cmd+Shift+R)

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more.

---

## Content & SEO

### How do I add content?

Use the admin panel at `/admin` to manage:

- Activities
- Pages
- Blog posts
- Testimonials

### How do I improve SEO?

- Add unique meta titles and descriptions
- Use structured data (JSON-LD)
- Optimize images with alt text
- Improve page speed
- Build quality backlinks

See [SEO Guide](./09-SEO-GEO-GUIDE.md) for details.

---

## Contributing

### How can I contribute?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [Contributing Guide](./CONTRIBUTING.md) for details.

### What's the code style?

- TypeScript for all code
- Tailwind CSS for styling
- Functional React components
- Follow existing patterns

---

## Support

### Where can I get help?

- Check [documentation](./00-README.md)
- Review [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Search GitHub issues
- Contact the team

---

**Last Updated**: November 6, 2025
