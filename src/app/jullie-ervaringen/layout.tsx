import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";

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

export default async function JullieErvaringenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reviewCache = await prisma.google_reviews_cache.findUnique({
    where: { id: "singleton" },
  });

  const reviewsJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Goeduitje",
    url: SITE_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewCache?.averageRating?.toString() || "5",
      reviewCount: reviewCache?.totalReviewCount?.toString() || "49",
    },
  };

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
