import "@testing-library/jest-dom";
import { vi } from "vitest";

// Set API_SECRET for protected tRPC procedures in tests
process.env.API_SECRET = "test-api-secret";

// Mock env module to avoid t3-env validation
vi.mock("@/env", () => ({
  env: {
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    NODE_ENV: "test",
    STRIPE_SECRET_KEY: "sk_test_fake",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_fake",
    GOOGLE_PLACES_API_KEY: undefined,
    GOOGLE_PLACE_ID: undefined,
    CRON_SECRET: "test-cron-secret",
  },
}));

// Mock Prisma client
vi.mock("@/lib/prisma", () => {
  const mockPrisma: Record<string, unknown> = {
    workshopConfig: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    feedback: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    workshop: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
    priceTier: {
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
    workshopVariant: {
      deleteMany: vi.fn(),
    },
    recipe: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    teamMember: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    testimonial: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    googleReview: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    google_reviews_cache: {
      findFirst: vi.fn(),
      upsert: vi.fn(),
    },
    fAQ: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    siteSetting: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    pageContent: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    mediaGallery: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    booking: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      aggregate: vi.fn(),
    },
    openWorkshopSession: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    emailTemplate: {
      findUnique: vi.fn(),
    },
    emailLog: {
      create: vi.fn(),
    },
    workshopRequest: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction: vi.fn((cbOrArray: any) => {
      // Support interactive transactions (callback style)
      if (typeof cbOrArray === "function") {
        return cbOrArray(mockPrisma);
      }
      // Support batch transactions (array style)
      return Promise.resolve(cbOrArray);
    }),
  };
  return { prisma: mockPrisma };
});

// Mock Resend
vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ id: "test-email-id", error: null }),
    },
  },
  FROM_EMAIL: "test@example.com",
  SUPPORT_EMAIL: "support@example.com",
  getResend: vi.fn(),
}));

// Mock Stripe
vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: "cs_test_123",
          url: "https://checkout.stripe.com/test",
        }),
      },
    },
  },
  getStripe: vi.fn(),
  STRIPE_PRICES: { COOKING_WORKSHOP: "price_test" },
  STRIPE_PRODUCTS: {
    COOKING_WORKSHOP: {
      name: "Open Kookworkshop",
      price: 50,
      priceId: "price_test",
    },
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/headers (used by cron route)
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Map()),
}));

// Mock Google Places
vi.mock("@/lib/google-places", () => ({
  fetchAllGoogleReviews: vi.fn(),
  isGooglePlacesConfigured: vi.fn().mockReturnValue(false),
}));

// Mock email templates
vi.mock("@/emails/contact-confirmation", () => ({
  ContactConfirmationEmail: vi.fn().mockReturnValue(null),
}));
vi.mock("@/emails/welcome", () => ({
  WelcomeEmail: vi.fn().mockReturnValue(null),
}));
vi.mock("@/emails/order-confirmation", () => ({
  OrderConfirmationEmail: vi.fn().mockReturnValue(null),
}));
vi.mock("@/emails/workshop-confirmation", () => ({
  WorkshopConfirmationEmail: vi.fn().mockReturnValue(null),
}));
vi.mock("@/emails/booking-confirmation", () => ({
  BookingConfirmationEmail: vi.fn().mockReturnValue(null),
}));
vi.mock("@react-email/render", () => ({
  render: vi.fn().mockResolvedValue("<html></html>"),
}));

// Mock server-only (used by some imports)
vi.mock("server-only", () => ({}));
