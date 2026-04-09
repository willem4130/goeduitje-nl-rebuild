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
  twitter: {
    card: "summary_large_image",
    title: "Jullie Ervaringen | Goeduitje.nl",
    description:
      "Lees echte Google Reviews van teams die een uitje bij Goeduitje hebben geboekt.",
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

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Jullie Ervaringen",
    url: `${SITE_URL}/jullie-ervaringen`,
    datePublished: "2026-03-01",
    dateModified: "2026-03-01",
    author: {
      "@type": "Organization",
      name: "Goeduitje",
      url: SITE_URL,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageJsonLd),
        }}
      />
      {children}
    </>
  );
}
