"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Eye,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowLeft,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPostWithAuthor } from "@/types/blog";
import { formatDate } from "@/utils/form-date";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

interface BlogHeaderProps {
  post: BlogPostWithAuthor;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  const { author } = post;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Fetch categories when the component mounts
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <header className="space-y-6">
      <div className="relative h-[400px] overflow-hidden rounded-lg">
        <Image
          src={post.featuredImage || "/placeholder.svg"}
          loading="lazy"
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title and Meta */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          {post.title}
        </h1>

        <p className="text-xl leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        {/* //line */}

        {/* Author Info */}
        {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         
          <Link
            href={`/author/${author.uid}`}
            className="flex flex-col w-full gap-4 p-4 transition rounded-lg sm:flex-row sm:items-center "
          >
            <div className="relative w-20 h-20 mx-auto mb-1 overflow-hidden border rounded-full">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={`${author.name}'s avatar`}
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-2xl font-bold bg-gray-200 text-muted-foreground">
                  {author?.name
                    ? author.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "?"}
                </div>
              )}
            </div>

    
          </Link>

        
          <div className=" sm:w-[40%]">
            {" "}
            {Object.keys(author.socialLinks).length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 md:justify-end">
                {author.socialLinks.github && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {author.socialLinks.linkedin && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {author.socialLinks.twitter && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {author.socialLinks.website && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={author.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {author.socialLinks.instagram && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={author.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div> */}

        {/* Post Meta */}
        <div className="max-w-md p-4 mt-5 space-y-3 text-sm border shadow-sm float-end rounded-2xl bg-card text-muted-foreground">
          <div className="grid grid-cols-2 gap-3">
            {/* Published Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span>{post.readingTime}</span>
            </div>

            {/* Views */}
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-500" />
              <span>{post.views.toLocaleString()} views</span>
            </div>

            {/* Updated Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Updated: {formatDate(post.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
