import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !webhookSecret) {
      console.error("Missing signature or webhook secret");
      return NextResponse.json(
        { error: "Webhook signature or secret missing" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      console.error("Webhook signature verification failed");
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        console.log("💰 Payment successful!");

        try {
          await prisma.booking.create({
            data: {
              stripeSessionId: session.id,
              stripePaymentId: (session.payment_intent as string) || null,
              firstName: metadata.firstName || "",
              lastName: metadata.lastName || "",
              email: session.customer_email || metadata.email || "",
              numberOfPeople: parseInt(metadata.numberOfPeople || "1"),
              workshopId: metadata.workshopId || null,
              workshopDate: metadata.workshopDate || null,
              sessionId: metadata.sessionId || null,
              dietaryRequirement: metadata.dietaryRequirement || null,
              allergies: metadata.allergies || null,
              hasGiftCard: metadata.hasGiftCard === "true",
              giftCardId: metadata.giftCardId || null,
              giftCardValue: metadata.giftCardValue
                ? parseFloat(metadata.giftCardValue)
                : null,
              totalPrice: parseFloat(metadata.totalPrice || "0"),
              remainingAmount: parseFloat(metadata.remainingAmount || "0"),
              amountPaid: session.amount_total
                ? session.amount_total / 100
                : null,
              currency: session.currency || "eur",
              paymentMethod: "stripe",
              paymentStatus: "paid",
            },
          });
          console.log("✅ Booking saved to database");
        } catch {
          console.error("❌ Failed to save booking to database");
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        console.log("⏰ Checkout session expired");

        try {
          await prisma.booking.create({
            data: {
              stripeSessionId: session.id,
              stripePaymentId: null,
              firstName: metadata.firstName || "",
              lastName: metadata.lastName || "",
              email: session.customer_email || metadata.email || "",
              numberOfPeople: parseInt(metadata.numberOfPeople || "1"),
              workshopId: metadata.workshopId || null,
              workshopDate: metadata.workshopDate || null,
              sessionId: metadata.sessionId || null,
              dietaryRequirement: metadata.dietaryRequirement || null,
              allergies: metadata.allergies || null,
              hasGiftCard: metadata.hasGiftCard === "true",
              giftCardId: metadata.giftCardId || null,
              giftCardValue: metadata.giftCardValue
                ? parseFloat(metadata.giftCardValue)
                : null,
              totalPrice: parseFloat(metadata.totalPrice || "0"),
              remainingAmount: parseFloat(metadata.remainingAmount || "0"),
              amountPaid: null,
              currency: session.currency || "eur",
              paymentMethod: "stripe",
              paymentStatus: "failed",
            },
          });
          console.log("✅ Expired booking saved to database");
        } catch {
          console.error("❌ Failed to save expired booking to database");
        }

        break;
      }

      case "payment_intent.succeeded": {
        console.log("💳 Payment intent succeeded");
        break;
      }

      case "payment_intent.payment_failed": {
        console.error("❌ Payment intent failed");
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch {
    console.error("Error processing webhook");
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
