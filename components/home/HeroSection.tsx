"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { postsService } from "@/services/postsService"
import type { BlogPostWithAuthor } from "@/types/blog"

export function HeroSection() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostWithAuthor[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const posts = await postsService.getFeaturedPosts()
        setFeaturedPosts(posts)
      } catch (error) {
        console.error("Error fetching featured posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPosts()
  }, [])

  useEffect(() => {
    if (featuredPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredPosts.length)
      }, 5000) // Change every 10 seconds

      return () => clearInterval(interval)
    }
  }, [featuredPosts.length])

  if (loading) {
    return (
      <section className="relative h-[600px] bg-muted animate-pulse">
        <div className="container flex items-center h-full px-4 mx-auto">
          <div className="w-full max-w-2xl space-y-4">
            <div className="w-3/4 h-8 rounded bg-muted-foreground/20"></div>
            <div className="w-full h-4 rounded bg-muted-foreground/20"></div>
            <div className="w-2/3 h-4 rounded bg-muted-foreground/20"></div>
            <div className="w-32 h-10 rounded bg-muted-foreground/20"></div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredPosts.length === 0) {
    return null
  }

  const currentPost = featuredPosts[currentIndex]

  return (
<section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src={currentPost.featuredImage || "/placeholder.svg"}
      alt={currentPost.title}
      fill
      className="object-cover"
      loading={currentIndex === 0 ? "eager" : "lazy"}
      sizes="100vw"
    />
    <div className="absolute inset-0 bg-black/50" />
  </div>

  {/* Content */}
  <div className="container relative z-10 flex items-center h-full px-4 mx-auto">
    <div className="max-w-xl text-white sm:max-w-2xl">
      {/* Tags / Author / Reading time */}
      <div className="flex flex-wrap items-center mb-3 space-x-2 sm:space-x-4">
        <span className="px-2 py-1 text-xs font-medium rounded-full sm:text-sm bg-primary">
          Featured
        </span>

        <div className="flex items-center space-x-2 text-xs sm:text-sm opacity-90">
          <div className="relative w-5 h-5 overflow-hidden rounded-full sm:w-6 sm:h-6">
            <Image
              src={currentPost.author.avatar || "/placeholder.svg?height=24&width=24&query=user"}
              alt={currentPost.author.name}
              fill
              className="object-cover"
              loading="lazy"
              sizes="24px"
            />
          </div>
          <span>By:{currentPost.author.name}</span>
        </div>

        <div className="flex items-center space-x-1 text-xs sm:space-x-2 sm:text-sm opacity-90">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{currentPost.readingTime}</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-2 text-2xl font-bold leading-tight sm:mb-4 sm:text-4xl md:text-5xl">
        {currentPost.title}
      </h1>

      {/* Summary */}
      <p className="mb-4 text-sm opacity-90 line-clamp-2 sm:mb-6 sm:text-lg sm:line-clamp-3">
        {currentPost.summary}
      </p>

      {/* Button */}
      <Button asChild size="sm" className="group sm:size-lg">
        <Link href={`/blog/${currentPost.slug}`}>
          Read More
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  </div>

  {/* Indicators */}
  {featuredPosts.length > 1 && (
    <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 sm:bottom-6 left-1/2">
      {featuredPosts.map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
            index === currentIndex ? "bg-white" : "bg-white/50"
          }`}
          onClick={() => setCurrentIndex(index)}
          aria-label={`Show featured post ${index + 1}`}
          aria-pressed={index === currentIndex}
          style={{ outline: "none" }}
        />
      ))}
    </div>
  )}
</section>

  )
}
