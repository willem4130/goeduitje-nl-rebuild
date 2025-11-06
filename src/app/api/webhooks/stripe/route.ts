import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
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

        console.log("💰 Payment successful!");
        console.log("Session ID:", session.id);
        console.log("Customer email:", session.customer_email);
        console.log("Amount total:", session.amount_total);
        console.log("Metadata:", session.metadata);

        // TODO: Update your database here
        // Example: Update order status, grant access, send confirmation email
        // await prisma.order.update({
        //   where: { id: session.metadata.orderId },
        //   data: { status: "paid", stripeSessionId: session.id }
        // })

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log("💳 Payment intent succeeded!");
        console.log("Payment Intent ID:", paymentIntent.id);
        console.log("Amount:", paymentIntent.amount);

        // TODO: Handle successful payment
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.error("❌ Payment failed!");
        console.error("Payment Intent ID:", paymentIntent.id);
        console.error("Error:", paymentIntent.last_payment_error?.message);

        // TODO: Handle failed payment (notify user, update database)
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("📦 Subscription created!");
        console.log("Subscription ID:", subscription.id);
        console.log("Customer ID:", subscription.customer);

        // TODO: Grant subscription access
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("🔄 Subscription updated!");
        console.log("Subscription ID:", subscription.id);
        console.log("Status:", subscription.status);

        // TODO: Update subscription status in database
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("🗑️ Subscription cancelled!");
        console.log("Subscription ID:", subscription.id);

        // TODO: Revoke subscription access
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        console.log("📧 Invoice paid!");
        console.log("Invoice ID:", invoice.id);

        // TODO: Send invoice email
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        console.error("💸 Invoice payment failed!");
        console.error("Invoice ID:", invoice.id);

        // TODO: Notify customer of failed payment
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
