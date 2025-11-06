# API Reference

> **tRPC procedures and API endpoints for Goeduitje.nl**

---

## 🔌 API Overview

The project uses **tRPC** for type-safe API communication between client and server.

### API Structure

```
/api/trpc/[trpc] - Main tRPC endpoint
/api/checkout - Stripe checkout endpoint
/api/send-email - Email sending endpoint
/api/webhooks/stripe - Stripe webhook handler
/api/webhooks/cal - Cal.com webhook handler
```

---

## 🛠️ tRPC Setup

### Server Setup

Located in `src/server/api/`:

```typescript
// server/api/trpc.ts
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    // Add session, user auth, etc.
  };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

// Reusable procedures
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(/* auth middleware */);
```

### Client Setup

```typescript
// trpc/client.tsx
"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";

export const api = createTRPCReact<AppRouter>();
```

---

## 📡 API Procedures

### User Router

Located in `src/server/api/routers/user.ts`:

```typescript
// Example procedures
export const userRouter = createTRPCRouter({
  // Get all users (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
      });
    }),

  // Create user
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: input,
      });
    }),
});
```

### Activity Router

Located in `src/server/api/routers/activity.ts` (to be created):

```typescript
export const activityRouter = createTRPCRouter({
  // Get all published activities
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        featured: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.activity.findMany({
        where: {
          published: true,
          ...(input.category && { category: input.category }),
          ...(input.featured && { featured: true }),
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get activity by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.activity.findUnique({
        where: { slug: input.slug },
      });
    }),

  // Create activity (admin only)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        price: z.number().positive(),
        duration: z.number().positive(),
        capacity: z.number().positive(),
        category: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activity.create({
        data: {
          ...input,
          slug: slugify(input.title),
        },
      });
    }),

  // Update activity (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          price: z.number().positive().optional(),
          // ... other fields
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activity.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  // Delete activity (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.activity.delete({
        where: { id: input.id },
      });
    }),
});
```

### Booking Router

Located in `src/server/api/routers/booking.ts` (to be created):

```typescript
export const bookingRouter = createTRPCRouter({
  // Get all bookings (admin)
  getAll: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
          .optional(),
        activityId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.booking.findMany({
        where: {
          ...(input.status && { status: input.status }),
          ...(input.activityId && { activityId: input.activityId }),
        },
        include: {
          activity: true,
          user: true,
        },
        orderBy: { date: "desc" },
      });
    }),

  // Create booking
  create: publicProcedure
    .input(
      z.object({
        activityId: z.string(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        date: z.date(),
        timeSlot: z.string(),
        participants: z.number().positive(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get activity to calculate price
      const activity = await ctx.db.activity.findUnique({
        where: { id: input.activityId },
      });

      if (!activity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      // Check capacity
      const existingBookings = await ctx.db.booking.count({
        where: {
          activityId: input.activityId,
          date: input.date,
          timeSlot: input.timeSlot,
          status: { not: "CANCELLED" },
        },
      });

      const totalParticipants = existingBookings + input.participants;
      if (totalParticipants > activity.capacity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough capacity",
        });
      }

      // Create booking
      const booking = await ctx.db.booking.create({
        data: {
          ...input,
          totalPrice: activity.price * input.participants,
          status: "PENDING",
        },
      });

      // Send confirmation email
      await sendBookingConfirmationEmail(booking);

      return booking;
    }),

  // Update booking status (admin)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.booking.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
```

### Contact Router

Located in `src/server/api/routers/contact.ts` (to be created):

```typescript
export const contactRouter = createTRPCRouter({
  // Submit contact form
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string(),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Save to database
      const submission = await ctx.db.contactSubmission.create({
        data: input,
      });

      // Send email to admin
      await sendContactNotification(input);

      // Send confirmation to customer
      await sendContactConfirmation(input.email, input.name);

      return { success: true };
    }),
});
```

---

## 🔐 Authentication & Authorization

### Protected Procedures

```typescript
// Middleware for authentication
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

// Protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// Admin procedure
const isAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user || ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const adminProcedure = t.procedure.use(isAdmin);
```

---

## 📨 Email API

Located in `src/app/api/send-email/route.ts`:

```typescript
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  try {
    await resend.emails.send({
      from: "Goeduitje <noreply@goeduitje.nl>",
      to,
      subject,
      html,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
```

---

## 💳 Stripe Checkout API

Located in `src/app/api/checkout/route.ts`:

```typescript
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { activityId, quantity } = await req.json();

  // Get activity
  const activity = await db.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    return Response.json({ error: "Activity not found" }, { status: 404 });
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: activity.title,
            description: activity.description,
          },
          unit_amount: Math.round(activity.price.toNumber() * 100),
        },
        quantity,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      activityId,
    },
  });

  return Response.json({ url: session.url });
}
```

---

## 📞 Client Usage

### React Query Hooks

```typescript
'use client'

import { api } from '@/trpc/client'

export function ActivityList() {
  // Query
  const { data, isLoading, error } = api.activity.getAll.useQuery({
    featured: true,
  })

  // Mutation
  const createActivity = api.activity.create.useMutation({
    onSuccess: () => {
      toast.success('Activity created')
    },
  })

  const handleCreate = (data) => {
    createActivity.mutate(data)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
```

### Server Components

```typescript
import { api } from '@/trpc/server'

export default async function ActivityPage({ params }) {
  const activity = await api.activity.getBySlug({ slug: params.slug })

  return <ActivityDetail activity={activity} />
}
```

---

## 🧪 Testing APIs

### Unit Tests

```typescript
import { appRouter } from "@/server/api/root";
import { createInnerTRPCContext } from "@/server/api/trpc";

describe("Activity Router", () => {
  it("should get all activities", async () => {
    const ctx = await createInnerTRPCContext({});
    const caller = appRouter.createCaller(ctx);

    const activities = await caller.activity.getAll({});

    expect(activities).toBeDefined();
    expect(Array.isArray(activities)).toBe(true);
  });
});
```

---

## 📚 Related Documentation

- [Data Models](./content/DATA-MODELS.md) - Database schema
- [Data Types](./api/DATA-TYPES.md) - TypeScript types and Zod schemas
- [tRPC Procedures](./api/TRPC-PROCEDURES.md) - Complete procedure list

---

**Last Updated**: November 6, 2025
