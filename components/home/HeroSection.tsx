"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postsService } from "@/services/postsService";
import type { BlogPostWithAuthor } from "@/types/blog";

export function HeroSection() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const posts = await postsService.getFeaturedPosts();
        // Sort posts by createdAt to get the newest first
        const sortedPosts = posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeaturedPosts(sortedPosts);
      } catch (error) {
        // console.error("Error fetching featured posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const SkeletonCard = ({ isCenter = false }) => (
    <div
      className={` dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden ${
        isCenter ? "h-[95%]" : "h-full"
      }`}
    >
      {/* Image Skeleton */}
      <div
        className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${
          isCenter ? "h-48 lg:h-64" : "h-40 lg:h-48"
        }`}
      >
        <div className="absolute top-4 left-4">
          <div className="w-20 h-6 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow p-4 lg:p-6">
        {/* Author & Meta */}
        <div className="flex items-center mb-3 space-x-3">
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-12 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-2 space-y-2">
          <div className="w-full h-6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-3/4 h-6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Excerpt Skeleton */}
        <div className="mb-4 space-y-2">
          <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-5/6 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="w-2/3 h-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Button Skeleton */}
        <div className="mt-auto">
          <div className="w-24 h-8 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-12 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:gap-6 lg:h-[600px]">
            {/* Left Side - 30% */}
            <div  className="flex flex-col w-[30%] space-y-6">
              <div className="flex-1">
                <SkeletonCard />
              </div>
              <div className="flex-1">
                <SkeletonCard />
              </div>
            </div>

            {/* Center - 40% */}
            <div className="w-[40%]">
              <SkeletonCard isCenter={true} />
            </div>

            {/* Right Side - 30% */}
            <div className="flex flex-col w-[30%] space-y-6">
              <div className="flex-1">
                <SkeletonCard />
              </div>
              <div className="flex-1">
                <SkeletonCard />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="grid grid-cols-1 gap-6 lg:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} isCenter={i === 0} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredPosts.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-600 dark:text-slate-400">
            No featured posts available
          </h2>
          <p className="text-slate-500 dark:text-slate-500">
            Check back later for featured content.
          </p>
        </div>
      </section>
    );
  }

  // Arrange posts: newest in center, others around it
  const newestPost = featuredPosts[0];
  const leftPosts = featuredPosts.slice(1, 3); // Next 2 posts for left side
  const rightPosts = featuredPosts.slice(3, 5); // Next 2 posts for right side

  const BlogCard = ({ post, isCenter = false, priority = false }) => {
    return (
      <article
        className={`group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${
          isCenter ? "h-[95%]" : "h-full"
        }`}
      >
        {/* Image Container */}
        <div
          className={`relative overflow-hidden ${
            isCenter ? "h-48 lg:h-64" : "h-40 lg:h-48"
          }`}
        >
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            sizes={
              isCenter
                ? "(max-width: 1024px) 100vw, 40vw"
                : "(max-width: 1024px) 100vw, 30vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 text-xs font-medium text-white rounded-full ${
                isCenter
                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                  : "bg-primary"
              }`}
            >
              {isCenter ? "Latest Featured" : "Featured"}
            </span>
          </div>

          {/* Overlay for better text visibility */}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4 lg:p-6">
          {/* Author, Reading Time & Comment Count */}
          <div className="flex items-center mb-3 space-x-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="relative w-5 h-5 overflow-hidden rounded-full">
                <Image
                  src={post.author?.avatar}
                  alt={post.author?.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="20px"
                />
              </div>
              <span className="font-medium">{post.author.name}</span>
            </div>
            {/* Views */}
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime}</span>
            </div>
            {/* //like */}

            {/* 
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount || 0}</span>
            </div> */}
          </div>

          {/* Title - Always show */}
          <h3
            className={`font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors ${
              isCenter
                ? "text-xl lg:text-2xl leading-tight"
                : "text-base lg:text-lg leading-tight"
            }`}
          >
            <Link href={`/blog/${post.slug}`} className="stretched-link">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt - Always show */}
          <p
            className={`text-slate-600 dark:text-slate-400 mb-4 flex-grow ${
              isCenter ? "text-base line-clamp-3" : "text-sm line-clamp-2"
            }`}
          >
            {post.excerpt}
          </p>

          {/* Read More Button - Always show */}
          <div className="mt-auto">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="group/btn float-end"
            >
              <Link href={`/blog/${post.slug}`}>
                Read More
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="py-2 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 mx-auto">
        {/* Desktop Layout: 30% - 40% - 30% */}
        <div className="hidden lg:flex lg:gap-6 lg:h-[600px]">
          {/* Left Side - 30% */}
          <div className="flex flex-col w-[30%] space-y-6">
            {leftPosts.map((post, index) => (
              <div key={post.id} className="flex-1">
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          {/* Center - 40% (5% smaller height) */}
          <div className="w-[40%]">
            <BlogCard post={newestPost} isCenter={true} priority={true} />
          </div>

          {/* Right Side - 30% */}
          <div className="flex flex-col w-[30%] space-y-6">
            {rightPosts.map((post, index) => (
              <div key={post.id} className="flex-1">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout: Vertical Stack */}
        <div className="grid grid-cols-1 gap-6 lg:hidden">
          {/* Newest post first on mobile */}
          <BlogCard post={newestPost} isCenter={true} priority={true} />

          {/* Rest of the posts */}
          {[...leftPosts, ...rightPosts].map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
