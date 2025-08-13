"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setCurrentPage,
  setPosts,
  setLoading,
} from "@/store/slices/postsSlice";
import { postsService } from "@/services/postsService";

import Image from "next/image";
import PostCard from "../blog/PostCard";

export function BlogPostsSection() {
  const dispatch = useAppDispatch();
  const { posts, currentPage, selectedCategory, loading } = useAppSelector(
    (state) => state.posts
  );
  const { items: categories } = useAppSelector((state) => state.categories);

  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
  
      const {
        posts: newPosts,
        totalPages: total,
      } = await postsService.getPosts(
        currentPage,
        6,
        selectedCategory === "all" ? undefined : selectedCategory
      );
  

      // ✅ Date ko string me convert
      const cleanedPosts = newPosts.map(post => ({
        ...post,
        createdAt: post.createdAt?.toDate().toISOString() ?? null,
        updatedAt: post.updatedAt?.toDate().toISOString() ?? null,
      }));
      
  
      dispatch(setPosts(cleanedPosts));
      setTotalPages(total);
  
    } catch (error) {
      console.error("Error fetching posts:", error);
    } 
  }, [currentPage, selectedCategory, dispatch]);
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
      // Smooth scroll to top
      // window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [dispatch]
  );

  // Memoized pagination buttons to prevent re-renders
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="w-8 h-8 p-0"
        >
          {i}
        </Button>
      );
    }

    return buttons;
  }, [currentPage, totalPages, handlePageChange]);

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Latest Posts</h2>

        {/* Category Skeleton */}
        {/* <div className="flex pb-2 space-x-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-20 h-8 rounded-full bg-muted animate-pulse"
            ></div>
          ))}
        </div> */}

        {/* Posts Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Latest Posts</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {posts.map((post) => (
         <PostCard
         key={post.slug}
         slug={post.slug}
         title={post.title}
         excerpt={post.excerpt}
         featuredImage={post.featuredImage}
         createdAt={post.createdAt}
         author={post.author}
         readingTime={post.readingTime}
       />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">{paginationButtons}</div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
