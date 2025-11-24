export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconX, IconArrowLeft, IconHelp } from "@tabler/icons-react";

export default function CheckoutCancelPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <IconX className="text-muted-foreground size-8" />
          </div>
          <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
          <CardDescription className="text-base">
            Your payment was cancelled and no charges were made to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="mb-4 text-lg font-semibold">
              What would you like to do?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconArrowLeft className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Try Again</p>
                  <p className="text-muted-foreground text-sm">
                    Go back to our pricing page and choose a plan that works for
                    you.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconHelp className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Get Help</p>
                  <p className="text-muted-foreground text-sm">
                    Have questions about our plans or need assistance? Our team
                    is here to help.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/pricing">
                <IconArrowLeft className="mr-2 size-4" />
                Back to Pricing
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/contact">
                <IconHelp className="mr-2 size-4" />
                Contact Support
              </Link>
            </Button>
          </div>

          <div className="border-t pt-6">
            <p className="text-muted-foreground text-center text-sm">
              Your cart is still saved. You can return anytime to complete your
              purchase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
