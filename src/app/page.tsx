import { AppointmentSlots } from "@/components/appointment-slots";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="border-b">
        <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
          <div className="space-y-4">
            <div className="bg-primary/10 text-primary mx-auto mb-4 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium">
              Now Accepting Appointments
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Book Your Next
              <br />
              <span className="text-primary">Appointment Today</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
              Professional service with real-time availability.
              <br />
              See open slots and book instantly with our smart scheduling
              system.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#booking">View Available Slots</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Real-time availability</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Instant confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section id="booking" className="bg-muted/30 py-20">
        <div className="container">
          <AppointmentSlots />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-2">
              Simple, fast, and reliable booking process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Check Availability</h3>
              <p className="text-muted-foreground">
                View real-time slot availability with our traffic light system
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Select Your Slot</h3>
              <p className="text-muted-foreground">
                Choose a time that works for you and complete the booking form
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get Confirmed</h3>
              <p className="text-muted-foreground">
                Receive instant confirmation and calendar invite via email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to Schedule?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Don&apos;t wait - limited slots available. Book your appointment now
            and secure your preferred time.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="#booking">Book Your Appointment</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
