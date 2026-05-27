import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";
import { CookieConsent } from "@/components/cookie-consent";
import { GTMPageView } from "@/components/gtm-pageview";
import { CONSENT_STORAGE_KEY, CONSENT_VERSION } from "@/lib/consent";
import { getSiteAssets } from "@/lib/site-assets";
import { SITE_URL } from "@/lib/site-config";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const CONSENT_INIT_SCRIPT = `(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'denied',
    personalization_storage:'denied',
    functionality_storage:'granted',
    security_storage:'granted',
    wait_for_update:500
  });
  gtag('set','ads_data_redaction',true);
  gtag('set','url_passthrough',true);
  try{
    var raw = localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
    if(raw){
      var c = JSON.parse(raw);
      if(c && c.version === ${CONSENT_VERSION}){
        gtag('consent','update',{
          analytics_storage: c.analytics ? 'granted' : 'denied',
          ad_storage: c.marketing ? 'granted' : 'denied',
          ad_user_data: c.marketing ? 'granted' : 'denied',
          ad_personalization: c.marketing ? 'granted' : 'denied'
        });
        if(c.marketing){ gtag('set','ads_data_redaction',false); }
      }
    }
  }catch(e){}
})();`;

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
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
  },
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
    url: SITE_URL,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site assets from backend (Server Component)
  const assets = await getSiteAssets();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Goeduitje",
    legalName: "Goeduitje B.V.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/logo-nav.png`,
    image: `${SITE_URL}/og-image.png`,
    description:
      "Sociale onderneming die unieke bedrijfsuitjes en workshops organiseert, begeleid door statushouders en nieuwkomers.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Groenestraat 48",
      addressLocality: "Nijmegen",
      addressRegion: "Gelderland",
      postalCode: "6531 HS",
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.8426,
      longitude: 5.8668,
    },
    telephone: "+31-6-5267-5891",
    email: "guus@goeduitje.nl",
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Netherlands",
    },
    sameAs: [
      "https://www.instagram.com/goeduitje/",
      "https://www.facebook.com/goeduitje",
    ],
    founder: {
      "@type": "Person",
      name: "Guus",
      jobTitle: "Oprichter",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+31-6-5267-5891",
      contactType: "customer service",
      availableLanguage: ["Dutch", "English"],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Goeduitje.nl",
    url: SITE_URL,
  };

  return (
    <html lang="nl">
      <head>
        {GTM_ID && (
          <>
            <script
              id="consent-init"
              dangerouslySetInnerHTML={{ __html: CONSENT_INIT_SCRIPT }}
            />
            <script
              id="gtm-init"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontPoppins.variable} antialiased`}
      >
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {GTM_ID && (
          <Suspense fallback={null}>
            <GTMPageView />
          </Suspense>
        )}
        <ClientLayout
          navLogoUrl={assets.logos.nav}
          footerLogoUrl={assets.logos.footer}
        >
          {children}
        </ClientLayout>
        {GTM_ID && <CookieConsent />}
      </body>
    </html>
  );
}
