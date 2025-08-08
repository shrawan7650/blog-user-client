import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/Providers"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CookieConsent } from "@/components/ui/CookieConsent"
import { SearchModal } from "@/components/ui/SearchModal"
import { PerformanceDebugger } from "@/components/performance/PerformanceMonitor"
import Script from "next/script"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
})

export const metadata: Metadata = {
  title: "TechBlog - Latest Tech News & Tutorials",
  description: "Stay updated with the latest technology trends, tutorials, and insights from industry experts.",
  keywords: "technology, programming, tutorials, tech news, web development",
  authors: [{ name: "TechBlog Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techblog.com",
    siteName: "TechBlog",
    title: "TechBlog - Latest Tech News & Tutorials",
    description: "Stay updated with the latest technology trends, tutorials, and insights from industry experts.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechBlog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechBlog - Latest Tech News & Tutorials",
    description: "Stay updated with the latest technology trends, tutorials, and insights from industry experts.",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
            <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          </>
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Suspense fallback={null}>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <SearchModal />
              <CookieConsent />
              <PerformanceDebugger />
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
