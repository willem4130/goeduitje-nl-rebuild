import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { TopNavigation } from "@/components/top-navigation";
import { Footer } from "@/components/footer";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fontPoppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.goeduitje.nl"),
  title: {
    default: "Goeduitje.nl - Workshops & Teambuildinguitjes met een Verhaal",
    template: "%s | Goeduitje.nl",
  },
  description:
    "Ontdek unieke workshops en teambuildinguitjes in heel Nederland. Van koken tot kunst, van Amsterdam tot Limburg. Workshops met een verhaal, om te janken zo goed!",
  keywords: [
    "workshops",
    "teambuilding",
    "uitjes",
    "bedrijfsuitjes",
    "teamuitjes",
    "workshop Nederland",
    "teambuildingactiviteiten",
    "groepsuitjes",
  ],
  authors: [{ name: "Goeduitje.nl" }],
  creator: "Goeduitje.nl",
  publisher: "Goeduitje.nl",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://www.goeduitje.nl",
    siteName: "Goeduitje.nl",
    title: "Goeduitje.nl - Workshops & Teambuildinguitjes met een Verhaal",
    description:
      "Ontdek unieke workshops en teambuildinguitjes in heel Nederland. Workshops met een verhaal, om te janken zo goed!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Goeduitje.nl - Uitjes met een verhaal, om te janken zo goed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goeduitje.nl - Workshops & Teambuildinguitjes met een Verhaal",
    description:
      "Ontdek unieke workshops en teambuildinguitjes in heel Nederland. Workshops met een verhaal!",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontPoppins.variable} antialiased`}
      >
        <TopNavigation />
        <TRPCProvider>{children}</TRPCProvider>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
