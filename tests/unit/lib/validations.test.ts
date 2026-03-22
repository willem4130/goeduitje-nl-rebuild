import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  contactFormSchema,
  workshopConfigSchema,
  newsletterSchema,
  userFormSchema,
} from "@/lib/validations/forms";

describe("contactFormSchema", () => {
  const valid = {
    voornaam: "Jan",
    achternaam: "Jansen",
    email: "jan@test.nl",
    bericht: "Dit is een test bericht",
  };

  it("accepts valid data", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid voornaam (1 char)", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, voornaam: "J" }).success
    ).toBe(false);
  });

  it("rejects invalid achternaam (1 char)", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, achternaam: "J" }).success
    ).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, email: "notanemail" }).success
    ).toBe(false);
  });

  it("rejects short bericht (5 chars)", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, bericht: "Hello" }).success
    ).toBe(false);
  });
});

describe("workshopConfigSchema", () => {
  const validZakelijk = {
    type: "zakelijk" as const,
    participantCount: 10,
    workshops: ["kookworkshop"],
    location: "Nijmegen" as const,
    date: "2026-06-01",
    dateTbd: false,
    time: "14:00",
    timeTbd: false,
    duration: 2,
    companyName: "Test BV",
    btwNumber: "",
    name: "Jan",
    email: "jan@test.nl",
    phone: "0612345678",
  };

  it("accepts valid zakelijk data", () => {
    expect(workshopConfigSchema.safeParse(validZakelijk).success).toBe(true);
  });

  it("accepts valid particulier data (no companyName needed)", () => {
    const { companyName, btwNumber, ...rest } = validZakelijk;
    expect(
      workshopConfigSchema.safeParse({ ...rest, type: "particulier" }).success
    ).toBe(true);
  });

  it("dateTbd: true → date not required", () => {
    const { date, ...rest } = validZakelijk;
    expect(
      workshopConfigSchema.safeParse({ ...rest, dateTbd: true }).success
    ).toBe(true);
  });

  it("timeTbd: true → time not required", () => {
    const { time, ...rest } = validZakelijk;
    expect(
      workshopConfigSchema.safeParse({ ...rest, timeTbd: true }).success
    ).toBe(true);
  });

  it("type: zakelijk without companyName → fails", () => {
    const { companyName, ...rest } = validZakelijk;
    const result = workshopConfigSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('location: "other" without customCity → fails', () => {
    const result = workshopConfigSchema.safeParse({
      ...validZakelijk,
      location: "other",
    });
    expect(result.success).toBe(false);
  });

  it("dateTbd: false without date → fails", () => {
    const { date, ...rest } = validZakelijk;
    const result = workshopConfigSchema.safeParse({ ...rest, dateTbd: false });
    expect(result.success).toBe(false);
  });

  it("empty workshops array → fails", () => {
    expect(
      workshopConfigSchema.safeParse({ ...validZakelijk, workshops: [] })
        .success
    ).toBe(false);
  });

  it("participantCount: 0 → fails", () => {
    expect(
      workshopConfigSchema.safeParse({
        ...validZakelijk,
        participantCount: 0,
      }).success
    ).toBe(false);
  });

  it("participantCount: 101 → fails", () => {
    expect(
      workshopConfigSchema.safeParse({
        ...validZakelijk,
        participantCount: 101,
      }).success
    ).toBe(false);
  });

  it("phone with 5 chars → fails", () => {
    expect(
      workshopConfigSchema.safeParse({ ...validZakelijk, phone: "06123" })
        .success
    ).toBe(false);
  });

  it("invalid email → fails", () => {
    expect(
      workshopConfigSchema.safeParse({ ...validZakelijk, email: "bad" })
        .success
    ).toBe(false);
  });

  it("accepts zakelijk type with companyName and btwNumber", () => {
    const data = {
      ...validZakelijk,
      type: "zakelijk" as const,
      companyName: "Test BV",
      btwNumber: "NL123",
    };
    expect(workshopConfigSchema.safeParse(data).success).toBe(true);
  });

  it("requires companyName when type is zakelijk", () => {
    const { companyName, ...rest } = validZakelijk;
    const result = workshopConfigSchema.safeParse({
      ...rest,
      type: "zakelijk",
      companyName: "",
    });
    expect(result.success).toBe(false);
  });

  it("does not require companyName when type is particulier", () => {
    const { companyName, btwNumber, ...rest } = validZakelijk;
    const result = workshopConfigSchema.safeParse({
      ...rest,
      type: "particulier",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional btwNumber for zakelijk", () => {
    const { btwNumber, ...rest } = validZakelijk;
    const result = workshopConfigSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });
});

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    expect(
      newsletterSchema.safeParse({ email: "test@example.com" }).success
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "notvalid" }).success).toBe(
      false
    );
  });
});

describe("userFormSchema", () => {
  const valid = {
    name: "Jan Jansen",
    email: "jan@test.nl",
    role: "admin" as const,
  };

  it("accepts valid data", () => {
    expect(userFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short name", () => {
    expect(userFormSchema.safeParse({ ...valid, name: "J" }).success).toBe(
      false
    );
  });

  it("rejects invalid email", () => {
    expect(
      userFormSchema.safeParse({ ...valid, email: "bad" }).success
    ).toBe(false);
  });

  it("rejects invalid role", () => {
    expect(
      userFormSchema.safeParse({ ...valid, role: "superadmin" }).success
    ).toBe(false);
  });
});

describe("feedbackSubmitSchema (mirrors feedback router input)", () => {
  // Mirror the schema from src/server/api/routers/feedback.ts
  const submitFeedbackSchema = z.object({
    name: z.string().min(2, "Naam moet minimaal 2 karakters zijn"),
    email: z.string().email("Ongeldig e-mailadres"),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, "Bericht moet minimaal 10 karakters zijn"),
    rating: z.number().min(1).max(5).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    eventDate: z.string().optional(),
    eventLocation: z.string().optional(),
    whatWasBest: z.string().optional(),
    whatToImprove: z.string().optional(),
  });

  it("accepts structured fields", () => {
    const result = submitFeedbackSchema.safeParse({
      name: "Jan Jansen",
      email: "jan@test.nl",
      message: "Geweldige ervaring, echt top!",
      rating: 5,
      firstName: "Jan",
      lastName: "Jansen",
      eventDate: "2026-03-15",
      eventLocation: "Nijmegen",
      whatWasBest: "De kookworkshop was fantastisch",
      whatToImprove: "Niets, alles was perfect",
    });
    expect(result.success).toBe(true);
  });

  it("works without structured fields (backward compat)", () => {
    const result = submitFeedbackSchema.safeParse({
      name: "Jan Jansen",
      email: "jan@test.nl",
      message: "Dit is een test bericht voor feedback.",
    });
    expect(result.success).toBe(true);
  });
});
