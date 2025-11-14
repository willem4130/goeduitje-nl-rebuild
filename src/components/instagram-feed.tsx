"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstagramPost {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramFeedResponse {
  data: InstagramPost[];
  cached?: boolean;
  cacheAge?: number;
  error?: string;
  message?: string;
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/instagram");
        const data: InstagramFeedResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Failed to fetch posts"
          );
        }

        setPosts(data.data || []);
      } catch (err) {
        console.error("Error fetching Instagram posts:", err);
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid auto-rows-fr grid-cols-2 gap-6 md:grid-cols-8">
        {/* Editorial masonry skeleton pattern */}
        {[
          "md:col-span-3 md:row-span-2",
          "md:col-span-2",
          "md:col-span-3",
          "md:col-span-2 md:row-span-2",
          "md:col-span-3",
          "md:col-span-3",
          "md:col-span-2",
          "md:col-span-3 md:row-span-2",
        ].map((className, i) => (
          <Skeleton
            key={i}
            className={cn(
              "shadow-editorial-sm aspect-square w-full",
              className
            )}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
        <Instagram className="mb-4 h-12 w-12 opacity-50" />
        <p className="mb-2 text-lg font-medium">
          Unable to load Instagram posts
        </p>
        <p className="text-sm">{error}</p>
        <p className="text-muted-foreground/70 mt-4 text-xs">
          Follow us at{" "}
          <a
            href="https://instagram.com/goeduitje"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @goeduitje
          </a>
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
        <Instagram className="mb-4 h-12 w-12 opacity-50" />
        <p className="text-lg font-medium">No posts found</p>
        <p className="text-muted-foreground/70 mt-2 text-sm">
          Follow us at{" "}
          <a
            href="https://instagram.com/goeduitje"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @goeduitje
          </a>
        </p>
      </div>
    );
  }

  // Editorial masonry grid pattern - varies based on index
  const getGridSpan = (index: number) => {
    const pattern = [
      "md:col-span-3 md:row-span-2", // Large feature
      "md:col-span-2", // Medium
      "md:col-span-3", // Wide
      "md:col-span-2 md:row-span-2", // Tall
      "md:col-span-3", // Wide
      "md:col-span-3", // Wide
      "md:col-span-2", // Medium
      "md:col-span-3 md:row-span-2", // Large feature
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="grid auto-rows-fr grid-cols-2 gap-6 md:grid-cols-8">
      {posts.map((post, index) => (
        <motion.a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          whileHover={{ y: -4 }}
          className={cn(
            "group bg-muted shadow-editorial hover:shadow-editorial-hover relative aspect-square overflow-hidden transition-all duration-500",
            getGridSpan(index)
          )}
        >
          <Image
            src={post.media_url}
            alt={post.caption?.slice(0, 100) || "Instagram post"}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
            unoptimized
          />
          {/* Sophisticated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-70" />

          {/* Icon overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full border border-white/50 bg-white/10 p-4 backdrop-blur-sm">
              <Instagram className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Carousel indicator */}
          {post.media_type === "CAROUSEL_ALBUM" && (
            <div className="absolute top-3 right-3 rounded-full border border-white/50 bg-black/40 p-1.5 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
            </div>
          )}
        </motion.a>
      ))}
    </div>
  );
}
