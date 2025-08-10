"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { Clock, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/ui/LazyImage"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setCurrentPage, setSelectedCategory, setPosts, setLoading } from "@/store/slices/postsSlice"
import { postsService } from "@/services/postsService"
import { categoriesService } from "@/services/categoriesService"
import { PerformanceMonitor } from "@/lib/performance"
import type { Category } from "@/types/blog"
import Image from "next/image";
const performanceMonitor = PerformanceMonitor.getInstance()

export function BlogPostsSection() {
  const dispatch = useAppDispatch()
  const { posts, currentPage, selectedCategory, loading } = useAppSelector((state) => state.posts)
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Memoize categories with "All" option
  const categoriesWithAll = useMemo(() => {
    return [{ id: "all", name: "All", slug: "all", icon: "📚" }, ...categories]
  }, [categories])

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchCategories = useCallback(async () => {
    const endTiming = performanceMonitor.startTiming("fetchCategories")
    try {
      const data = await categoriesService.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      endTiming()
    }
  }, [])

  const fetchPosts = useCallback(async () => {
    const endTiming = performanceMonitor.startTiming("fetchPosts")
    try {
      dispatch(setLoading(true))
      const { posts: newPosts, totalPages: total } = await postsService.getPosts(
        currentPage,
        6,
        selectedCategory === "all" ? undefined : selectedCategory,
      )
      dispatch(setPosts(newPosts))
      setTotalPages(total)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      dispatch(setLoading(false))
      endTiming()
    }
  }, [currentPage, selectedCategory, dispatch])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      dispatch(setSelectedCategory(categoryId))
      dispatch(setCurrentPage(1))
    },
    [dispatch],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page))
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [dispatch],
  )

  // Memoized pagination buttons to prevent re-renders
  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) return null

    const buttons = []
    const maxButtons = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxButtons - 1)

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
        </Button>,
      )
    }

    return buttons
  }, [currentPage, totalPages, handlePageChange])

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Latest Posts</h2>

        {/* Category Skeleton */}
        <div className="flex pb-2 space-x-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-20 h-8 rounded-full bg-muted animate-pulse"></div>
          ))}
        </div>

        {/* Posts Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Latest Posts</h2>

      {/* Category Filter */}
      {/* <div className="flex pb-2 space-x-2 overflow-x-auto scrollbar-hide">
        {categoriesWithAll.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.id)}
            className="flex-shrink-0 transition-all duration-200"
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div> */}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <div className="border rounded-md">
                <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="overflow-hidden transition-all duration-200 rounded-lg shadow-sm group bg-card hover:shadow-md"
          >

<div className="relative w-full h-48 overflow-hidden">
  <Image
    src={post.featuredImage || "/placeholder.svg"}
    alt={post.title}
    layout="fill"
    objectFit="cover"
    className="transition-transform duration-200 group-hover:scale-105"
    priority={index < 2}
  />
</div>

            <div className="p-4">
              <div className="flex items-center mb-2 space-x-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {categories.find((c) => c.id === post.category)?.name || post.category}
                </span>
              </div>

              <h3 className="mb-2 font-semibold transition-colors line-clamp-2 group-hover:text-primary">
                {post.title}
              </h3>

              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{post.summary}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span>{post.author.name||""}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </Link>
          </div>
      
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
  )
}
