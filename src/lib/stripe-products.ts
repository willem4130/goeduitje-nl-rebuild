/**
 * Stripe Product Configurations
 * Safe to import in both client and server components
 */

// Product prices - These should match your Stripe Price IDs
export const STRIPE_PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER || "price_xxxxxxxxxxxxx",
  PRO: process.env.STRIPE_PRICE_PRO || "price_xxxxxxxxxxxxx",
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE || "price_xxxxxxxxxxxxx",
  COOKING_WORKSHOP:
    process.env.NEXT_PUBLIC_STRIPE_PRICE_COOKING_WORKSHOP ||
    process.env.STRIPE_PRICE_COOKING_WORKSHOP ||
    "price_xxxxxxxxxxxxx",
};

export const STRIPE_PRODUCTS = {
  STARTER: {
    name: "Starter Plan",
    price: 29,
    priceId: STRIPE_PRICES.STARTER,
    features: [
      "Up to 10 projects",
      "Basic analytics",
      "24/7 Support",
      "1 GB Storage",
    ],
  },
  PRO: {
    name: "Pro Plan",
    price: 79,
    priceId: STRIPE_PRICES.PRO,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "10 GB Storage",
      "Custom integrations",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise Plan",
    price: 199,
    priceId: STRIPE_PRICES.ENTERPRISE,
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom contracts",
      "Unlimited storage",
      "Advanced security",
      "SLA guarantee",
    ],
  },
  COOKING_WORKSHOP: {
    name: "Open Kookworkshop",
    price: 50,
    currency: "eur",
    priceId: STRIPE_PRICES.COOKING_WORKSHOP,
    description:
      "Deelname aan een open kookworkshop in Nijmegen. Inclusief ingrediënten, recepten en persoonlijke begeleiding.",
  },
};
