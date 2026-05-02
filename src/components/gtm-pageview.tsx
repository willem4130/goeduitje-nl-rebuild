"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

let lastTrackedUrl: string | null = null;

export function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = searchParams?.toString() ?? "";
    const url = pathname + (query ? `?${query}` : "");

    if (lastTrackedUrl === url) return;

    const isInitialLoad = lastTrackedUrl === null;
    lastTrackedUrl = url;
    if (isInitialLoad) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
