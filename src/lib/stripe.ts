import Stripe from "stripe";

// Lazy initialization to avoid build-time errors when STRIPE_SECRET_KEY is not set
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Legacy export for backwards compatibility - will throw at runtime if not configured
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    })
  : (null as unknown as Stripe);

// Re-export product configurations for server-side use
export { STRIPE_PRICES, STRIPE_PRODUCTS } from "./stripe-products";
