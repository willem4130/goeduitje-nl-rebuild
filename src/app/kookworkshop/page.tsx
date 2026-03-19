import { Metadata } from "next";
import WorkshopDetailPage from "@/app/onze-uitjes/[slug]/page";

// Re-export the same workshop detail page with hardcoded slug "kookworkshop"
// This preserves the old Wix URL structure for SEO purposes.

const slugParams = Promise.resolve({ slug: "kookworkshop" });

export async function generateMetadata(): Promise<Metadata> {
  // Import generateMetadata dynamically to avoid name collision
  const mod = await import("@/app/onze-uitjes/[slug]/page");
  return mod.generateMetadata({ params: slugParams });
}

export default async function KookworkshopPage() {
  return WorkshopDetailPage({ params: slugParams });
}
