import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
      <h1 className="text-primary mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Pagina niet gevonden</h2>
      <p className="text-muted-foreground mb-8 text-center">
        Sorry, de pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 font-medium transition-colors"
      >
        Terug naar home
      </Link>
    </main>
  );
}
