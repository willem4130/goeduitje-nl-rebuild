"use client";

import { TopNavigation } from "@/components/top-navigation";
import { Footer } from "@/components/footer";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavigation />
      <TRPCProvider>{children}</TRPCProvider>
      <Footer />
      <Toaster />
    </>
  );
}
