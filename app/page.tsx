import { HeroSection } from "@/components/home/HeroSection"
import { TrendingPosts } from "@/components/home/TrendingPosts"
import { BlogPostsSection } from "@/components/home/BlogPostsSection"
import { Sidebar } from "@/components/home/Sidebar"
import { CategoriesSection } from "@/components/home/CategoriesSection"
import { AdSlot } from "@/components/ads/AdSlot"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TechBlog - Latest Tech News & Tutorials",
  description: "Stay updated with the latest technology trends, tutorials, and insights from industry experts.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Trending Posts */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <TrendingPosts />
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <CategoriesSection />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-2">
              <BlogPostsSection />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Ad */}
      <div className="py-4 bg-muted/20">
        <div className="container mx-auto px-4">
          <AdSlot slot="footer-banner" format="horizontal" className="max-w-4xl mx-auto" />
        </div>
      </div>
    </div>
  )
}
