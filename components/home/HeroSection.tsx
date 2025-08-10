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
      }, 10000) // Change every 10 seconds

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
    <section className="relative h-[600px]  overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentPost.featuredImage || "/placeholder.svg"}
          alt={currentPost.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex items-center h-full px-4 mx-auto">
        <div className="max-w-2xl text-white">
          <div className="flex items-center mb-4 space-x-4">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary">Featured</span>
            <div className="flex items-center space-x-2 text-sm opacity-90">
            <div className="relative w-6 h-6 overflow-hidden rounded-full">
                <Image
                  src={currentPost.author.avatar || "/placeholder.svg?height=24&width=24&query=user"}
                  alt={currentPost.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{currentPost.author.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <Clock className="w-4 h-4" />
              <span>{currentPost.readingTime}</span>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">{currentPost.title}</h1>

          <p className="mb-6 text-lg opacity-90 line-clamp-3">{currentPost.summary}</p>

          <Button asChild size="lg" className="group">
            <Link href={`/blog/${currentPost.slug}`}>
              Read More
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Indicators */}
      {featuredPosts.length > 1 && (
        <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-6 left-1/2">
          {featuredPosts.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
