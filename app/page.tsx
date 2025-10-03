import { HeroSection } from "@/components/home/HeroSection";
import { TrendingPosts } from "@/components/home/TrendingPosts";
import { BlogPostsSection } from "@/components/home/BlogPostsSection";
import { Sidebar } from "@/components/home/Sidebar";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Metadata } from "next";
import { useSelector } from "react-redux";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inspitech Blog - Latest Tech News & Tutorials",
  description:
    "Stay updated with the latest technology trends, tutorials, and insights from industry experts.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-muted/50">
      {/* Hero Section */}{" "}
      <div className="min-h-[45rem] ">
        {" "}
        <HeroSection />
      </div>
      {/* <hr /> */}
      {/* Trending Posts */}
      <section className="py-8 md:mt-[15rem] ">
        <div className="container px-4 mx-auto">
          <TrendingPosts />
        </div>
      </section>
      {/* Categories */}
      <section className="hidden py-8 md:block">
        <div className="container px-4 mx-auto">
          <CategoriesSection />
        </div>
      </section>
      {/* Main Content */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
      {/* <div className="py-4 bg-muted/20">
        <div className="container px-4 mx-auto">
          <AdSlot slot="footer-banner" format="vertical" className="max-w-4xl mx-auto" />
        </div>
      </div> */}
    </div>
  );
}
