"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, User } from "lucide-react"
import { postsService } from "@/services/postsService"
import type { BlogPost } from "@/types/blog"

interface RelatedPostsProps {
  category: string
  currentSlug: string
}

export function RelatedPosts({ category, currentSlug }: RelatedPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedPosts()
  }, [category, currentSlug])

  const fetchRelatedPosts = async () => {
    try {
      const { posts: allPosts } = await postsService.getPosts(1, 20, category)
      const relatedPosts = allPosts.filter((post) => post.slug !== currentSlug).slice(0, 3)
      setPosts(relatedPosts)
    } catch (error) {
      console.error("Error fetching related posts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
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

  if (posts.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <User className="w-3 h-3" />
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
    </div>
  )
}
