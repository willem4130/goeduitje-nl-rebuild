import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jullie Ervaringen - Reviews & Beoordelingen",
  description:
    "Lees echte Google Reviews van teams die een uitje bij Goeduitje hebben geboekt. Gemiddeld 5 sterren uit 49+ beoordelingen.",
  openGraph: {
    title: "Jullie Ervaringen | Goeduitje.nl",
    description:
      "Lees echte Google Reviews van teams die een uitje bij Goeduitje hebben geboekt.",
    type: "website",
    locale: "nl_NL",
    siteName: "Goeduitje.nl",
  },
};

const reviewsJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Goeduitje",
  url: "https://www.goeduitje.nl",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "49",
  },
};

export default function JullieErvaringenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewsJsonLd),
        }}
      />
      {children}
    </>
  );
}
