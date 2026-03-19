import type { Metadata } from "next";

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
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
