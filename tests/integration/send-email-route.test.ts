import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/send-email/route";
import { NextRequest } from "next/server";
import { resend } from "@/lib/resend";

const TEST_API_SECRET = "test-api-secret";

function createRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-secret": TEST_API_SECRET,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/send-email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_SECRET = TEST_API_SECRET;
  });

  it("returns 400 when 'to' is missing", async () => {
    const req = createRequest({ type: "contact-confirmation", data: {} });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Recipient email is required");
  });

  it("returns 400 when 'type' is missing", async () => {
    const req = createRequest({ to: "test@example.com", data: {} });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Email type is required");
  });

  it("returns 400 for invalid email type", async () => {
    const req = createRequest({
      type: "non-existent-type",
      to: "test@example.com",
      data: {},
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid email type");
  });

  it("successfully sends contact-confirmation email", async () => {
    vi.mocked(resend.emails.send).mockResolvedValueOnce({
      data: { id: "email-123" },
      error: null,
    } as never);

    const req = createRequest({
      type: "contact-confirmation",
      to: "user@example.com",
      data: { name: "Jan", subject: "Test onderwerp" },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(resend.emails.send).toHaveBeenCalledOnce();
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["user@example.com"],
        subject: "We received your message - Test onderwerp",
      })
    );
  });

  it("successfully sends workshop-confirmation email", async () => {
    vi.mocked(resend.emails.send).mockResolvedValueOnce({
      data: { id: "email-456" },
      error: null,
      headers: null,
    } as never);

    const req = createRequest({
      type: "workshop-confirmation",
      to: "user@example.com",
      data: {
        name: "Piet",
        workshopId: "WS-001",
        workshops: ["Kookworkshop"],
        participantCount: 10,
        location: "Nijmegen",
        date: "2026-04-01",
        time: "14:00",
      },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["user@example.com"],
        subject: "Workshop Configuratie Bevestiging - #WS-001",
      })
    );
  });

  it("returns 500 when resend throws an error", async () => {
    vi.mocked(resend.emails.send).mockRejectedValueOnce(
      new Error("Resend API down")
    );

    const req = createRequest({
      type: "contact-confirmation",
      to: "user@example.com",
      data: { name: "Jan", subject: "Test" },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Resend API down");
  });
});
