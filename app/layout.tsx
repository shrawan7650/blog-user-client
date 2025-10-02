import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { SearchModal } from "@/components/ui/SearchModal";
import { PerformanceDebugger } from "@/components/performance/PerformanceMonitor";
import Script from "next/script";
import { Suspense } from "react";
import CategoriesNav from "@/components/category/CategoriesNav";
import OfferBanner from "@/components/layout/Offer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
});

// app/layout.tsx
export const metadata: Metadata = {
  title: "BlogSphere - Stories, Insights & Ideas",
  description:
    "Discover diverse stories, tutorials, news, and insights across technology, lifestyle, travel, food, and more.",
  keywords:
    "blog, news, articles, tutorials, lifestyle, travel, food, technology, opinions, guides",
  authors: [{ name: "BlogSphere Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blogsphere.com",
    siteName: "BlogSphere",
    title: "BlogSphere - Stories, Insights & Ideas",
    description:
      "Discover diverse stories, tutorials, news, and insights across technology, lifestyle, travel, food, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BlogSphere Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogSphere - Stories, Insights & Ideas",
    description:
      "Discover diverse stories, tutorials, news, and insights across technology, lifestyle, travel, food, and more.",
    images: ["/og-image.jpg"],
  },
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
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for Firebase */}
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />

        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            {/* Preload critical resources */}
            <link
              rel="preload"
              href="/fonts/inter.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased`}
      >
        <Providers>
          <Suspense fallback={null}>
            <div className="min-h-screen bg-muted/50 text-foreground">
              <OfferBanner
                offerActive={false} 
                message="🎉 Special Offer: Get 20% off our premium courses!"
                link="/offers"
                linkText="Claim Now"
              />
              <Navbar />
              <CategoriesNav />
              <main className="flex-1">{children}</main>
              <Footer />
              <SearchModal />
              <CookieConsent />
              {/* <PerformanceDebugger /> */}
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
