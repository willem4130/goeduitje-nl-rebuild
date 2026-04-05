import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onze Uitjes - Workshops & Teambuilding Activiteiten",
  description:
    "Bekijk ons aanbod van workshops en teambuildingactiviteiten. Van kookworkshops tot stadsspellen, configureer je perfecte teamuitje bij Goeduitje.",
  openGraph: {
    title: "Workshops & Teambuilding Activiteiten | Goeduitje.nl",
    description:
      "Bekijk ons aanbod van workshops en teambuildingactiviteiten. Configureer je perfecte teamuitje bij Goeduitje.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workshops & Teambuilding Activiteiten | Goeduitje.nl",
    description:
      "Bekijk ons aanbod van workshops en teambuildingactiviteiten. Configureer je perfecte teamuitje bij Goeduitje.",
  },
};

export default function OnzeUitjesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
