import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCheck, IconHome, IconMail } from "@tabler/icons-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <IconCheck className="text-primary size-8" />
          </div>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-base">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="mb-4 text-lg font-semibold">What happens next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconMail className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-muted-foreground text-sm">
                    You&apos;ll receive a detailed receipt and invoice via email
                    within the next few minutes.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Account Access</p>
                  <p className="text-muted-foreground text-sm">
                    Your account has been upgraded and all features are now
                    available.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconHome className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Get Started</p>
                  <p className="text-muted-foreground text-sm">
                    Head to your dashboard to start using your new features.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/admin">
                <IconHome className="mr-2 size-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Return Home</Link>
            </Button>
          </div>

          <div className="border-t pt-6">
            <p className="text-muted-foreground text-center text-sm">
              Need help?{" "}
              <Link href="/contact" className="text-primary underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
