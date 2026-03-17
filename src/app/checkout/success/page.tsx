import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCheck, IconMail, IconToolsKitchen2 } from "@tabler/icons-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center pt-24 pb-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <IconCheck className="text-primary size-8" />
          </div>
          <CardTitle className="text-3xl">Betaling geslaagd!</CardTitle>
          <CardDescription className="text-base">
            Bedankt voor je betaling. Je boeking is bevestigd.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="mb-4 text-lg font-semibold">Wat gebeurt er nu?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconMail className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Bevestigingsmail</p>
                  <p className="text-muted-foreground text-sm">
                    Je ontvangt binnen enkele minuten een bevestiging per
                    e-mail.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Boeking bevestigd</p>
                  <p className="text-muted-foreground text-sm">
                    Je inschrijving voor de kookworkshop is bevestigd.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconToolsKitchen2 className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Voorbereiding</p>
                  <p className="text-muted-foreground text-sm">
                    We nemen contact op met verdere details over je workshop.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/">Terug naar home</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/onze-uitjes">Bekijk uitjes</Link>
            </Button>
          </div>

          <div className="border-t pt-6">
            <p className="text-muted-foreground text-center text-sm">
              Vragen?{" "}
              <Link href="/contact" className="text-primary underline">
                Neem contact met ons op
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
