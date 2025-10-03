"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, User } from "lucide-react"
import { postsService } from "@/services/postsService"
import type { BlogPost } from "@/types/blog"
import PostCard from "./PostCard"

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
      // console.error("Error fetching related posts:", error)
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
         <PostCard
         key={post.slug}
         slug={post.slug}
         title={post.title}
         excerpt={post.excerpt}
         featuredImage={post.featuredImage}
         createdAt={post.createdAt}
         author={post.author}
         readingTime={post.readingTime}
          views={post.views} // Pass views prop
       />
        ))}
      </div>
    </div>
  )
}
