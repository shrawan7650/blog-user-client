"use client";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye } from "lucide-react";
import type { BlogPostWithAuthor } from "@/types/blog";
import { formatDate } from "@/utils/form-date";

interface BlogHeaderProps {
  post: BlogPostWithAuthor;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  const { author } = post;

  return (
    <header className="space-y-6">
      {/* Featured Image */}
      <div className="relative h-[300px] overflow-hidden rounded-lg">
        <Image
          src={post.featuredImage || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Title and Meta */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>

        {/* Author + Published Date */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>
            By{" "}
            <Link
              href={`/author/${author?.uid || "#"}`}
              className="font-medium text-primary hover:underline"
            >
              {author?.name || "Unknown"}
            </Link>
          </span>

          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readingTime}
          </span>

          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {post.views.toLocaleString()} views
          </span>

          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-orange-500" />
            Updated: {formatDate(post.updatedAt)}
          </span>
        </div>

        {/* Excerpt */}
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
      </div>
    </header>
  );
}
