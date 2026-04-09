import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Ons Verhaal - Sociale Onderneming met Impact",
  description:
    "Goeduitje is een sociale onderneming waar statushouders en asielzoekers uw bedrijfsuitjes organiseren. Ontdek onze missie, visie en impact.",
  openGraph: {
    title: "Ons Verhaal | Goeduitje.nl",
    description:
      "Goeduitje is een sociale onderneming waar statushouders en asielzoekers uw bedrijfsuitjes organiseren.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ons Verhaal | Goeduitje.nl",
    description:
      "Goeduitje is een sociale onderneming waar statushouders en asielzoekers uw bedrijfsuitjes organiseren.",
  },
};

export default function OnsVerhaalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Ons Verhaal",
    url: `${SITE_URL}/ons-verhaal`,
    datePublished: "2026-02-01",
    dateModified: "2026-03-01",
    author: {
      "@type": "Organization",
      name: "Goeduitje",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageJsonLd),
        }}
      />
      {children}
    </>
  );
}
