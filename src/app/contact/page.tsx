import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact - Neem Contact Op",
  description:
    "Neem contact op met Goeduitje voor vragen over workshops, teambuilding of een vrijblijvende offerte. We helpen je graag!",
  openGraph: {
    title: "Contact | Goeduitje.nl",
    description:
      "Neem contact op met Goeduitje voor vragen over workshops, teambuilding of een vrijblijvende offerte.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
};

export default function ContactPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center px-4 pt-24 pb-10 sm:px-6">
      <ContactForm />
    </div>
  );
}
