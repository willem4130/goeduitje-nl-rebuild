import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation";

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

describe("Email system — DB template loading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_SECRET = TEST_API_SECRET;
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: { id: "test-id" },
      error: null,
    } as any);
    vi.mocked(prisma.emailLog.create).mockResolvedValue({} as any);
  });

  it("uses DB template when it exists and isActive", async () => {
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue({
      subject: "Hallo {name}!",
      body: "<p>Welkom {name}, je workshops: {workshops}</p>",
      isActive: true,
    } as any);

    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "contact-confirmation",
        data: { name: "Jan", workshops: ["kookworkshop", "stadsspel"] },
      })
    );

    expect(res.status).toBe(200);
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["user@example.com"],
        subject: "Hallo Jan!",
        html: expect.stringContaining(
          "Welkom Jan, je workshops: kookworkshop, stadsspel"
        ),
      })
    );
    // Should NOT have react prop when using DB template
    expect(resend.emails.send).not.toHaveBeenCalledWith(
      expect.objectContaining({ react: expect.anything() })
    );
  });

  it("falls back to React templates when no DB template exists", async () => {
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue(null);

    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "contact-confirmation",
        data: { name: "Jan", subject: "Test" },
      })
    );

    expect(res.status).toBe(200);
    // React template path: sends with react prop (not html)
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Bedankt voor je bericht - Test",
      })
    );
    // Should NOT have html prop (that's the DB template path)
    const callArgs = vi.mocked(resend.emails.send).mock
      .calls[0]![0] as unknown as Record<string, unknown>;
    expect(callArgs).toHaveProperty("react");
    expect(callArgs).not.toHaveProperty("html");
  });

  it("falls back to React templates when DB template exists but isActive is false", async () => {
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue({
      subject: "DB Subject",
      body: "<p>DB Body</p>",
      isActive: false,
    } as any);

    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "welcome",
        data: { name: "Jan", dashboardUrl: "https://example.com" },
      })
    );

    expect(res.status).toBe(200);
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Welcome aboard! 🎉",
      })
    );
  });
});

describe("Email system — email logging", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_SECRET = TEST_API_SECRET;
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.emailLog.create).mockResolvedValue({} as any);
  });

  it("logs a sent email to EmailLog", async () => {
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: { id: "test-id" },
      error: null,
    } as any);

    await POST(
      createRequest({
        to: "user@example.com",
        type: "contact-confirmation",
        data: { name: "Jan", subject: "Hoi" },
      })
    );

    expect(prisma.emailLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        templateKey: "contact-confirmation",
        to: "user@example.com",
        subject: "Bedankt voor je bericht - Hoi",
        status: "sent",
      }),
    });
  });

  it("logs with status 'failed' and errorMessage when resend fails (DB template path)", async () => {
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue({
      subject: "Test {name}",
      body: "<p>Hi {name}</p>",
      isActive: true,
    } as any);
    vi.mocked(resend.emails.send).mockRejectedValue(
      new Error("Resend rate limit exceeded")
    );

    const res = await POST(
      createRequest({
        to: "user@example.com",
        type: "welcome",
        data: { name: "Jan" },
      })
    );

    expect(res.status).toBe(500);
    expect(prisma.emailLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        templateKey: "welcome",
        to: "user@example.com",
        status: "failed",
        errorMessage: "Resend rate limit exceeded",
      }),
    });
  });
});

describe("Email system — booking-confirmation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_SECRET = TEST_API_SECRET;
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.emailLog.create).mockResolvedValue({} as any);
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: { id: "test-id" },
      error: null,
    } as any);
  });

  it("sends booking-confirmation with correct subject", async () => {
    const res = await POST(
      createRequest({
        to: "boeker@example.com",
        type: "booking-confirmation",
        data: {
          firstName: "Jan",
          lastName: "Jansen",
          workshopDate: "2025-07-01",
          numberOfPeople: 4,
          totalPrice: 240,
          paymentMethod: "stripe",
          location: "Nijmegen",
        },
      })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["boeker@example.com"],
        subject: "Boeking Bevestigd - Open Kookworkshop",
      })
    );
  });

  it("passes correct props to BookingConfirmationEmail", async () => {
    const data = {
      firstName: "Fatima",
      lastName: "El-Amin",
      workshopDate: "2025-08-15",
      numberOfPeople: 6,
      totalPrice: 360,
      paymentMethod: "gift_card",
      giftCardId: "GC-001",
      location: "Arnhem",
      dietaryRequirement: "Halal",
      allergies: "Noten",
    };

    await POST(
      createRequest({
        to: "fatima@example.com",
        type: "booking-confirmation",
        data,
      })
    );

    expect(BookingConfirmationEmail).toHaveBeenCalledWith({
      firstName: "Fatima",
      lastName: "El-Amin",
      workshopDate: "2025-08-15",
      numberOfPeople: 6,
      totalPrice: 360,
      paymentMethod: "gift_card",
      giftCardId: "GC-001",
      location: "Arnhem",
      dietaryRequirement: "Halal",
      allergies: "Noten",
    });
  });

  it("logs booking-confirmation email to EmailLog", async () => {
    await POST(
      createRequest({
        to: "boeker@example.com",
        type: "booking-confirmation",
        data: {
          firstName: "Jan",
          lastName: "Jansen",
          workshopDate: "2025-07-01",
          numberOfPeople: 4,
          totalPrice: 240,
          paymentMethod: "stripe",
          location: "Nijmegen",
        },
      })
    );

    expect(prisma.emailLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        templateKey: "booking-confirmation",
        to: "boeker@example.com",
        subject: "Boeking Bevestigd - Open Kookworkshop",
        status: "sent",
      }),
    });
  });
});

describe("Email system — variable replacement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_SECRET = TEST_API_SECRET;
    vi.mocked(prisma.emailLog.create).mockResolvedValue({} as any);
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: { id: "test-id" },
      error: null,
    } as any);
  });

  it("replaces {name} with actual name in DB template", async () => {
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue({
      subject: "Hoi {name}",
      body: "<p>Beste {name}, bedankt!</p>",
      isActive: true,
    } as any);

    await POST(
      createRequest({
        to: "user@example.com",
        type: "welcome",
        data: { name: "Fatima" },
      })
    );

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Hoi Fatima",
        html: expect.stringContaining("Beste Fatima, bedankt!"),
      })
    );
  });

  it("replaces {workshops} array with comma-separated string", async () => {
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue({
      subject: "Bevestiging",
      body: "<p>Je uitjes: {workshops}</p>",
      isActive: true,
    } as any);

    await POST(
      createRequest({
        to: "user@example.com",
        type: "workshop-confirmation",
        data: { workshops: ["kookworkshop", "stadsspel", "buffet"] },
      })
    );

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining(
          "Je uitjes: kookworkshop, stadsspel, buffet"
        ),
      })
    );
  });

  it("replaces missing/null variables with empty string", async () => {
    vi.mocked(prisma.emailTemplate.findUnique).mockResolvedValue({
      subject: "Hoi {name}",
      body: "<p>Bedrijf: {companyName}, BTW: {btwNumber}</p>",
      isActive: true,
    } as any);

    await POST(
      createRequest({
        to: "user@example.com",
        type: "workshop-confirmation",
        data: { name: "Jan", companyName: null },
      })
    );

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Hoi Jan",
        html: expect.stringContaining("Bedrijf: , BTW: "),
      })
    );
  });
});
