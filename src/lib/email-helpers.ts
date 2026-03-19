/**
 * Email helper functions for sending different types of emails
 * These are client-safe wrappers that call the API route
 */

interface SendEmailParams {
  type: string;
  to: string;
  data: Record<string, unknown>;
}

export async function sendEmail({ type, to, data }: SendEmailParams) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-secret": process.env.NEXT_PUBLIC_API_SECRET ?? "",
    },
    body: JSON.stringify({ type, to, data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send email");
  }

  return response.json();
}

export async function sendContactConfirmation(
  email: string,
  name: string,
  subject: string
) {
  return sendEmail({
    type: "contact-confirmation",
    to: email,
    data: { name, subject },
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  dashboardUrl?: string
) {
  return sendEmail({
    type: "welcome",
    to: email,
    data: { name, dashboardUrl },
  });
}

export async function sendOrderConfirmation(
  email: string,
  data: {
    name: string;
    orderNumber: string;
    amount: string;
    productName: string;
    receiptUrl?: string;
  }
) {
  return sendEmail({
    type: "order-confirmation",
    to: email,
    data,
  });
}
