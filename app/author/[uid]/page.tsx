import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usersService } from "@/services/usersService";
import { postsService } from "@/services/postsService";
import type { User, BlogPostWithAuthor } from "@/types/blog";
import { Suspense } from "react";
import { formatDate } from "@/utils/form-date";
import PostCard from "@/components/blog/PostCard";

interface AuthorPageProps {
  params: {
    uid: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  try {
    const author = await usersService.getUserById(params.uid);

    if (!author) {
      return {
        title: "Author Not Found",
      };
    }

    return {
      title: `${author.name} - TechBlog Author`,
      description: author.bio || `Read articles by ${author.name} on TechBlog`,
      openGraph: {
        title: `${author.name} - TechBlog Author`,
        description:
          author.bio || `Read articles by ${author.name} on TechBlog`,
        type: "profile",
        images: [
          {
            url: author.avatar,
            width: 400,
            height: 400,
            alt: author.name,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Author Not Found",
    };
  }
}

// Loading Components
function AuthorHeaderSkeleton() {
  return (
    <div className="p-8 mb-8 rounded-lg shadow-sm bg-card">
      <div className="flex flex-col items-start space-y-6 md:flex-row md:space-y-0 md:space-x-8">
        <Skeleton className="flex-shrink-0 w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-4">
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-full h-20" />
          <div className="flex space-x-2">
            <Skeleton className="w-24 h-8" />
            <Skeleton className="w-24 h-8" />
            <Skeleton className="w-24 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm bg-card">
      <Skeleton className="w-full h-48" />
      <div className="p-6 space-y-4">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}

function PostsGridSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex items-center justify-center mt-8 space-x-2">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-20 h-8" />
      </div>
    </div>
  );
}

export default async function AuthorPage({
  params,
  searchParams,
}: AuthorPageProps) {
  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-5xl mx-auto">
          <Suspense
            fallback={
              <>
                <AuthorHeaderSkeleton />
                <PostsGridSkeleton />
              </>
            }
          >
            <AuthorContent params={params} searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
async function AuthorContent({ params, searchParams }: AuthorPageProps) {
  let author: User | null = null;
  let posts: BlogPostWithAuthor[] = [];
  let totalPages = 0;

  // Get current page from search params, default to 1
  const currentPage = parseInt(searchParams.page || "1", 12);

  try {
    author = await usersService.getUserById(params.uid);

    if (author) {
      const result = await postsService.getPostsByAuthor(
        params.uid,
        currentPage,
        12
      );
      posts = result.posts;
      totalPages = result.totalPages;
    }
  } catch (error) {
    console.error("Error fetching author or posts:", error);
    notFound();
  }

  if (!author) {
    notFound();
  }

  // Generate pagination URLs
  const generatePageUrl = (page: number) => {
    const url = `/author/${params.uid}`;
    return page === 1 ? url : `${url}?page=${page}`;
  };

  return (
    <>
      {/* Author Header */}
      <div className="p-6 mb-8 rounded-lg shadow-sm bg-muted/50">
        <div className="flex flex-col items-start space-y-6 md:flex-row md:space-y-0 md:space-x-8 bg-muted/50">
          <div className="relative flex-shrink-0 w-32 h-32 overflow-hidden rounded-full">
            <Image
              src={
                author.avatar ||
                "/placeholder.svg?height=128&width=128&query=user"
              }
              alt={author.name}
              fill
              loading="lazy"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold">{author.name}</h1>

            <div className="flex items-center mb-4 space-x-4 text-muted-foreground">
              <span>
                {author.totalPosts} {author.totalPosts === 1 ? "post" : "posts"}
              </span>
            </div>

            {author.bio && (
              <p className="mb-6 leading-relaxed text-muted-foreground">
                {author.bio}
              </p>
            )}

            {/* Social Links */}
            {Object.keys(author.socialLinks || {}).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {author.socialLinks.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      GitHub
                    </a>
                  </Button>
                )}
                {author.socialLinks.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Linkedin className="w-4 h-4 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {author.socialLinks.twitter && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Twitter className="w-4 h-4 mr-1" />
                      Twitter
                    </a>
                  </Button>
                )}
                {author.socialLinks.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={author.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Author's Posts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold sm:text-2xl">
            {currentPage > 1
              ? `Posts by ${author.name}`
              : `Latest Posts by ${author.name}`}
          </h2>
          {/* {totalPages > 1 && (
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          )} */}
        </div>

        <div>


          {posts.length === 0 ? (
            // Loading / Empty state
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-sm bg-card animate-pulse"
                >
                  <div className="h-48 bg-muted"></div>
                  <div className="p-4 space-y-3">
                    <div className="w-3/4 h-4 rounded bg-muted"></div>
                    <div className="w-full h-3 rounded bg-muted"></div>
                    <div className="w-2/3 h-3 rounded bg-muted"></div>
                    <div className="flex space-x-4">
                      <div className="w-16 h-3 rounded bg-muted"></div>
                      <div className="w-16 h-3 rounded bg-muted"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              {/* Posts Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    featuredImage={post.featuredImage}
                    createdAt={post.createdAt.toDate().toISOString()}
                    author={post.author}
                    readingTime={post.readingTime}
                    views={post.views} // Pass views prop
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-8 space-x-2">
                  {/* Previous Page */}
                  {currentPage > 1 ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={generatePageUrl(currentPage - 1)}>
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        const showPage =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - currentPage) <= 1;

                        if (!showPage && pageNum === 2 && currentPage > 4) {
                          return (
                            <span
                              key="ellipsis1"
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }

                        if (
                          !showPage &&
                          pageNum === totalPages - 1 &&
                          currentPage < totalPages - 3
                        ) {
                          return (
                            <span
                              key="ellipsis2"
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            asChild
                          >
                            <Link href={generatePageUrl(pageNum)}>
                              {pageNum}
                            </Link>
                          </Button>
                        );
                      }
                    )}
                  </div>

                  {/* Next Page */}
                  {currentPage < totalPages ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={generatePageUrl(currentPage + 1)}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                No posts found by this author yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
