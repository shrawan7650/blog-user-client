"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: { seconds: number; nanoseconds: number };
  author: { name: string; avatar?: string };
  readingTime: string;
}

export default function PostCard({
  slug,
  title,
  excerpt,
  featuredImage,
  createdAt,
  author,
  readingTime,
}: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="overflow-hidden transition-all duration-300 border rounded-xl border-border group hover:border-primary/50 bg-card"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={featuredImage || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col h-full p-5">
        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold leading-snug transition-colors line-clamp-2 group-hover:text-primary">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
          {excerpt}
        </p>

        {/* Divider */}
        <hr className="my-3 border-border" />

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 overflow-hidden rounded-full">
              <Image
                src={author.avatar || "/placeholder.svg"}
                alt={author.name}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <span>{author.name}</span>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{readingTime}</span>
          </div>
        </div>

        {/* Read More */}
        <div className="mt-4">
          <span className="inline-block text-sm font-medium text-primary group-hover:underline">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
}
