"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal, StaggerChildren } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import {
  Star,
  Building2,
  Users,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/client";
import {
  GoogleReviewCard,
  GoogleIcon,
  type GoogleReview,
} from "@/components/google-review-card";
import { StarRating } from "@/components/star-rating";
import {
  ReviewsGridSkeleton,
  ReviewsStatsSkeleton,
} from "@/components/reviews-skeleton";

// Type for review from API
type ReviewFromAPI = {
  id: string;
  googleReviewId: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string | null;
  relativeTime: string;
  reviewTime: Date;
  language: string;
  sortOrder: string;
  isVisible: boolean;
  fetchedAt: Date;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default function JullieErvaringenPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  // Fetch Google Reviews
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch,
  } = api.reviews.getAll.useQuery({
    limit: 20,
    sortBy: "reviewTime",
    sortOrder: "desc",
    visibleOnly: true,
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } =
    api.reviews.getStats.useQuery();

  // Get featured reviews (4-5 stars with longer text)
  const featuredReviews = (
    reviews?.filter(
      (r: ReviewFromAPI) => r.rating >= 4 && r.text && r.text.length > 100
    ) || []
  ).slice(0, 2);

  // Get remaining reviews for grid
  const gridReviews =
    reviews?.filter(
      (r: ReviewFromAPI) =>
        !featuredReviews.some((f: ReviewFromAPI) => f.id === r.id)
    ) || [];

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Hero Section - Parallax with Editorial Typography */}
      <section className="relative min-h-[60vh] overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
          <div className="from-primary/20 via-secondary/20 to-primary/10 absolute inset-0 bg-gradient-to-br" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </motion.div>

        {/* Sophisticated gradient overlay */}
        <div className="via-background/50 to-background absolute inset-0 bg-gradient-to-b from-transparent" />

        <div className="section-md relative flex items-center">
          <div className="container">
            <ScrollReveal animation="slideUp">
              <div className="max-w-4xl">
                <h1 className="mb-8 text-[56px] leading-[1.1] tracking-tight sm:text-[64px]">
                  Jullie Ervaringen
                </h1>
                <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed tracking-wide">
                  Echte reviews van echte teams. Ontdek wat anderen zeggen over
                  hun ervaring met Goeduitje.nl.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Overview - with live Google data */}
      <section className="section-md border-b">
        <div className="container">
          {statsLoading ? (
            <ReviewsStatsSkeleton className="justify-center" />
          ) : (
            <StaggerChildren
              staggerDelay={0.1}
              className="grid gap-8 md:grid-cols-4"
            >
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Star className="text-primary h-8 w-8" />
                </div>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-[48px] leading-none font-light tracking-tight">
                    {stats?.averageRating?.toFixed(1) || "4.9"}
                  </span>
                  <StarRating rating={stats?.averageRating || 4.9} size="md" />
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Gemiddelde Rating
                </div>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Users className="text-primary h-8 w-8" />
                </div>
                <div className="mb-2 text-[48px] leading-none font-light tracking-tight">
                  {stats?.totalCount || stats?.storedCount || "100+"}
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Google Reviews
                </div>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Building2 className="text-primary h-8 w-8" />
                </div>
                <div className="mb-2 text-[48px] leading-none font-light tracking-tight">
                  80+
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Bedrijven
                </div>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Calendar className="text-primary h-8 w-8" />
                </div>
                <div className="mb-2 text-[48px] leading-none font-light tracking-tight">
                  200+
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Workshops
                </div>
              </div>
            </StaggerChildren>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-md">
        <div className="container">
          {/* Loading State */}
          {reviewsLoading && (
            <>
              <ScrollReveal animation="slideUp">
                <h2 className="mb-12 text-[32px] font-semibold tracking-tight">
                  Google Reviews Laden...
                </h2>
              </ScrollReveal>
              <ReviewsGridSkeleton count={6} />
            </>
          )}

          {/* Error State */}
          {reviewsError && (
            <div className="py-20 text-center">
              <AlertCircle className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Kon reviews niet laden
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Er is een fout opgetreden bij het laden van de reviews.
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Opnieuw proberen
              </Button>
            </div>
          )}

          {/* Reviews Content */}
          {!reviewsLoading && !reviewsError && reviews && (
            <>
              {/* Featured Reviews - Large Editorial Pull Quotes */}
              {featuredReviews.length > 0 && (
                <div className="mb-20">
                  <ScrollReveal animation="slideUp">
                    <h2 className="mb-12 text-[32px] font-semibold tracking-tight">
                      Uitgelichte Reviews
                    </h2>
                  </ScrollReveal>

                  <div className="space-y-8">
                    {featuredReviews.map(
                      (review: ReviewFromAPI, index: number) => (
                        <ScrollReveal
                          key={review.id}
                          animation="slideUp"
                          delay={index * 0.1}
                        >
                          <GoogleReviewCard
                            review={review as GoogleReview}
                            variant="featured"
                          />
                        </ScrollReveal>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* All Reviews - Masonry Grid */}
              {gridReviews.length > 0 && (
                <div>
                  <ScrollReveal animation="slideUp">
                    <h2 className="mb-12 text-[32px] font-semibold tracking-tight">
                      Alle Reviews
                    </h2>
                  </ScrollReveal>

                  <StaggerChildren
                    staggerDelay={0.08}
                    className="columns-1 gap-6 md:columns-2 lg:columns-3"
                  >
                    {gridReviews.map((review: ReviewFromAPI) => (
                      <div key={review.id} className="mb-6 break-inside-avoid">
                        <GoogleReviewCard
                          review={review as GoogleReview}
                          variant="standard"
                        />
                      </div>
                    ))}
                  </StaggerChildren>
                </div>
              )}

              {/* No reviews message */}
              {reviews.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground text-lg">
                    Nog geen reviews beschikbaar.
                  </p>
                </div>
              )}

              {/* Google Attribution */}
              <div className="mt-16 flex items-center justify-center gap-3 border-t pt-8">
                <GoogleIcon className="h-6 w-6" />
                <span className="text-muted-foreground text-sm">
                  Reviews afkomstig van Google Maps
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Goeduitje"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Bekijk op Google Maps
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section - Editorial Treatment */}
      <section className="bg-primary text-primary-foreground section-md relative overflow-hidden">
        {/* Sophisticated gradient overlay */}
        <div className="from-primary/50 absolute inset-0 bg-gradient-to-br to-transparent" />

        <div className="relative container">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-[48px] leading-[1.2] tracking-tight">
                Wordt Het Volgende Succesverhaal
              </h2>
              <p className="mb-12 text-xl leading-relaxed tracking-wide opacity-90">
                Organiseer een workshop die jullie team samenbrengt en impact
                maakt die telt.
              </p>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-editorial hover:shadow-editorial-lg px-8 py-6 font-semibold tracking-wide transition-all duration-300"
                  asChild
                >
                  <Link href="/onze-uitjes">Bekijk Onze Workshops</Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
