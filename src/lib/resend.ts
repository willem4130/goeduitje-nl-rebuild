import { Resend } from "resend";

// Lazy initialization to avoid build-time errors when RESEND_API_KEY is not set
let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// Legacy export for backwards compatibility - will be null if not configured
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : (null as unknown as Resend);

// Default sender email - Update this to your verified domain
export const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

// Support/reply-to email
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@example.com";
