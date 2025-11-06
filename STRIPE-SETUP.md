# Stripe Checkout Integration Setup Guide

This guide will help you configure the Stripe payment integration in your application.

## Quick Start (10 minutes)

### Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete your business profile
4. Note: You can start with **Test Mode** for development

### Step 2: Get API Keys

1. Go to [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Step 3: Configure Environment Variables

Create or update your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY_HERE"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE" # We'll get this in Step 5

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Change to your production URL when deploying
```

### Step 4: Create Products and Prices

#### Option A: Using Stripe Dashboard (Recommended for beginners)

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Click **"Add product"**
3. Create your products:

   **Starter Plan**
   - Name: "Starter Plan"
   - Description: "Perfect for getting started"
   - Pricing: $29/month (or one-time payment)
   - Copy the Price ID (starts with `price_`)

   **Pro Plan**
   - Name: "Pro Plan"
   - Description: "For growing businesses"
   - Pricing: $79/month
   - Copy the Price ID

   **Enterprise Plan**
   - Name: "Enterprise Plan"
   - Description: "For large organizations"
   - Pricing: $199/month
   - Copy the Price ID

4. Update `src/lib/stripe.ts` with your Price IDs:

```typescript
export const STRIPE_PRICES = {
  STARTER: "price_YOUR_STARTER_PRICE_ID",
  PRO: "price_YOUR_PRO_PRICE_ID",
  ENTERPRISE: "price_YOUR_ENTERPRISE_PRICE_ID",
};
```

Or add them to your `.env`:

```env
STRIPE_PRICE_STARTER="price_xxxxxxxxxxxxx"
STRIPE_PRICE_PRO="price_xxxxxxxxxxxxx"
STRIPE_PRICE_ENTERPRISE="price_xxxxxxxxxxxxx"
```

#### Option B: Using Stripe CLI (Advanced)

```bash
# Install Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/vX.XX.X/stripe_X.XX.X_linux_x86_64.tar.gz

# Create products and prices
stripe products create --name="Starter Plan" --description="Perfect for getting started"
stripe prices create --product=prod_XXXXXXXXXX --unit-amount=2900 --currency=usd --recurring='{"interval": "month"}'
```

### Step 5: Set Up Webhooks

Webhooks allow Stripe to notify your app when payments are completed.

#### For Development (Using Stripe CLI)

1. Install Stripe CLI (see Step 4B)
2. Login to your Stripe account:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```
4. Copy the **webhook signing secret** (starts with `whsec_`)
5. Add it to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"
   ```

#### For Production

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret**
7. Add it to your production environment variables

### Step 6: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. In a new terminal, start the Stripe webhook listener:

   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

3. Visit: `http://localhost:3000/pricing`

4. Click **"Get Started"** on any plan

5. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

6. Complete the checkout

7. You should be redirected to the success page

8. Check your terminal for webhook events

## Payment Modes

### One-Time Payment (Current Setup)

```typescript
// In src/app/api/checkout/route.ts
mode: "payment";
```

### Subscription (Recurring Payments)

```typescript
// Change to:
mode: "subscription";
```

## Customization

### Update Product Information

Edit `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRODUCTS = {
  STARTER: {
    name: "Your Plan Name",
    price: 29,
    priceId: STRIPE_PRICES.STARTER,
    features: [
      "Your feature 1",
      "Your feature 2",
      // ...
    ],
  },
  // ...
};
```

### Customize Success/Cancel Pages

- Success page: `src/app/checkout/success/page.tsx`
- Cancel page: `src/app/checkout/cancel/page.tsx`

### Handle Webhook Events

Edit `src/app/api/webhooks/stripe/route.ts`:

```typescript
case "checkout.session.completed": {
  const session = event.data.object

  // Update your database
  // Grant user access
  // Send confirmation email
  // etc.

  break
}
```

## Database Integration

If you're using Prisma, you might want to store payment information:

```prisma
model Order {
  id               String   @id @default(cuid())
  userId           String
  stripeSessionId  String   @unique
  status           String   // "pending", "paid", "failed"
  amount           Int
  currency         String
  productName      String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user             User     @relation(fields: [userId], references: [id])
}
```

Then update your webhook handler:

```typescript
case "checkout.session.completed": {
  const session = event.data.object

  await prisma.order.update({
    where: { stripeSessionId: session.id },
    data: { status: "paid" }
  })

  break
}
```

## Security Best Practices

### 1. Verify Webhook Signatures

✅ Already implemented in `src/app/api/webhooks/stripe/route.ts`

```typescript
event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

### 2. Use Environment Variables

✅ Never commit API keys to git
✅ Use `.env` for secrets
✅ Add `.env` to `.gitignore`

### 3. Validate Prices Server-Side

✅ Always verify prices on the server, not client

### 4. Use HTTPS in Production

⚠️ Stripe requires HTTPS for webhooks in production

## Testing

### Test Cards

Stripe provides test cards for different scenarios:

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
Expired card: 4000 0000 0000 0069
3D Secure: 4000 0025 0000 3155
```

### Test Webhooks

```bash
# Trigger test webhook
stripe trigger checkout.session.completed
```

## Troubleshooting

### "No such price" error

- Verify your Price IDs in `src/lib/stripe.ts`
- Ensure you're using test mode Price IDs in development
- Check that prices exist in your Stripe Dashboard

### Webhooks not working

- Ensure webhook secret is correct
- Check that Stripe CLI is running (`stripe listen`)
- Verify webhook endpoint URL is correct
- Check server logs for errors

### Redirect not working

- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Ensure success/cancel URLs are correct
- Check browser console for errors

### "Stripe is not loaded" error

- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check that it's a publishable key (starts with `pk_`)
- Ensure environment variables are loaded

## Going to Production

### 1. Get Production API Keys

1. Go to Stripe Dashboard
2. Toggle from **Test Mode** to **Live Mode**
3. Get your production API keys
4. Update your production environment variables

### 2. Create Production Products

1. In Live Mode, create your products and prices
2. Update Price IDs in your production environment

### 3. Configure Production Webhooks

1. Add webhook endpoint for your production URL
2. Update `STRIPE_WEBHOOK_SECRET` in production

### 4. Enable 3D Secure (Recommended)

1. Go to Stripe Dashboard → Settings → Payment methods
2. Enable 3D Secure for card payments
3. Configure Strong Customer Authentication (SCA)

### 5. Test in Production

1. Use a real card in test mode first
2. Make a small transaction (e.g., $0.50)
3. Verify webhooks are received
4. Check success/cancel pages work

## Features to Add

### Customer Portal

Allow customers to manage subscriptions:

```typescript
// Create customer portal session
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
});
```

### Coupons and Discounts

```typescript
const session = await stripe.checkout.sessions.create({
  // ...
  discounts: [
    {
      coupon: "SUMMER20", // 20% off coupon
    },
  ],
});
```

### Tax Calculation

```typescript
const session = await stripe.checkout.sessions.create({
  // ...
  automatic_tax: {
    enabled: true,
  },
});
```

### Multiple Payment Methods

```typescript
const session = await stripe.checkout.sessions.create({
  // ...
  payment_method_types: ["card", "klarna", "afterpay_clearpay"],
});
```

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Next.js Example](https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhook Events Reference](https://stripe.com/docs/api/events/types)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)

## Support

Need help?

- [Stripe Support](https://support.stripe.com)
- [Stripe Discord](https://discord.gg/stripe)
- [Stack Overflow - Stripe Tag](https://stackoverflow.com/questions/tagged/stripe-payments)
