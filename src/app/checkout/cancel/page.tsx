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
    <div className="container flex min-h-screen items-center justify-center pt-24 pb-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <IconX className="text-muted-foreground size-8" />
          </div>
          <CardTitle className="text-3xl">Betaling geannuleerd</CardTitle>
          <CardDescription className="text-base">
            Je betaling is geannuleerd. Er zijn geen kosten in rekening
            gebracht.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="mb-4 text-lg font-semibold">Wat wil je doen?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconArrowLeft className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Opnieuw proberen</p>
                  <p className="text-muted-foreground text-sm">
                    Ga terug naar de boekingspagina en probeer het opnieuw.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconHelp className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-medium">Hulp nodig</p>
                  <p className="text-muted-foreground text-sm">
                    Heb je vragen? Ons team helpt je graag.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/booking">
                <IconArrowLeft className="mr-2 size-4" />
                Terug naar boeken
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/contact">
                <IconHelp className="mr-2 size-4" />
                Contact opnemen
              </Link>
            </Button>
          </div>

          <div className="border-t pt-6">
            <p className="text-muted-foreground text-center text-sm">
              Je boeking is bewaard. Je kunt op elk moment terugkomen om af te
              ronden.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
