import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Open Kookworkshop Inschrijving",
  description:
    "Schrijf je in voor een open kookworkshop bij Goeduitje. Kook samen met anderen authentieke gerechten onder begeleiding van statushouders. Kleine groepen, grote beleving.",
  openGraph: {
    title: "Open Kookworkshop Inschrijving | Goeduitje.nl",
    description:
      "Schrijf je in voor een open kookworkshop bij Goeduitje. Kook samen met anderen authentieke gerechten onder begeleiding van statushouders.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Kookworkshop Inschrijving | Goeduitje.nl",
    description:
      "Schrijf je in voor een open kookworkshop bij Goeduitje. Kook samen met anderen authentieke gerechten onder begeleiding van statushouders.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function OpenKookworkshopsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
