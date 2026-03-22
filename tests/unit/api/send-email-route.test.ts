import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { resend } from "@/lib/resend";

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

import { POST } from "@/app/api/send-email/route";

const TEST_API_SECRET = "test-api-secret";

const createRequest = (body: unknown) =>
  new NextRequest("http://localhost:3000/api/send-email", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-api-secret": TEST_API_SECRET,
    },
  });

describe("POST /api/send-email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_SECRET = TEST_API_SECRET;
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: { id: "test-id" },
      error: null,
    } as any);
  });

  it("returns 400 when `to` is missing", async () => {
    const res = await POST(createRequest({ type: "welcome", data: {} }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Recipient email is required");
  });

  it("returns 400 when `type` is missing", async () => {
    const res = await POST(
      createRequest({ to: "user@example.com", data: {} })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Email type is required");
  });

  it("returns 400 for invalid email type", async () => {
    const res = await POST(
      createRequest({ to: "user@example.com", type: "nonsense", data: {} })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid email type");
  });

  it("sends contact-confirmation email with correct subject", async () => {
    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "contact-confirmation",
        data: { name: "John", subject: "Hello" },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["user@example.com"],
        subject: "Bedankt voor je bericht - Hello",
      })
    );
  });

  it("sends workshop-confirmation email with correct subject", async () => {
    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "workshop-confirmation",
        data: {
          name: "John",
          workshopId: "WS-001",
          workshops: [],
          participantCount: 10,
          location: "Amsterdam",
          date: "2026-04-01",
          time: "10:00",
        },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Uitje Configuratie Bevestiging - #WS-001",
      })
    );
  });

  it("sends welcome email", async () => {
    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "welcome",
        data: { name: "Jane", dashboardUrl: "https://example.com/dash" },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Welcome aboard! 🎉",
      })
    );
  });

  it("sends order-confirmation email", async () => {
    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "order-confirmation",
        data: {
          name: "Jane",
          orderNumber: "ORD-123",
          amount: 49.99,
          productName: "Workshop",
          receiptUrl: "https://example.com/receipt",
        },
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Order Confirmed - #ORD-123",
      })
    );
  });

  it("returns 500 when Resend throws error", async () => {
    vi.mocked(resend.emails.send).mockRejectedValue(
      new Error("Resend API failure")
    );

    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "welcome",
        data: { name: "Jane", dashboardUrl: "https://example.com" },
      })
    );
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Resend API failure");
  });
});
