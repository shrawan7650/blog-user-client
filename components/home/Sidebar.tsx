"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdSlot } from "@/components/ads/AdSlot";
import { postsService } from "@/services/postsService";
import { newsletterService } from "@/services/newsletterService";
import type { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import NewsletterForm from "../NewsletterForm";

export function Sidebar() {
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  const fetchPopularPosts = async () => {
    try {
      const posts = await postsService.getPopularPosts(5);
      setPopularPosts(posts);
    } catch (error) {
      // console.error("Error fetching popular posts:", error);
    }
  };

  //skelton

  return (
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <NewsletterForm />

      {/* Ad Slot */}
      {/* <AdSlot slot="sidebar" format="vertical" /> */}

      {/* Popular Posts */}

      {/* Popular Posts */}
      <div className="space-y-4">
        {popularPosts.length === 0
          ? // Skeleton while loading
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg">
                {/* Image Skeleton */}
                <Skeleton className="w-16 h-16 rounded-md" />

                {/* Text Skeletons */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
              </div>
            ))
          : // Actual popular posts
            popularPosts.map((post, index) => (
              <div key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-4 p-3 transition-all rounded-lg hover:bg-muted/30"
                >
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                    <Image
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium leading-tight transition-colors line-clamp-2 group-hover:text-primary">
                      {post.title}
                    </h4>
                    <div className="flex flex-wrap items-center mt-1 text-xs gap-x-3 gap-y-1 text-muted-foreground">
                      <span>{post.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span>{post.createdAt.toDate().toDateString()}</span>
                    </div>
                    <span className="inline-block mt-1 text-xs font-medium text-primary group-hover:underline">
                      Read More →
                    </span>
                  </div>
                </Link>

                {index !== popularPosts.length - 1 && (
                  <hr className="my-3 border-t border-border" />
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
