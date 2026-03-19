"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
      <h1 className="text-primary mb-4 text-6xl font-bold">Oeps!</h1>
      <h2 className="mb-4 text-2xl font-semibold">Er ging iets mis</h2>
      <p className="text-muted-foreground mb-8 text-center">
        Sorry, er is een onverwachte fout opgetreden. Probeer het opnieuw of ga
        terug naar de homepagina.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 font-medium transition-colors"
        >
          Probeer opnieuw
        </button>
        <Link
          href="/"
          className="border-primary text-primary hover:bg-primary/10 rounded-md border px-6 py-3 font-medium transition-colors"
        >
          Terug naar home
        </Link>
      </div>
    </main>
  );
}
