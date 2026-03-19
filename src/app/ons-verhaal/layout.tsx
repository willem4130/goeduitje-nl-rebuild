import type { Metadata } from "next";

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
};

export default function OnsVerhaalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
