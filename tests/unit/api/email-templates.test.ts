import { describe, it, expect, vi } from "vitest";
import { existsSync } from "fs";
import { join } from "path";

describe("Email template files", () => {
  const emailDir = join(process.cwd(), "src/emails");

  it("booking-confirmation.tsx exists", () => {
    expect(existsSync(join(emailDir, "booking-confirmation.tsx"))).toBe(true);
  });

  it("contact-confirmation.tsx exists", () => {
    expect(existsSync(join(emailDir, "contact-confirmation.tsx"))).toBe(true);
  });

  it("workshop-confirmation.tsx exists", () => {
    expect(existsSync(join(emailDir, "workshop-confirmation.tsx"))).toBe(true);
  });
});

describe("Email template exports", () => {
  it("booking-confirmation exports BookingConfirmationEmail", async () => {
    const mod = await vi.importActual<any>("@/emails/booking-confirmation");
    expect(mod.BookingConfirmationEmail).toBeDefined();
    expect(typeof mod.BookingConfirmationEmail).toBe("function");
  });

  it("BookingConfirmationEmail accepts required props", async () => {
    const mod = await vi.importActual<any>("@/emails/booking-confirmation");
    const result = mod.BookingConfirmationEmail({
      firstName: "Jan",
      lastName: "Jansen",
      workshopDate: "15 april 2026",
      numberOfPeople: 4,
      totalPrice: 200,
      paymentMethod: "gift_card",
      location: "Nijmegen",
    });
    expect(result).toBeTruthy();
  });

  it("WorkshopConfirmationEmail accepts new company props", async () => {
    const mod = await vi.importActual<any>("@/emails/workshop-confirmation");
    const result = mod.WorkshopConfirmationEmail({
      name: "Jan",
      workshopId: "WS-001",
      workshops: ["Kookworkshop"],
      participantCount: 10,
      location: "Nijmegen",
      date: "2026-04-01",
      time: "14:00",
      type: "zakelijk",
      companyName: "Test BV",
      btwNumber: "NL123",
      phone: "0612345678",
    });
    expect(result).toBeTruthy();
  });

  it("ContactConfirmationEmail accepts message prop", async () => {
    const mod = await vi.importActual<any>("@/emails/contact-confirmation");
    const result = mod.ContactConfirmationEmail({
      name: "Jan",
      subject: "Test",
      message: "Dit is een test bericht",
    });
    expect(result).toBeTruthy();
  });
});
