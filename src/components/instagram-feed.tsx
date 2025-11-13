"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram } from "lucide-react";

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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
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

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-muted relative aspect-square overflow-hidden rounded-lg transition-transform hover:scale-105"
        >
          <Image
            src={post.media_url}
            alt={post.caption?.slice(0, 100) || "Instagram post"}
            fill
            className="object-cover transition-opacity group-hover:opacity-75"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Instagram className="h-8 w-8 text-white" />
          </div>
          {post.media_type === "CAROUSEL_ALBUM" && (
            <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
        </a>
      ))}
    </div>
  );
}
