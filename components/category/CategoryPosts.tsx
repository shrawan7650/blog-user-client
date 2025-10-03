"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postsService } from "@/services/postsService";
import type { BlogPost } from "@/types/blog";
import PostCard from "../blog/PostCard";
import PostListItem from "../blog/PostListItem";

interface CategoryPostsProps {
  categoryId: string;
}

export function CategoryPosts({ categoryId }: CategoryPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // 👈 new state

  useEffect(() => {
    fetchPosts();
  }, [categoryId, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const {
        posts: newPosts,
        totalPages: total,
      } = await postsService.getPosts(currentPage, 10, categoryId);
      setPosts(newPosts);
      setTotalPages(total);
    } catch (error) {
      // console.error("Error fetching category posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 rounded-lg shadow-sm animate-pulse"
          >
            {/* Image placeholder */}
            <div className="h-40 mb-4 bg-gray-200 rounded-md"></div>

            {/* Title placeholder */}
            <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>

            {/* Subtitle placeholder */}
            <div className="w-1/2 h-3 mb-4 bg-gray-200 rounded"></div>

            {/* Button / meta placeholder */}
            <div className="flex space-x-2">
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
              <div className="w-12 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-2xl font-semibold">No Posts Yet</h3>
        <p className="text-lg text-muted-foreground">
          There are no posts available in this category at the moment. Stay
          tuned – new content is coming soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Switcher */}
      <div className="flex justify-end">
        <div className="p-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex space-x-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-gray-700 text-white dark:bg-gray-600"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-gray-700 text-white dark:bg-gray-600"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts Display */}
      {viewMode === "grid" ? (
        // Responsive Grid Layout
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 sm:gap-1 lg:gap-8">
          {posts.map((post) => (
            <div key={post.slug} className="flex">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      ) : (
        // Full-Width List Layout
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post) => (
            <PostListItem key={post.slug} {...post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
