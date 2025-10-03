"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { postsService } from "@/services/postsService"
import type { BlogPostWithAuthor } from "@/types/blog"
import PostCard from "../blog/PostCard"

export function TrendingPosts() {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const postsPerPage = 12

  useEffect(() => {
    fetchTrendingPosts()
  }, [currentPage])

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true)
      const result = await postsService.getTrendingPosts(currentPage, postsPerPage)
      
      // Assuming your service returns { posts, totalPages } or { posts, hasMore }
      // If it returns hasMore, you'll need to modify the service to return totalPages
      setPosts(result.posts)
      
      // If your service returns totalPages:
      if ('totalPages' in result) {
        setTotalPages(result.totalPages)
      } else if ('hasMore' in result) {
        // Calculate total pages based on hasMore (this is a workaround)
        // You should modify your service to return totalPages for better UX
        setTotalPages(result.hasMore ? currentPage + 1 : currentPage)
      }
    } catch (error) {
      // console.error("Error fetching trending posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Generate page numbers with smart ellipsis
  const generatePageNumbers = () => {
    const pages = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Add ellipsis and pages around current page
      if (currentPage > 3) {
        pages.push('ellipsis1')
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      // Add ellipsis before last page if needed
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis2')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Trending Posts</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-sm bg-card animate-pulse">
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

        {/* Pagination skeleton */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-20 h-8 rounded bg-muted animate-pulse"></div>
          <div className="w-8 h-8 rounded bg-muted animate-pulse"></div>
          <div className="w-8 h-8 rounded bg-muted animate-pulse"></div>
          <div className="w-8 h-8 rounded bg-muted animate-pulse"></div>
          <div className="w-20 h-8 rounded bg-muted animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Trending Posts</h2>
        </div>
        {totalPages > 1 && (
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {posts.length===0 ? (
        // Loading state for page changes
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-sm bg-card animate-pulse">
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
      ) : (
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
       views={post.views} 
     />
        ))}
      </div>
      
      )}

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {/* Previous Page Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((page, index) => {
              if (page === 'ellipsis1' || page === 'ellipsis2') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                )
              }

              const pageNum = page as number
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          {/* Next Page Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || loading}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* {posts.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No trending posts found.</p>
        </div>
      )} */}
    </div>
  )
}