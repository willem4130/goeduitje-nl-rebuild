import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ons Team - De Mensen Achter Goeduitje",
  description:
    "Maak kennis met het team achter Goeduitje. Onze medewerkers zijn statushouders en nieuwkomers die met passie hun cultuur en vaardigheden delen.",
  openGraph: {
    title: "Ons Team | Goeduitje.nl",
    description:
      "Maak kennis met het team achter Goeduitje. Onze medewerkers delen met passie hun cultuur en vaardigheden.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ons Team | Goeduitje.nl",
    description:
      "Maak kennis met het team achter Goeduitje. Onze medewerkers delen met passie hun cultuur en vaardigheden.",
  },
};

export default function OnsTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
