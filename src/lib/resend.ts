import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email - Update this to your verified domain
export const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

// Support/reply-to email
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@example.com";
