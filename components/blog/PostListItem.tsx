"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
interface PostListItemProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: { seconds: number; nanoseconds: number };
  author: { name: string; avatar?: string };
  readingTime: string;
  views: number;
}

export default function PostListItem({
  slug,
  title,
  excerpt,
  featuredImage,
  createdAt,
  author,
  readingTime,
  views,
}: PostListItemProps) {
  return (
    <div className="group">
      <Link
        href={`/blog/${slug}`}
        className="flex flex-row transition-all duration-300 border rounded-xl border-border hover:border-primary/50 bg-card hover:shadow-md sm:flex-row"
      >
        {/* Left Image - 40% */}
        <div className="relative basis-[40%] w-full overflow-hidden rounded-t-xl  sm:rounded-l-xl sm:rounded-tr-none sm:h-auto">
          <Image
            src={featuredImage || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Right Content - 60% */}
        <div className="flex flex-col justify-between basis-[60%] p-4">
          {/* Title + Excerpt */}
          <div>
            <h3 className="mb-2 text-lg font-semibold leading-snug transition-colors line-clamp-1 group-hover:text-primary sm:text-xl lg:text-2xl">
              {title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:text-base lg:line-clamp-3">
              {excerpt}
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-6 h-6 overflow-hidden rounded-full sm:w-8 sm:h-8">
                  <Image
                    src={author.avatar || "/placeholder.svg"}
                    alt={author.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm font-medium sm:text-base line-clamp-1 text-muted-foreground">
                  {author.name}
                </span>
              </div>
              <div className="items-center hidden gap-3 md:flex">
                {/* Views */}
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{views}</span>
                </div>

                {/* Reading Time */}
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{readingTime}</span>
                </div>
              </div>
            </div>

            {/* Read More */}
            <div className="mt-8">
              <Button asChild size="sm" variant="outline" className="group/btn">
                <Link href={`/blog/${slug}`}>
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Link>

      {/* Gray line at bottom */}
      <hr className="mt-4 border-gray-300 dark:border-gray-600" />
    </div>
  );
}
