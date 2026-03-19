import type { Metadata } from "next";

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
};

export default function OnzeImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
