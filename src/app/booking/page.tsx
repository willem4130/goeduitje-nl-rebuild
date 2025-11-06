import { CalEmbed } from "@/components/cal-embed";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCalendar, IconClock, IconVideo } from "@tabler/icons-react";

export default function BookingPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Schedule a Meeting
          </h1>
          <p className="text-muted-foreground text-lg">
            Book a time that works best for you. We&apos;ll send you a calendar
            invite with all the details.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconClock className="size-5" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                30 minute focused discussion about your project needs
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconVideo className="size-5" />
                Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Video call via Google Meet or Zoom (your preference)
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconCalendar className="size-5" />
                Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instant confirmation with calendar invite and reminders
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Booking Section */}
        <Card>
          <CardHeader>
            <CardTitle>Select a Time</CardTitle>
            <CardDescription>
              Choose from available time slots below. All times are shown in
              your local timezone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[600px] w-full">
              {/*
                REPLACE "your-username/30min" WITH YOUR ACTUAL CAL.COM LINK

                To get your Cal.com link:
                1. Go to https://cal.com and create a free account
                2. Create an event type (e.g., "30 min meeting")
                3. Copy your booking link (e.g., "username/30min")
                4. Replace the calLink below with your link

                Example: calLink="john-doe/consultation"
              */}
              <CalEmbed
                calLink="your-username/30min"
                config={{
                  theme: "auto",
                }}
                className="h-full w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              If you&apos;re having trouble scheduling or need to reschedule,
              please{" "}
              <a href="/contact" className="text-primary underline">
                contact us
              </a>{" "}
              and we&apos;ll be happy to assist you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
