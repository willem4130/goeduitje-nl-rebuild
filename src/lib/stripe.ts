import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

// Product prices - Replace these with your actual Stripe Price IDs from dashboard
export const STRIPE_PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER || "price_xxxxxxxxxxxxx",
  PRO: process.env.STRIPE_PRICE_PRO || "price_xxxxxxxxxxxxx",
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE || "price_xxxxxxxxxxxxx",
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
};
