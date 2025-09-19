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

  const [prevPost, setPrevPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNavigationPosts()
  }, [currentSlug, category])

  const fetchNavigationPosts = async () => {
    try {
      setLoading(true)
      const { posts } = await postsService.getPosts(1, 100, category)
      const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

      setPrevPost(currentIndex > 0 ? posts[currentIndex - 1] : null)
      setNextPost(currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null)
    } catch (error) {
      console.error("Error fetching navigation posts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-2 border-t ">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          {/* Previous button skeleton */}
          <div className="flex-1">
            <div className="h-16 rounded-lg bg-muted animate-pulse sm:max-w-xs"></div>
          </div>
          {/* Next button skeleton */}
          <div className="flex-1 sm:flex sm:justify-end">
            <div className="h-16 rounded-lg bg-muted animate-pulse sm:max-w-xs"></div>
          </div>
        </div>
      </div>
    )
  }

  // If no navigation posts available
  if (!prevPost && !nextPost) {
    return null
  }

  return (
    <div className="pt-8 mt-12 border-t">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
        {/* Previous Post Button */}
        <div className="flex-1 sm:max-w-xs">
          {prevPost ? (
            <Button 
              variant="outline" 
              asChild 
              className="w-full h-auto p-4 bg-transparent border-dashed hover:bg-muted/50 group"
            >
              <Link href={`/blog/${prevPost.slug}`} className="flex items-start gap-3">
                <ChevronLeft className="w-5 h-5 mt-1 transition-transform shrink-0 group-hover:-translate-x-1 text-muted-foreground" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                    Previous
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
                    {prevPost.title.slice(0,30)}...
                  </div>
                </div>
              </Link>
            </Button>
          ) : (
            <div className="w-full h-16 p-4 opacity-50">
              <div className="text-xs text-muted-foreground">No previous post</div>
            </div>
          )}
        </div>

        {/* Next Post Button */}
        <div className="flex-1 sm:max-w-xs sm:flex sm:justify-end">
          {nextPost ? (
            <Button 
              variant="outline" 
              asChild 
              className="w-full h-auto p-4 bg-transparent border-dashed hover:bg-muted/50 group sm:w-full"
            >
              <Link href={`/blog/${nextPost.slug}`} className="flex items-start gap-3">
                <div className="flex-1 min-w-0 text-left sm:text-right">
                  <div className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                    Next
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
                    {nextPost.title.slice(0,30)}...
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 mt-1 transition-transform shrink-0 group-hover:translate-x-1 text-muted-foreground" />
              </Link>
            </Button>
          ) : (
            <div className="w-full h-16 p-4 opacity-50 sm:text-right">
              <div className="text-xs text-muted-foreground">No next post</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only: Show navigation dots/indicators */}
      <div className="flex items-center justify-center mt-6 sm:hidden">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${prevPost ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${nextPost ? 'bg-primary' : 'bg-muted'}`}></div>
        </div>
        <div className="ml-4 text-xs text-muted-foreground">
          Navigate between posts
        </div>
      </div>
    </div>
  )
}