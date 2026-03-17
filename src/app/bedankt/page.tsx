import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Bedankt",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BedanktPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const name = typeof params.name === "string" ? params.name : undefined;
  const personen =
    typeof params.personen === "string" ? params.personen : undefined;
  const workshops =
    typeof params.workshops === "string" ? params.workshops : undefined;

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        {/* Checkmark icon */}
        <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <CheckCircle2 className="text-primary h-10 w-10" />
        </div>

        {/* Heading */}
        <h1 className="text-primary mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
          Bedankt voor je aanvraag{name ? `, ${name}` : ""}!
        </h1>

        {/* Summary of submission */}
        {(personen || workshops) && (
          <p className="text-muted-foreground mb-2 text-base">
            {workshops && (
              <>
                Workshop:{" "}
                <span className="text-foreground font-medium">{workshops}</span>
              </>
            )}
            {workshops && personen && " · "}
            {personen && (
              <>
                <span className="text-foreground font-medium">{personen}</span>{" "}
                personen
              </>
            )}
          </p>
        )}

        {/* Next steps */}
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
          We nemen zo snel mogelijk contact met je op om de details te
          bespreken. Verheug je vast op jullie uitje!
        </p>

        {/* Social proof */}
        <div className="bg-muted/50 mb-8 flex items-center justify-center gap-2 rounded-lg px-5 py-3">
          <Users className="text-primary h-5 w-5" />
          <span className="text-muted-foreground text-sm">
            Meer dan{" "}
            <span className="text-foreground font-semibold">150 teams</span>{" "}
            gingen je voor
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">Terug naar home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/jullie-ervaringen">
              Bekijk ervaringen
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
