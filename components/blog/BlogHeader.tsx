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
  console.log("post", post);
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
        <hr className="border-t border-muted-foreground/20" />

        {/* Author Info */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left Side - Author Card */}
          <Link
            href={`/author/${author.uid}`}
            className="flex flex-col w-full gap-4 p-4 transition rounded-lg sm:flex-row sm:items-center bg-muted/20 hover:bg-muted/30"
          >
            <div className="relative flex-shrink-0 w-16 h-16 mx-auto overflow-hidden rounded-full sm:mx-0">
              <Image
                src={
                  author.avatar ||
                  "/placeholder.svg?height=64&width=64&query=user"
                }
                alt={author.name}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <h3 className="text-lg font-semibold">{author.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {author.totalPosts}{" "}
                  {author.totalPosts === 1 ? "post" : "posts"}
                </span>
              </div>
              {author.bio && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {author.bio}
                </p>
              )}
            </div>
          </Link>

          {/* Right Side - Social Links */}
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
              </div>
            )}
          </div>
        </div>

        {/* Post Meta */}
        <div className="flex flex-wrap items-center justify-between mt-5 text-sm text-muted-foreground">
  {/* Left group */}
  <div className="flex flex-wrap items-center gap-6">
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4" />
      <span>{formatDate(post.createdAt)}</span>
    </div>

    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4" />
      <span>{post.readingTime}</span>
    </div>

    <div className="flex items-center space-x-2">
      <Eye className="w-4 h-4" />
      <span>{post.views.toLocaleString()} views</span>
    </div>
  </div>

  {/* Right group */}
  <div className="flex items-center space-x-2">
    <Calendar className="w-4 h-4 text-blue-500" />
    <span>Updated: {formatDate(post.updatedAt)}</span>
  </div>
</div>

        <hr className="border-t border-muted-foreground/20" />
      </div>
      {/* //last upadted blog */}
    </header>
  );
}
