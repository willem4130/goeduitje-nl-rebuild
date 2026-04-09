import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Onze Impact - Impactmeting & Rapportage",
  description:
    "Ontdek de sociale impact van Goeduitje. Bekijk onze Theory of Change, impactrapporten en meerjarenplan 2025-2029.",
  openGraph: {
    title: "Onze Impact | Goeduitje.nl",
    description:
      "Ontdek de sociale impact van Goeduitje. Bekijk onze Theory of Change en impactrapporten.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onze Impact | Goeduitje.nl",
    description:
      "Ontdek de sociale impact van Goeduitje. Bekijk onze Theory of Change en impactrapporten.",
  },
};

export default function OnzeImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Onze Impact",
    url: `${SITE_URL}/onze-impact`,
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
