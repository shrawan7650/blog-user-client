"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { postsService } from "@/services/postsService"
import type { BlogPost } from "@/types/blog"

interface CategoryPostsProps {
  categoryId: string
}

export function CategoryPosts({ categoryId }: CategoryPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [categoryId, currentPage])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { posts: newPosts, totalPages: total } = await postsService.getPosts(currentPage, 10, categoryId)
      setPosts(newPosts)
      setTotalPages(total)
    } catch (error) {
      console.error("Error fetching category posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading && posts.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-sm bg-card animate-pulse">
            <div className="h-48 bg-muted"></div>
            <div className="p-6 space-y-3">
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
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">No posts found in this category yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="overflow-hidden transition-all duration-200 rounded-lg shadow-sm group bg-card hover:shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <div className="p-6">
              <h2 className="mb-3 text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                {post.title}
              </h2>

              <p className="mb-4 text-muted-foreground line-clamp-3">{post.summary}</p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </Link>
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

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
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
              )
            })}
          </div>

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
