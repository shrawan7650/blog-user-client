"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: string | Date;
  author: { name: string; avatar?: string };
  readingTime: string;
  views: number;
}

export default function PostCard({
  slug,
  title,
  excerpt,
  featuredImage,
  createdAt,
  author,
  readingTime,
  views,
}: PostCardProps) {
  return (
    <article className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white shadow-lg group rounded-xl dark:bg-slate-800 hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden lg:h-48">
        <Image
          src={featuredImage || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 30vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-primary">
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 lg:p-6">
        {/* Author, Views & Reading Time */}
        <div className="flex items-center mb-3 space-x-3 text-sm text-slate-600 dark:text-slate-400">
          {/* Author */}
          <div className="flex items-center space-x-2">
            <div className="relative w-5 h-5 overflow-hidden rounded-full">
              <Image
                src={author.avatar || "/placeholder.svg"}
                alt={author.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="20px"
              />
            </div>
            <span className="font-medium">{author.name}</span>
          </div>

          {/* Views */}
          <div className="items-center hidden space-x-1 md:flex">
            <Eye className="w-4 h-4" />
            <span>{views}</span>
          </div>

          {/* Reading Time */}
          <div className="items-center hidden space-x-1 md:flex">
            <Clock className="w-4 h-4" />
            <span>{readingTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold leading-tight ransition-colors l text-slate-900 dark:text-slate-100 group-hover:text-primary lg:text-lg line-clamp-2">
          <Link href={`/blog/${slug}`} className="stretched-link">
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="flex-grow mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {excerpt}
        </p>

        {/* Read More Button */}
        <div className="mt-auto">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="group/btn float-end"
          >
            <Link href={`/blog/${slug}`}>
              Read More
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
