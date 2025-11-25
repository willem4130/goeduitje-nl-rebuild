"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Eye,
  EyeOff,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { api } from "@/trpc/client";
import { StarRating } from "@/components/star-rating";
import { GoogleIcon } from "@/components/google-review-card";
import { cn } from "@/lib/utils";

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

export default function AdminReviewsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all reviews including hidden
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = api.reviews.getAllAdmin.useQuery();

  // Fetch cache status
  const { data: cacheStatus, refetch: refetchCache } =
    api.reviews.getCacheStatus.useQuery();

  // Toggle visibility mutation
  const toggleVisibility = api.reviews.toggleVisibility.useMutation({
    onSuccess: () => {
      refetchReviews();
    },
  });

  // Refresh from Google mutation
  const refreshFromGoogle = api.reviews.refreshFromGoogle.useMutation({
    onSuccess: () => {
      refetchReviews();
      refetchCache();
      setIsRefreshing(false);
    },
    onError: () => {
      setIsRefreshing(false);
    },
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshFromGoogle.mutate({ forceRefresh: true });
  };

  const handleToggleVisibility = (
    reviewId: string,
    currentVisibility: boolean
  ) => {
    toggleVisibility.mutate({
      reviewId,
      isVisible: !currentVisibility,
    });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Google Reviews
              </h1>
              <p className="text-muted-foreground text-sm">
                Beheer reviews die worden getoond op de website
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || refreshFromGoogle.isPending}
              className="gap-2"
            >
              {isRefreshing || refreshFromGoogle.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Ververs van Google
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Configuration Status */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GoogleIcon className="h-4 w-4" />
                  API Status
                </div>
              </CardHeader>
              <CardContent>
                {cacheStatus?.isConfigured ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Geconfigureerd</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Niet geconfigureerd</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total Reviews */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Star className="h-4 w-4" />
                  Totaal Reviews
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {cacheStatus?.totalReviews ?? 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  {cacheStatus?.visibleReviews ?? 0} zichtbaar
                </p>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  Laatst Bijgewerkt
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatDate(cacheStatus?.lastFetchedAt ?? null)}
                </div>
                {cacheStatus?.isStale && (
                  <Badge variant="outline" className="mt-1 text-amber-600">
                    Verouderd
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Error Status */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Fouten
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {cacheStatus?.fetchErrorCount ?? 0}
                </div>
                {cacheStatus?.lastErrorMessage && (
                  <p className="text-destructive mt-1 truncate text-xs">
                    {cacheStatus.lastErrorMessage}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Refresh Result Message */}
          {refreshFromGoogle.isSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  Reviews succesvol bijgewerkt
                </span>
              </div>
            </div>
          )}

          {refreshFromGoogle.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">
                  {refreshFromGoogle.error?.message ||
                    "Er is een fout opgetreden"}
                </span>
              </div>
            </div>
          )}

          {/* Reviews Table */}
          <Card>
            <CardContent className="p-0">
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                </div>
              ) : reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Zichtbaar</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead className="w-[100px]">Rating</TableHead>
                      <TableHead className="max-w-[400px]">Review</TableHead>
                      <TableHead className="w-[150px]">Datum</TableHead>
                      <TableHead className="w-[100px]">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewsData.reviews.map((review: ReviewFromAPI) => (
                      <TableRow
                        key={review.id}
                        className={cn(!review.isVisible && "bg-muted/50")}
                      >
                        <TableCell>
                          {review.isVisible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {review.authorPhotoUrl && (
                              <Image
                                src={review.authorPhotoUrl}
                                alt={review.authorName}
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full"
                              />
                            )}
                            <span
                              className={cn(
                                "font-medium",
                                !review.isVisible &&
                                  "text-muted-foreground line-through"
                              )}
                            >
                              {review.authorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StarRating rating={review.rating} size="sm" />
                        </TableCell>
                        <TableCell>
                          <p
                            className={cn(
                              "line-clamp-2 text-sm",
                              !review.isVisible && "text-muted-foreground"
                            )}
                          >
                            {review.text || (
                              <span className="text-muted-foreground italic">
                                Geen tekst
                              </span>
                            )}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground text-sm">
                            {review.relativeTime}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleVisibility(
                                review.id,
                                review.isVisible
                              )
                            }
                            disabled={toggleVisibility.isPending}
                          >
                            {review.isVisible ? (
                              <>
                                <EyeOff className="mr-1 h-4 w-4" />
                                Verberg
                              </>
                            ) : (
                              <>
                                <Eye className="mr-1 h-4 w-4" />
                                Toon
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Nog geen reviews</p>
                  {cacheStatus?.isConfigured && (
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                      className="mt-4"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Haal reviews op van Google
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          {!cacheStatus?.isConfigured && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Google Places API Configureren
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Om Google Reviews te kunnen ophalen, moeten de volgende
                  omgevingsvariabelen worden ingesteld:
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <code className="text-sm">
                    GOOGLE_PLACES_API_KEY=&quot;AIzaSy...&quot;
                    <br />
                    GOOGLE_PLACE_ID=&quot;ChIJ...&quot;
                  </code>
                </div>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>
                    <strong>1.</strong> Maak een Google Cloud project aan op{" "}
                    <a
                      href="https://console.cloud.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      console.cloud.google.com
                    </a>
                  </p>
                  <p>
                    <strong>2.</strong> Schakel de Places API in onder APIs &
                    Services
                  </p>
                  <p>
                    <strong>3.</strong> Maak een API key aan onder Credentials
                  </p>
                  <p>
                    <strong>4.</strong> Vind je Place ID via de{" "}
                    <a
                      href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Place ID Finder
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
