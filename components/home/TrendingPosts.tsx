"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { postsService } from "@/services/postsService"
import type { BlogPostWithAuthor } from "@/types/blog"

export function TrendingPosts() {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchTrendingPosts()
  }, [currentPage])

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true)
      const { posts: newPosts, hasMore: moreAvailable } = await postsService.getTrendingPosts(currentPage, 6)

      if (currentPage === 1) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }

      setHasMore(moreAvailable)
    } catch (error) {
      console.error("Error fetching trending posts:", error)
    } finally {
      setLoading(false)
    }
  }
// console.log("posts",posts)
  const loadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Trending Posts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
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
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Trending Posts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.summary}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                <div className="relative w-4 h-4 overflow-hidden rounded-full">
                    <Image
                      src={post.author.avatar || "/placeholder.svg?height=16&width=16&query=user"}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button onClick={loadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
