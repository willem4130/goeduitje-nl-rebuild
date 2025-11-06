# Troubleshooting Guide

> **Common issues and solutions**

---

## 🚨 Installation Issues

### `npm install` fails

**Solution**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### TypeScript errors after install

**Solution**:

```bash
# Regenerate Prisma Client
npx prisma generate

# Check TypeScript
npm run typecheck
```

---

## 🗄️ Database Issues

### Cannot connect to database

**Check**:

1. DATABASE_URL in .env is correct
2. PostgreSQL is running
3. Database exists
4. Credentials are correct

**Solution**:

```bash
# Test connection
npx prisma db push

# View database
npx prisma studio
```

### Prisma Client not generated

**Solution**:

```bash
npx prisma generate
```

### Migration fails

**Solution**:

```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or apply specific migration
npx prisma migrate deploy
```

---

## 🌐 Development Server Issues

### Port 3000 already in use

**Solution**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Changes not reflecting

**Solution**:

1. Hard refresh browser (Cmd+Shift+R)
2. Clear `.next` folder: `rm -rf .next`
3. Restart dev server

---

## 🎨 Styling Issues

### Tailwind classes not working

**Solution**:

1. Check `tailwind.config.ts` includes correct content paths
2. Restart dev server
3. Check for typos in class names

### Dark mode not working

**Solution**:

```bash
# Check ThemeProvider is in layout.tsx
# Verify next-themes is installed
npm install next-themes
```

---

## 🔌 API Issues

### tRPC procedures not found

**Solution**:

```bash
# Regenerate types
npm run typecheck

# Check router is exported in root.ts
# Restart dev server
```

### CORS errors

**Solution**:
Add to `next.config.ts`:

```typescript
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  }]
}
```

---

## 📧 Email Issues

### Emails not sending

**Check**:

1. RESEND_API_KEY in .env
2. Email FROM address is verified
3. Check Resend dashboard for errors

---

## 🚀 Build Issues

### Build fails in production

**Solution**:

```bash
# Test build locally
npm run build

# Check for:
# - TypeScript errors
# - Missing environment variables
# - Import errors
```

### Environment variables not working

**Remember**:

- Client variables need `NEXT_PUBLIC_` prefix
- Server variables don't
- Redeploy after adding variables

---

## 🔍 Debugging Tips

1. Check browser console for errors
2. Check terminal for server errors
3. Use React DevTools
4. Use Network tab for API issues
5. Check Prisma Studio for database

---

## 📞 Getting Help

- Check documentation
- Search existing issues on GitHub
- Ask in team chat
- Create new GitHub issue

---

**Last Updated**: November 6, 2025
