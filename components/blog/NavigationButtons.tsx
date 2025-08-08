"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { postsService } from "@/services/postsService"
import type { BlogPost } from "@/types/blog"

interface NavigationButtonsProps {
  currentSlug: string
  category: string
}

export function NavigationButtons({ currentSlug, category }: NavigationButtonsProps) {
  console.log("currentSlug", currentSlug)
  console.log("category", category) 
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    fetchNavigationPosts()
  }, [currentSlug, category])

  const fetchNavigationPosts = async () => {
    try {
      const { posts } = await postsService.getPosts(1, 100, category)
      const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

      if (currentIndex > 0) {
        setPrevPost(posts[currentIndex - 1])
      }

      if (currentIndex < posts.length - 1) {
        setNextPost(posts[currentIndex + 1])
      }
    } catch (error) {
      console.error("Error fetching navigation posts:", error)
    }
  }

  return (
    <div className="flex items-center justify-between pt-8 mt-12 border-t">
      <div className="flex-1">
        {prevPost && (
          <Button variant="outline" asChild className="bg-transparent group">
            <Link href={`/blog/${prevPost.slug}`} className="flex items-center space-x-2">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-medium line-clamp-1">{prevPost.title}</div>
              </div>
            </Link>
          </Button>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextPost && (
          <Button variant="outline" asChild className="bg-transparent group">
            <Link href={`/blog/${nextPost.slug}`} className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Next</div>
                <div className="font-medium line-clamp-1">{nextPost.title}</div>
              </div>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
