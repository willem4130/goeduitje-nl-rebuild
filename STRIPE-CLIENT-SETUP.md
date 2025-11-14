# Stripe Setup Instructions for Client

## Step 1: Client Creates Stripe Account

**Send these instructions to your client (Goeduitje):**

1. Go to https://stripe.com
2. Click "Sign up"
3. Complete registration with:
   - Business name: Goeduitje
   - Business email
   - Password
4. Verify email address
5. Complete business profile

## Step 2: Client Connects Bank Account

**Client needs to:**

1. Go to https://dashboard.stripe.com/settings/payouts
2. Click "Add bank account"
3. Enter their Dutch bank details:
   - IBAN
   - Account holder name
   - Bank name
4. Verify the micro-deposits (Stripe will send small amounts to verify)

## Step 3: Client Creates Product & Price

**Client needs to create the workshop product:**

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Fill in:
   - **Name**: Open Kookworkshop
   - **Description**: Deelname aan een open kookworkshop in Nijmegen. Inclusief ingrediënten, recepten en persoonlijke begeleiding.
   - **Price**: €50.00
   - **Currency**: EUR
   - **One time payment** (not recurring)
4. Click "Save product"
5. **COPY THE PRICE ID** (starts with `price_...`)

## Step 4: Client Gets API Keys

**Client needs to provide you with:**

1. Go to https://dashboard.stripe.com/test/apikeys
2. Make sure they're in **TEST MODE** (toggle top right)
3. Copy these keys:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`) - click "Reveal test key"

## Step 5: You Update .env File

**When you receive the keys from client:**

Update `/Users/willemvandenberg/Goeduitjeweb/goeduitje-nl-rebuild/.env`:

```env
# Stripe - Client's Keys
STRIPE_SECRET_KEY="sk_test_[KEY_FROM_CLIENT]"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_[KEY_FROM_CLIENT]"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"  # Get this later when setting up webhooks
STRIPE_PRICE_COOKING_WORKSHOP="price_[PRICE_ID_FROM_STEP_3]"
NEXT_PUBLIC_STRIPE_PRICE_COOKING_WORKSHOP="price_[PRICE_ID_FROM_STEP_3]"
```

## Step 6: Test the Integration

1. Restart your dev server: `bun run dev`
2. Visit http://localhost:3099/booking
3. Fill in the form
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete the checkout
6. Verify payment appears in client's Stripe dashboard

## Step 7: Go Live (When Ready)

**After testing, client needs to:**

1. Complete Stripe account activation
2. Switch to **LIVE MODE**
3. Get LIVE API keys from https://dashboard.stripe.com/apikeys
4. Send you the LIVE keys
5. You update .env with LIVE keys for production deployment

---

## Security Reminders

✅ Never commit .env to git (already gitignored)
✅ Keep API keys secure
✅ Each client = separate Stripe account
✅ Client owns all payment data
