# Email System Setup Guide (Resend + react-email)

This guide will help you configure the Resend email system with beautiful react-email templates.

## Quick Start (5 minutes)

### Step 1: Create Resend Account

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email or GitHub account
3. Verify your email address
4. **Note**: Free plan includes 100 emails/day and 3,000 emails/month

### Step 2: Get API Key

1. Go to [Resend Dashboard → API Keys](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Give it a name (e.g., "Development" or "Production")
4. Select permissions: **Full Access** (recommended)
5. Copy your API key (starts with `re_`)

### Step 3: Configure Environment Variables

Add to your `.env` file:

```env
# Resend API Key
RESEND_API_KEY="re_YOUR_API_KEY_HERE"

# Email addresses
FROM_EMAIL="onboarding@resend.dev"  # Use this for testing
SUPPORT_EMAIL="support@example.com"
```

### Step 4: Test Email System

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/contact`

3. Fill out the contact form with your email

4. Submit the form

5. Check your inbox for the confirmation email!

**That's it!** Your email system is now working with the test domain `onboarding@resend.dev`.

---

## Domain Verification (For Production)

To send emails from your own domain (e.g., `hello@yourcompany.com`):

### Step 1: Add Your Domain

1. Go to [Resend Dashboard → Domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourcompany.com`)
4. Click **"Add"**

### Step 2: Configure DNS Records

Resend will provide DNS records to add to your domain:

1. **SPF Record** (TXT)

   ```
   Name: @
   Value: v=spf1 include:amazonses.com ~all
   ```

2. **DKIM Records** (TXT)

   ```
   Name: resend._domainkey
   Value: [provided by Resend]
   ```

3. **DMARC Record** (TXT) - Optional but recommended
   ```
   Name: _dmarc
   Value: v=DMARC1; p=none
   ```

### Step 3: Wait for Verification

- DNS changes can take 24-48 hours to propagate
- Resend will automatically verify when records are detected
- You'll receive an email when verification is complete

### Step 4: Update Environment Variable

```env
FROM_EMAIL="hello@yourcompany.com"
```

---

## Email Templates

We've included 3 pre-built templates:

### 1. Contact Confirmation

Sent when someone submits the contact form.

**Location**: `emails/contact-confirmation.tsx`

**Usage**:

```typescript
await sendContactConfirmation(
  "user@example.com",
  "John Doe",
  "Question about pricing"
);
```

### 2. Welcome Email

Sent when a new user signs up.

**Location**: `emails/welcome.tsx`

**Usage**:

```typescript
await sendWelcomeEmail(
  "user@example.com",
  "John Doe",
  "https://yourapp.com/dashboard"
);
```

### 3. Order Confirmation

Sent after a successful purchase.

**Location**: `emails/order-confirmation.tsx`

**Usage**:

```typescript
await sendOrderConfirmation("user@example.com", {
  name: "John Doe",
  orderNumber: "123456",
  amount: "$99.00",
  productName: "Pro Plan",
  receiptUrl: "https://yourapp.com/receipts/123456",
});
```

---

## Creating Custom Email Templates

### Step 1: Create Template File

Create a new file in the `emails/` directory:

```tsx
// emails/password-reset.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  name,
  resetLink,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={heading}>Password Reset Request</Heading>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            We received a request to reset your password. Click the button below
            to create a new password.
          </Text>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
          <Text style={paragraph}>
            This link will expire in 1 hour. If you didn't request this, you can
            safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

// Styles...
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#484848",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};
```

### Step 2: Add to API Route

Update `src/app/api/send-email/route.ts`:

```typescript
import { PasswordResetEmail } from "../../../../emails/password-reset"

// Inside the POST handler, add a new case:
case "password-reset":
  emailData = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: "Reset your password",
    react: PasswordResetEmail({
      name: data.name,
      resetLink: data.resetLink,
    }),
  })
  break
```

### Step 3: Create Helper Function

Update `src/lib/email-helpers.ts`:

```typescript
export async function sendPasswordReset(
  email: string,
  name: string,
  resetLink: string
) {
  return sendEmail({
    type: "password-reset",
    to: email,
    data: { name, resetLink },
  });
}
```

### Step 4: Use in Your App

```typescript
await sendPasswordReset(
  user.email,
  user.name,
  `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
);
```

---

## Preview Emails Locally

react-email provides a development server to preview your emails:

### Install react-email CLI (Optional)

```bash
npm install -D react-email
```

### Add Script to package.json

```json
{
  "scripts": {
    "email": "email dev"
  }
}
```

### Run Preview Server

```bash
npm run email
```

Visit `http://localhost:3000` to see all your email templates with live reload!

---

## Integration Examples

### With Stripe Webhooks

Update `src/app/api/webhooks/stripe/route.ts`:

```typescript
import { sendOrderConfirmation } from "@/lib/email-helpers"

case "checkout.session.completed": {
  const session = event.data.object

  // Send order confirmation email
  await sendOrderConfirmation(session.customer_email || "", {
    name: session.customer_details?.name || "Customer",
    orderNumber: session.id,
    amount: `$${(session.amount_total || 0) / 100}`,
    productName: "Your Product",
    receiptUrl: session.receipt_url || undefined,
  })

  break
}
```

### With User Registration

```typescript
// After creating user in database
await sendWelcomeEmail(
  newUser.email,
  newUser.name,
  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
);
```

### With Booking Confirmation

```typescript
// After Cal.com booking
await sendEmail({
  type: "booking-confirmation",
  to: booking.email,
  data: {
    name: booking.name,
    date: booking.date,
    time: booking.time,
    meetingLink: booking.meetingLink,
  },
});
```

---

## Email Components

react-email provides many components for building emails:

### Common Components

```tsx
import {
  Body, // Email body wrapper
  Button, // Clickable button
  Container, // Center content container
  Head, // Email head for metadata
  Heading, // H1-H6 headings
  Hr, // Horizontal rule
  Html, // Root HTML wrapper
  Img, // Images
  Link, // Hyperlinks
  Preview, // Email preview text
  Section, // Content sections
  Text, // Paragraphs
} from "@react-email/components";
```

### Advanced Components

```tsx
import {
  Column, // Table column
  Row, // Table row
  Code, // Code blocks
  Font, // Custom fonts
  Markdown, // Render markdown
  Tailwind, // Tailwind CSS support
} from "@react-email/components";
```

---

## Styling Best Practices

### Inline Styles (Recommended)

```tsx
const styles = {
  container: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
  },
}

<Container style={styles.container}>
  <Heading style={styles.heading}>Hello World</Heading>
</Container>
```

### Tailwind CSS (Experimental)

```tsx
import { Tailwind } from "@react-email/components";

<Tailwind>
  <div className="rounded-lg bg-white p-6">
    <h1 className="text-2xl font-bold">Hello World</h1>
  </div>
</Tailwind>;
```

---

## Testing

### Send Test Email

Create a test route:

```typescript
// src/app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email-helpers";

export async function GET() {
  try {
    await sendWelcomeEmail(
      "your-email@example.com",
      "Test User",
      "https://example.com/dashboard"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

Visit: `http://localhost:3000/api/test-email`

---

## Troubleshooting

### Emails Not Sending

1. **Check API Key**
   - Verify `RESEND_API_KEY` is set correctly
   - Ensure no extra spaces or quotes

2. **Check From Email**
   - Must use `onboarding@resend.dev` for testing
   - Or use a verified domain in production

3. **Check Logs**
   - Look at server console for errors
   - Check Resend Dashboard → Logs

### Emails in Spam

1. **Verify Domain** (Production only)
   - Add SPF, DKIM, DMARC records
   - Wait for DNS propagation

2. **Avoid Spam Triggers**
   - Don't use ALL CAPS in subject
   - Include unsubscribe link
   - Use proper from name

3. **Warm Up Domain**
   - Start with small volume
   - Gradually increase

### Emails Not Received

1. **Check Spam/Junk Folder**

2. **Verify Email Address**
   - Ensure no typos
   - Check domain is valid

3. **Check Resend Dashboard**
   - Go to Logs section
   - Look for delivery status

---

## Rate Limits

### Free Plan

- 100 emails/day
- 3,000 emails/month
- 1 verified domain

### Pro Plan ($20/month)

- 50,000 emails/month
- $1 per 1,000 additional emails
- Unlimited domains
- Priority support

### Enterprise

- Custom volume
- Dedicated IP
- Custom SLA

---

## Security Best Practices

### 1. Protect API Keys

✅ DO:

- Store in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables in production

❌ DON'T:

- Commit API keys to git
- Share keys in public repos
- Use same key for dev and prod

### 2. Validate Email Addresses

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  throw new Error("Invalid email address");
}
```

### 3. Rate Limiting

```typescript
// Implement rate limiting per user/IP
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

await limiter.check(req, 5, "CACHE_TOKEN"); // 5 requests per minute
```

### 4. Sanitize User Input

```typescript
import DOMPurify from "isomorphic-dompurify";

const cleanName = DOMPurify.sanitize(userInput);
```

---

## Going to Production

### 1. Verify Your Domain

Follow steps in "Domain Verification" section above.

### 2. Update Environment Variables

```env
RESEND_API_KEY="re_live_xxxxxxxxxxxxx"
FROM_EMAIL="hello@yourcompany.com"
SUPPORT_EMAIL="support@yourcompany.com"
```

### 3. Test Thoroughly

- Send test emails to different providers (Gmail, Outlook, etc.)
- Check spam scores
- Verify links work correctly
- Test on mobile devices

### 4. Monitor Delivery

- Check Resend Dashboard → Analytics
- Monitor bounce rates
- Track click-through rates
- Watch for spam complaints

### 5. Set Up Webhooks (Optional)

Resend can notify you of email events:

1. Go to Resend Dashboard → Webhooks
2. Add endpoint: `https://yourapp.com/api/webhooks/resend`
3. Select events: delivered, bounced, complained
4. Handle webhooks in your app

---

## Resources

- [Resend Documentation](https://resend.com/docs)
- [react-email Documentation](https://react.email/docs)
- [Email Template Examples](https://react.email/examples)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Deliverability Guide](https://resend.com/docs/dashboard/analytics)

## Support

Need help?

- [Resend Discord](https://discord.gg/resend)
- [Resend Support](mailto:support@resend.com)
- [GitHub Issues](https://github.com/resend/resend-node/issues)
