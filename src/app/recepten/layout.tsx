import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recepten uit Onze Kookworkshops",
  description:
    "Ontdek heerlijke recepten uit onze kookworkshops. Van voorgerecht tot dessert, Arabische en Perzische gerechten stap-voor-stap uitgelegd.",
  openGraph: {
    title: "Recepten | Goeduitje.nl",
    description:
      "Ontdek heerlijke recepten uit onze kookworkshops. Arabische en Perzische gerechten stap-voor-stap uitgelegd.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recepten | Goeduitje.nl",
    description:
      "Ontdek heerlijke recepten uit onze kookworkshops. Arabische en Perzische gerechten stap-voor-stap uitgelegd.",
  },
};

export default function ReceptenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
