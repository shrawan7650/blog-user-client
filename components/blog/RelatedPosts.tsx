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
      const relatedPosts = allPosts.filter((post:any) => post.slug !== currentSlug).slice(0, 3)
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
        <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-sm bg-card animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="w-3/4 h-4 rounded bg-muted"></div>
                <div className="w-full h-3 rounded bg-muted"></div>
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

  if (posts.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                loading="lazy"
                
                
              />
            </div>

            <div className="p-4">
              <h3 className="mb-2 font-semibold transition-colors line-clamp-2 group-hover:text-primary">
                {post.title}
              </h3>

              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{post.summary}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span>{(post as any).author.name}</span> 
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
