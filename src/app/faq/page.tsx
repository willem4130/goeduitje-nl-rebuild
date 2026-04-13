"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/trpc/client";
import { Loader2 } from "lucide-react";

export default function FAQPage() {
  const { data: faqs, isLoading } = api.faq.getAll.useQuery(
    {},
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Group FAQs by category
  const faqCategories = useMemo(() => {
    if (!faqs) return [];

    const grouped = faqs.reduce(
      (acc, faq) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      },
      {} as Record<string, typeof faqs>
    );

    // Sort categories in a specific order
    // "Betaling & Annulering" kept as legacy fallback during migration window —
    // remove after DB rename migration has run in production.
    const categoryOrder = [
      "Over Goeduitje",
      "Boekingen",
      "Prijzen, Betaling & Annulering",
      "Betaling & Annulering",
      "Praktische informatie",
      "Voor bedrijven",
    ];

    return categoryOrder
      .filter((cat) => grouped[cat])
      .map((title) => ({
        title,
        questions: grouped[title],
      }));
  }, [faqs]);

  if (isLoading) {
    return (
      <main className="min-h-screen py-16 lg:py-24">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
            Veelgestelde vragen
          </h1>
          <p className="text-muted-foreground text-lg">
            Vind antwoorden op de meest gestelde vragen over onze workshops en
            boekingen.
          </p>
        </div>

        {faqCategories.length > 0 ? (
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <section key={category.title}>
                <h2 className="mb-4 text-xl font-semibold">{category.title}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-16 text-center">
            Geen veelgestelde vragen gevonden.
          </div>
        )}

        <div className="bg-muted/50 mt-12 rounded-lg p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            Staat uw vraag er niet tussen?
          </h2>
          <p className="text-muted-foreground mb-4">
            Neem gerust contact met ons op. We helpen u graag verder!
          </p>
          <a
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors"
          >
            Neem contact op
          </a>
        </div>
      </div>
    </main>
  );
}
