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
    limit: 100,
    sortBy: "reviewTime",
    sortOrder: "desc",
    visibleOnly: true,
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } =
    api.reviews.getStats.useQuery();

  // Fetch site stats (companies count, activities count)
  const { data: siteStats } = api.content.getByPage.useQuery(
    { page: "site-stats" },
    { staleTime: 5 * 60 * 1000 }
  );

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
      {/* Hero Section - Consistent with other pages */}
      <section className="relative overflow-hidden border-b">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
          <div className="from-primary/10 via-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "48px 48px",
            }}
          />
        </motion.div>

        <div className="section-md relative">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal animation="slideUp">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-primary mb-8 tracking-tight">
                  Jullie Ervaringen
                </h1>
                <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg leading-relaxed tracking-wide sm:text-xl">
                  Echte reviews van echte teams. Ontdek wat anderen zeggen over
                  hun ervaring met Goeduitje.nl.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Overview - with live Google data */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          {statsLoading ? (
            <ReviewsStatsSkeleton className="justify-center" />
          ) : (
            <StaggerChildren
              staggerDelay={0.1}
              className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8"
            >
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 w-fit rounded-full p-3 md:mb-4 md:p-4">
                  <Star className="text-primary h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span className="text-[32px] leading-none font-light tracking-tight md:text-[48px]">
                    {stats?.averageRating?.toFixed(1) || "4.9"}
                  </span>
                  <StarRating rating={stats?.averageRating || 4.9} size="md" />
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Gemiddelde Rating
                </div>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 w-fit rounded-full p-3 md:mb-4 md:p-4">
                  <Users className="text-primary h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="mb-2 text-[32px] leading-none font-light tracking-tight md:text-[48px]">
                  {stats?.totalCount || stats?.storedCount || "100+"}
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Google Reviews
                </div>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 w-fit rounded-full p-3 md:mb-4 md:p-4">
                  <Building2 className="text-primary h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="mb-2 text-[32px] leading-none font-light tracking-tight md:text-[48px]">
                  {siteStats?.public?.companiesCount || "80+"}
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Bedrijven
                </div>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 w-fit rounded-full p-3 md:mb-4 md:p-4">
                  <Calendar className="text-primary h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div className="mb-2 text-[32px] leading-none font-light tracking-tight md:text-[48px]">
                  {siteStats?.public?.activitiesCount || "200+"}
                </div>
                <div className="text-muted-foreground text-sm tracking-wide">
                  Uitjes
                </div>
              </div>
            </StaggerChildren>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-md">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
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
                    <div className="mb-12 text-center">
                      <h2 className="text-primary tracking-tight">
                        Uitgelichte Reviews
                      </h2>
                    </div>
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
                    <div className="mb-12 text-center">
                      <h2 className="text-primary tracking-tight">
                        Meer reviews
                      </h2>
                      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg leading-relaxed">
                        Bekijk alle ervaringen van onze deelnemers
                      </p>
                    </div>
                  </ScrollReveal>

                  <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
                    {gridReviews.map((review: ReviewFromAPI) => (
                      <div key={review.id} className="mb-6 break-inside-avoid">
                        <GoogleReviewCard
                          review={review as GoogleReview}
                          variant="standard"
                        />
                      </div>
                    ))}
                  </div>
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

              {/* Google Reviews CTA */}
              <div className="mt-16 border-t pt-12">
                <div className="mx-auto max-w-lg text-center">
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <GoogleIcon className="h-6 w-6" />
                    <span className="text-muted-foreground text-sm">
                      Reviews afkomstig van Google Maps
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Wil je alle {stats?.totalCount || ""} reviews bekijken?
                    Bekijk ons volledige profiel op Google Maps.
                  </p>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Goeduitje"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GoogleIcon className="h-5 w-5" />
                      Bekijk alle reviews op Google
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section - Consistent with other pages */}
      <section className="bg-primary text-primary-foreground section-md relative overflow-hidden">
        <div className="from-primary/50 absolute inset-0 bg-gradient-to-br to-transparent" />

        <div className="relative container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 tracking-tight">
                Word Het Volgende Succesverhaal
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed tracking-wide opacity-90 sm:text-xl">
                Organiseer een uitje dat jullie team samenbrengt en impact maakt
                die telt.
              </p>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-editorial hover:shadow-editorial-lg px-8 py-6 font-semibold tracking-wide transition-all duration-300"
                  asChild
                >
                  <Link href="/onze-uitjes">Bekijk Onze Uitjes</Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
