import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { ContactConfirmationEmail } from "@/emails/contact-confirmation";
import { WelcomeEmail } from "@/emails/welcome";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { WorkshopConfirmationEmail } from "@/emails/workshop-confirmation";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation";
import { render } from "@react-email/render";

/**
 * Replace {variable} placeholders in a string with actual values.
 */
function replaceVariables(
  template: string,
  data: Record<string, unknown>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = data[key];
    if (value === undefined || value === null) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  });
}

/**
 * Wrap HTML body in a basic email layout for DB-driven templates.
 */
function wrapInEmailLayout(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;margin:0;padding:0;">
  <div style="background-color:#ffffff;margin:0 auto;max-width:600px;padding:20px 48px 48px;margin-bottom:64px;">
    ${body}
  </div>
</body>
</html>`;
}

/**
 * Log an email send attempt to the database.
 */
async function logEmail(
  templateKey: string,
  to: string,
  subject: string,
  body: string,
  variables: Record<string, unknown> | object,
  status: "sent" | "failed",
  errorMessage?: string
) {
  try {
    await prisma.emailLog.create({
      data: {
        templateKey,
        to,
        subject,
        body,
        variables: variables as Record<string, string>,
        status,
        errorMessage: errorMessage || null,
      },
    });
  } catch (err) {
    console.error("Failed to log email:", err);
  }
}

export async function POST(req: NextRequest) {
  // Shared-secret authorization check
  const apiSecret = process.env.API_SECRET;
  if (!apiSecret) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 401 }
    );
  }
  const providedSecret = req.headers.get("x-api-secret");
  if (providedSecret !== apiSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, to, data } = body;

    if (!to) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Email type is required" },
        { status: 400 }
      );
    }

    // Try to load a DB template for this email type
    let dbTemplate: {
      subject: string;
      body: string;
      isActive: boolean;
    } | null = null;
    try {
      dbTemplate = await prisma.emailTemplate.findUnique({
        where: { key: type },
        select: { subject: true, body: true, isActive: true },
      });
    } catch {
      // DB unavailable — fall through to React templates
    }

    let emailData;

    // If a DB template exists and is active, use it
    if (dbTemplate && dbTemplate.isActive) {
      const resolvedSubject = replaceVariables(dbTemplate.subject, data);
      const resolvedBody = replaceVariables(dbTemplate.body, data);
      const htmlBody = wrapInEmailLayout(resolvedBody);

      try {
        emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: [to],
          subject: resolvedSubject,
          html: htmlBody,
        });
        await logEmail(type, to, resolvedSubject, resolvedBody, data, "sent");
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Unknown send error";
        await logEmail(
          type,
          to,
          resolvedSubject,
          resolvedBody,
          data,
          "failed",
          errMsg
        );
        throw err;
      }
    } else {
      // Fall back to hardcoded React email templates
      switch (type) {
        case "contact-confirmation": {
          const subject = `Bedankt voor je bericht - ${data.subject || "Contact"}`;
          const component = ContactConfirmationEmail({
            name: data.name,
            subject: data.subject,
            message: data.message,
          });
          emailData = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject,
            react: component,
          });
          const html = await render(component);
          await logEmail(type, to, subject, html, data, "sent");
          break;
        }

        case "welcome":
          emailData = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: "Welcome aboard! 🎉",
            react: WelcomeEmail({
              name: data.name,
              dashboardUrl: data.dashboardUrl,
            }),
          });
          await logEmail(type, to, "Welcome aboard!", "", data, "sent");
          break;

        case "order-confirmation":
          emailData = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `Order Confirmed - #${data.orderNumber}`,
            react: OrderConfirmationEmail({
              name: data.name,
              orderNumber: data.orderNumber,
              amount: data.amount,
              productName: data.productName,
              receiptUrl: data.receiptUrl,
            }),
          });
          await logEmail(
            type,
            to,
            `Order Confirmed - #${data.orderNumber}`,
            "",
            data,
            "sent"
          );
          break;

        case "workshop-confirmation": {
          const subject = `Uitje Configuratie Bevestiging - #${data.workshopId}`;
          const component = WorkshopConfirmationEmail({
            name: data.name,
            workshopId: data.workshopId,
            workshops: data.workshops,
            participantCount: data.participantCount,
            location: data.location,
            date: data.date,
            time: data.time,
            duration: data.duration,
            type: data.type,
            companyName: data.companyName,
            btwNumber: data.btwNumber,
            phone: data.phone,
            selectedVariants: data.selectedVariants,
          });
          emailData = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject,
            react: component,
          });
          const html = await render(component);
          await logEmail(type, to, subject, html, data, "sent");
          break;
        }

        case "booking-confirmation": {
          const subject = "Boeking Bevestigd - Open Kookworkshop";
          const component = BookingConfirmationEmail({
            firstName: data.firstName,
            lastName: data.lastName,
            workshopDate: data.workshopDate,
            numberOfPeople: data.numberOfPeople,
            totalPrice: data.totalPrice,
            paymentMethod: data.paymentMethod,
            giftCardId: data.giftCardId,
            location: data.location,
            dietaryRequirement: data.dietaryRequirement,
            allergies: data.allergies,
          });
          emailData = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject,
            react: component,
          });
          const html = await render(component);
          await logEmail(type, to, subject, html, data, "sent");
          break;
        }

        default:
          return NextResponse.json(
            { error: "Invalid email type" },
            { status: 400 }
          );
      }
    }

    return NextResponse.json({ success: true, data: emailData });
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
