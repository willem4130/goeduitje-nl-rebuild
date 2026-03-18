import { describe, it, expect } from "vitest";
import { STRIPE_PRODUCTS, STRIPE_PRICES } from "@/lib/stripe-products";

describe("STRIPE_PRODUCTS", () => {
  it("COOKING_WORKSHOP has price 50 and currency eur", () => {
    expect(STRIPE_PRODUCTS.COOKING_WORKSHOP.price).toBe(50);
    expect(STRIPE_PRODUCTS.COOKING_WORKSHOP.currency).toBe("eur");
  });

  it("STARTER has price 29", () => {
    expect(STRIPE_PRODUCTS.STARTER.price).toBe(29);
  });

  it("PRO has price 79", () => {
    expect(STRIPE_PRODUCTS.PRO.price).toBe(79);
  });

  it("ENTERPRISE has price 199", () => {
    expect(STRIPE_PRODUCTS.ENTERPRISE.price).toBe(199);
  });

  it("all products have name and priceId fields", () => {
    for (const product of Object.values(STRIPE_PRODUCTS)) {
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("priceId");
      expect(typeof product.name).toBe("string");
      expect(typeof product.priceId).toBe("string");
    }
  });
});

describe("STRIPE_PRICES", () => {
  it("has keys: STARTER, PRO, ENTERPRISE, COOKING_WORKSHOP", () => {
    expect(STRIPE_PRICES).toHaveProperty("STARTER");
    expect(STRIPE_PRICES).toHaveProperty("PRO");
    expect(STRIPE_PRICES).toHaveProperty("ENTERPRISE");
    expect(STRIPE_PRICES).toHaveProperty("COOKING_WORKSHOP");
  });

  it("all values are strings", () => {
    for (const value of Object.values(STRIPE_PRICES)) {
      expect(typeof value).toBe("string");
    }
  });
});
