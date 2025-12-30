import { api } from "@/trpc/client";

type ContentResult = Record<string, Record<string, string>>;

/**
 * Hook to fetch page content from the database
 * Returns content grouped by section: { section: { key: value } }
 *
 * @example
 * const { content, isLoading } = usePageContent("homepage");
 * const heroTitle = content?.hero?.title ?? "Default Title";
 */
export function usePageContent(page: string) {
  const { data, isLoading, error } = api.content.getByPage.useQuery(
    { page },
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  return {
    content: data as ContentResult | undefined,
    isLoading,
    error,
  };
}

/**
 * Get a specific content value with a fallback
 * Convenience function to get nested values safely
 */
export function getContent(
  content: ContentResult | undefined,
  section: string,
  key: string,
  fallback = ""
): string {
  return content?.[section]?.[key] ?? fallback;
}
