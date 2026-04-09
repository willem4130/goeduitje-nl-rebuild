import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deel je Ervaring - Feedback",
  description:
    "Deel je ervaring met Goeduitje. Vertel ons over je workshop of teamuitje en help ons om nog betere ervaringen te creëren.",
  openGraph: {
    title: "Deel je Ervaring | Goeduitje.nl",
    description:
      "Deel je ervaring met Goeduitje. Vertel ons over je workshop of teamuitje.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deel je Ervaring | Goeduitje.nl",
    description:
      "Deel je ervaring met Goeduitje. Vertel ons over je workshop of teamuitje.",
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
