# Cal.com Booking System Setup Guide

This guide will help you configure the Cal.com booking system integrated into your application.

## Quick Start (5 minutes)

### Step 1: Create Cal.com Account

1. Go to [https://cal.com/signup](https://cal.com/signup)
2. Sign up with your email or Google account
3. Complete your profile setup

### Step 2: Create Event Type

1. After logging in, click **"New Event Type"**
2. Configure your event:
   - **Event Name**: "30 Min Consultation" (or your preference)
   - **Duration**: 30 minutes (or customize)
   - **Location**: Choose from:
     - Google Meet (automatic)
     - Zoom
     - Microsoft Teams
     - Phone call
     - Custom location
3. Click **"Create"**

### Step 3: Configure Event Settings

1. Click on your newly created event
2. Configure important settings:

   **Availability**
   - Set your working hours
   - Add buffer time between meetings
   - Set minimum notice period

   **Booking Limits**
   - Set max bookings per day
   - Enable/disable recurring bookings

   **Questions**
   - Add custom questions for attendees
   - Make fields required/optional

   **Notifications**
   - Email reminders (automatic)
   - SMS notifications (optional)
   - Workflow automations

### Step 4: Get Your Booking Link

1. In your event settings, find your **booking link**
2. It will look like: `your-username/30min`
3. Copy this link

### Step 5: Update Your Application

Replace the placeholder in your code with your actual Cal.com link:

**File: `src/app/booking/page.tsx`** (Line ~58)

```tsx
<CalEmbed
  calLink="your-username/30min" // ← REPLACE THIS
  config={{
    theme: "auto",
  }}
  className="h-full w-full"
/>
```

**File: `src/components/booking-button.tsx`** (Line ~12)

```tsx
export function BookingButton({
  calLink = "your-username/30min", // ← REPLACE THIS
  // ...
});
```

### Step 6: Test Your Booking

1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:3000/booking`
3. Try booking a test appointment
4. Check your email for confirmation

## Advanced Configuration

### Custom Branding

1. Go to **Settings → Appearance** in Cal.com
2. Customize:
   - Brand color
   - Logo
   - Booking page theme

### Calendar Integration

Connect your calendar to prevent double-bookings:

1. Go to **Settings → Calendars**
2. Connect:
   - Google Calendar
   - Outlook Calendar
   - Apple Calendar
   - CalDAV

### Payment Integration (Optional)

Accept payments for bookings:

1. Go to **Settings → Payments**
2. Connect Stripe account
3. Set price per event type

### Workflows & Automations

Create automated workflows:

1. Go to **Settings → Workflows**
2. Examples:
   - Send reminder 1 hour before
   - Send follow-up email after meeting
   - SMS notifications
   - Webhook integrations

### Email Templates

Customize email confirmations:

1. Go to **Settings → Emails**
2. Edit templates for:
   - Booking confirmation
   - Reminder emails
   - Cancellation notifications
   - Reschedule notifications

## Multiple Event Types

You can create different booking types:

```tsx
// 30 min consultation
<CalEmbed calLink="username/consultation" />

// 60 min deep dive
<CalEmbed calLink="username/deep-dive" />

// Discovery call
<CalEmbed calLink="username/discovery" />
```

Update your booking page to offer multiple options.

## Customization Options

### Theme Configuration

```tsx
<CalEmbed
  calLink="your-username/30min"
  config={{
    theme: "auto", // or "light" | "dark"
  }}
/>
```

### Pre-fill Data

```tsx
<CalEmbed
  calLink="your-username/30min"
  config={{
    name: "John Doe",
    email: "john@example.com",
    notes: "Interested in enterprise features",
  }}
/>
```

### Booking Button (Popup)

```tsx
import { CalButton } from "@/components/cal-embed";

<CalButton calLink="your-username/30min" config={{ theme: "auto" }}>
  <Button>Book a Call</Button>
</CalButton>;
```

## Troubleshooting

### Embed Not Showing

1. Check browser console for errors
2. Verify your Cal.com link is correct
3. Ensure Cal.com script is loading
4. Try disabling ad blockers

### Wrong Timezone

Cal.com automatically detects user timezone. To verify:

1. Check your Cal.com settings
2. Ensure browser timezone is correct
3. Ask attendees to verify their timezone in booking flow

### Booking Not Confirmed

1. Check spam folder
2. Verify email settings in Cal.com
3. Check Cal.com dashboard for booking status
4. Ensure calendar integration is working

### Calendar Not Syncing

1. Disconnect and reconnect calendar in Cal.com
2. Check calendar permissions
3. Verify OAuth tokens haven't expired
4. Re-authorize calendar access

## API Integration (Advanced)

If you need programmatic access:

1. Go to **Settings → Developer → API Keys**
2. Generate new API key
3. Install SDK: `npm install @calcom/api-client`
4. Use the API client to:
   - Check availability
   - Create bookings programmatically
   - List bookings
   - Cancel/reschedule

Example:

```tsx
import { CalApi } from "@calcom/api-client";

const cal = new CalApi({ apiKey: process.env.CAL_API_KEY });

// Get availability
const availability = await cal.availability.get({
  username: "your-username",
  eventTypeSlug: "30min",
  startTime: "2024-01-01",
  endTime: "2024-01-31",
});

// Create booking
const booking = await cal.bookings.create({
  eventTypeId: 123,
  start: "2024-01-15T10:00:00Z",
  attendee: {
    name: "John Doe",
    email: "john@example.com",
  },
});
```

## Resources

- [Cal.com Documentation](https://cal.com/docs)
- [Embed Guide](https://cal.com/docs/embed)
- [API Reference](https://cal.com/docs/api-reference)
- [Webhooks](https://cal.com/docs/webhooks)
- [Video Tutorials](https://www.youtube.com/c/CalDotCom)

## Support

Need help?

- Cal.com Community: [https://cal.com/slack](https://cal.com/slack)
- GitHub Issues: [https://github.com/calcom/cal.com/issues](https://github.com/calcom/cal.com/issues)
- Email Support: support@cal.com (Pro/Enterprise plans)
