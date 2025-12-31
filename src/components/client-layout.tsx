"use client";

import { TopNavigation } from "@/components/top-navigation";
import { Footer } from "@/components/footer";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

interface ClientLayoutProps {
  children: React.ReactNode;
  navLogoUrl?: string;
  footerLogoUrl?: string;
}

export function ClientLayout({
  children,
  navLogoUrl,
  footerLogoUrl,
}: ClientLayoutProps) {
  return (
    <>
      <TopNavigation logoUrl={navLogoUrl} />
      <TRPCProvider>{children}</TRPCProvider>
      <Footer logoUrl={footerLogoUrl} />
      <Toaster />
    </>
  );
}
