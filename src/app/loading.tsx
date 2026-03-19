export default function Loading() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
      <div className="border-primary mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      <p className="text-muted-foreground">Laden...</p>
    </main>
  );
}
