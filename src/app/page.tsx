import Link from "next/link";
import { BookingButton } from "@/components/booking-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCalendar,
  IconDashboard,
  IconForms,
  IconMail,
} from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container flex min-h-[80vh] flex-col items-center justify-center gap-8 py-20 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Modern Full-Stack
            <br />
            <span className="text-primary">Web Application</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Built with Next.js 16, tRPC, Prisma, and shadcn/ui. Features admin
            dashboard, form validation, and integrated booking system.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <BookingButton size="lg" />
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">
              <IconMail className="mr-2 size-4" />
              Contact Us
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Built-in Features
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Everything you need to build and manage your application
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <IconDashboard className="text-primary mb-2 size-8" />
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Complete admin panel with analytics, charts, and data tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">View Dashboard →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <IconForms className="text-primary mb-2 size-8" />
                <CardTitle>Form Validation</CardTitle>
                <CardDescription>
                  React Hook Form with Zod validation and beautiful error
                  messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/contact">Try Form →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <IconCalendar className="text-primary mb-2 size-8" />
                <CardTitle>Booking System</CardTitle>
                <CardDescription>
                  Integrated Cal.com booking with automatic confirmations and
                  reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/booking">Book Now →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <IconMail className="text-primary mb-2 size-8" />
                <CardTitle>Contact Forms</CardTitle>
                <CardDescription>
                  Multiple form types including contact, settings, and user
                  management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/contact">Contact →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg">
            Schedule a consultation to discuss your project requirements and see
            how we can help bring your ideas to life.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <BookingButton size="lg" />
            <Button variant="outline" size="lg" asChild>
              <Link href="/admin/settings">Admin Settings</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
