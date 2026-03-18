import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { POST } from "@/app/api/checkout/route";

const createRequest = (body: unknown) =>
  new NextRequest("http://localhost:3000/api/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/test",
    } as any);
  });

  it("returns 400 when priceId is missing", async () => {
    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Price ID is required");
  });

  it("creates Stripe checkout session with correct params", async () => {
    const res = await POST(createRequest({ priceId: "price_abc" }));
    expect(res.status).toBe(200);

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        payment_method_types: ["card", "ideal"],
        line_items: [{ price: "price_abc", quantity: 1 }],
        success_url: expect.stringContaining("/checkout/success"),
        cancel_url: expect.stringContaining("/checkout/cancel"),
      })
    );
  });

  it("returns sessionId and URL on success", async () => {
    const res = await POST(createRequest({ priceId: "price_abc" }));
    const json = await res.json();
    expect(json.sessionId).toBe("cs_test_123");
    expect(json.url).toBe("https://checkout.stripe.com/test");
  });

  it("returns 500 when Stripe throws error", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
      new Error("Stripe failure")
    );

    const res = await POST(createRequest({ priceId: "price_abc" }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Stripe failure");
  });

  it("passes metadata and customer_email correctly", async () => {
    const res = await POST(
      createRequest({
        priceId: "price_abc",
        quantity: 2,
        metadata: { email: "buyer@example.com", orderId: "ord-1" },
      })
    );
    expect(res.status).toBe(200);

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_abc", quantity: 2 }],
        metadata: expect.objectContaining({
          priceId: "price_abc",
          email: "buyer@example.com",
          orderId: "ord-1",
        }),
        customer_email: "buyer@example.com",
      })
    );
  });
});
