import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { ContactConfirmationEmail } from "@/emails/contact-confirmation";
import { WelcomeEmail } from "@/emails/welcome";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { WorkshopConfirmationEmail } from "@/emails/workshop-confirmation";

export async function POST(req: NextRequest) {
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

    let emailData;

    switch (type) {
      case "contact-confirmation":
        emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: [to],
          subject: `We received your message - ${data.subject}`,
          react: ContactConfirmationEmail({
            name: data.name,
            subject: data.subject,
          }),
        });
        break;

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
        break;

      case "workshop-confirmation":
        emailData = await resend.emails.send({
          from: FROM_EMAIL,
          to: [to],
          subject: `Workshop Configuratie Bevestiging - #${data.workshopId}`,
          react: WorkshopConfirmationEmail({
            name: data.name,
            workshopId: data.workshopId,
            workshops: data.workshops,
            participantCount: data.participantCount,
            location: data.location,
            date: data.date,
            time: data.time,
          }),
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: emailData });
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
