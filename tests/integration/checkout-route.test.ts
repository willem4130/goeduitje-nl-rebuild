import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/checkout/route";
import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when priceId is missing", async () => {
    const req = createRequest({});
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Price ID is required");
  });

  it("creates checkout session with correct params", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/cs_test_123",
    } as never);

    const req = createRequest({
      priceId: "price_abc",
      quantity: 2,
      metadata: { email: "buyer@example.com" },
    });
    await POST(req);

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        payment_method_types: ["card", "ideal"],
        line_items: [{ price: "price_abc", quantity: 2 }],
        customer_email: "buyer@example.com",
        metadata: expect.objectContaining({
          priceId: "price_abc",
          email: "buyer@example.com",
        }),
      })
    );
  });

  it("returns sessionId and url on success", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce({
      id: "cs_test_456",
      url: "https://checkout.stripe.com/cs_test_456",
    } as never);

    const req = createRequest({ priceId: "price_xyz" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sessionId).toBe("cs_test_456");
    expect(json.url).toBe("https://checkout.stripe.com/cs_test_456");
  });

  it("returns 500 when Stripe throws", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockRejectedValueOnce(
      new Error("Stripe connection failed")
    );

    const req = createRequest({ priceId: "price_bad" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Stripe connection failed");
  });

  it("passes metadata including email", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce({
      id: "cs_test_789",
      url: "https://checkout.stripe.com/cs_test_789",
    } as never);

    const req = createRequest({
      priceId: "price_meta",
      metadata: { email: "meta@example.com", workshopId: "ws-1" },
    });
    await POST(req);

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: "meta@example.com",
        metadata: expect.objectContaining({
          email: "meta@example.com",
          workshopId: "ws-1",
          priceId: "price_meta",
        }),
      })
    );
  });
});
