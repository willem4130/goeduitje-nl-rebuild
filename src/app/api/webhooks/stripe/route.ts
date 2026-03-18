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
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
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
        console.log("Session ID:", session.id);
        console.log("Customer email:", session.customer_email);
        console.log("Amount total:", session.amount_total);
        console.log("Metadata:", metadata);

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
          console.log("✅ Booking saved to database for session:", session.id);
        } catch (dbError) {
          console.error("❌ Failed to save booking to database:", dbError);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        console.log("⏰ Checkout session expired:", session.id);

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
          console.log(
            "✅ Failed booking saved to database for expired session:",
            session.id
          );
        } catch (dbError) {
          console.error(
            "❌ Failed to save expired booking to database:",
            dbError
          );
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          "💳 Payment intent succeeded:",
          paymentIntent.id,
          "Amount:",
          paymentIntent.amount
        );
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(
          "❌ Payment failed:",
          paymentIntent.id,
          "Error:",
          paymentIntent.last_payment_error?.message
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
