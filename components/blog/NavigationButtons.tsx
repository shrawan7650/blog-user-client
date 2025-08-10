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
    <div className="flex flex-col items-center gap-4 pt-8 mt-12 border-t sm:flex-row sm:justify-between">
    <div className="w-full sm:w-1/2">
      {prevPost && (
        <Button variant="outline" asChild className="w-full bg-transparent group sm:w-auto">
          <Link href={`/blog/${prevPost.slug}`} className="flex items-center justify-center space-x-2 sm:justify-start">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <div className="max-w-full text-left">
              <div className="text-xs text-muted-foreground">Previous</div>
              <div className="max-w-full overflow-hidden font-medium line-clamp-1 text-ellipsis whitespace-nowrap">
                {prevPost.title.slice(0, 20) || "No title available"}...
              </div>
            </div>
          </Link>
        </Button>
      )}
    </div>
  
    <div className="w-full text-center sm:w-1/2 sm:text-right">
      {nextPost && (
        <Button variant="outline" asChild className="w-full bg-transparent group sm:w-auto">
          <Link href={`/blog/${nextPost.slug}`} className="flex items-center justify-center space-x-2 sm:justify-end">
            <div className="max-w-full text-right">
              <div className="text-xs text-muted-foreground">Next</div>
              <div className="max-w-full overflow-hidden font-medium line-clamp-1 text-ellipsis whitespace-nowrap">
                {nextPost?.title.slice(0, 20) || "No title available"
                
                }...
              </div>
            </div>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  </div>
  
  
  )
}
