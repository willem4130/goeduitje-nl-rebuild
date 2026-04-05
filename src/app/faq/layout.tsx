import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Veelgestelde Vragen (FAQ)",
  description:
    "Vind antwoorden op veelgestelde vragen over boekingen, betaling, annulering en praktische informatie bij Goeduitje.",
  openGraph: {
    title: "Veelgestelde Vragen | Goeduitje.nl",
    description:
      "Vind antwoorden op veelgestelde vragen over boekingen, betaling en workshops bij Goeduitje.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary",
    title: "Veelgestelde Vragen | Goeduitje.nl",
    description:
      "Vind antwoorden op veelgestelde vragen over boekingen, betaling en workshops bij Goeduitje.",
  },
};

export default async function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqs = await prisma.fAQ.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    select: { question: true, answer: true },
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      {children}
    </>
  );
}
