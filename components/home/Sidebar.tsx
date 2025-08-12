"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Mail, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdSlot } from "@/components/ads/AdSlot"
import { postsService } from "@/services/postsService"
import { newsletterService } from "@/services/newsletterService"
import type { BlogPost } from "@/types/blog"

export function Sidebar() {
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([])
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    fetchPopularPosts()
  }, [])

  const fetchPopularPosts = async () => {
    try {
      const posts = await postsService.getPopularPosts(5)
      setPopularPosts(posts)
    } catch (error) {
      console.error("Error fetching popular posts:", error)
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    try {
      await newsletterService.subscribe(email)
      setSubscriptionStatus("success")
      setEmail("")
    } catch (error) {
      setSubscriptionStatus("error")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <div className="p-6 rounded-lg shadow-sm bg-card">
        <div className="flex items-center mb-4 space-x-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Subscribe to Newsletter</h3>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          Get the latest tech insights delivered to your inbox weekly.
        </p>

        {subscriptionStatus === "success" ? (
          <div className="text-sm font-medium text-green-600">✅ Successfully subscribed! Check your email.</div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubscribing}>
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
            {subscriptionStatus === "error" && (
              <p className="text-sm text-destructive">Failed to subscribe. Please try again.</p>
            )}
          </form>
        )}
      </div>

      {/* Ad Slot */}
      <AdSlot slot="sidebar" format="vertical" />

      {/* Popular Posts */}
      <div className="p-6 rounded-lg shadow-sm bg-card">
        <div className="flex items-center mb-4 space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Popular Posts</h3>
        </div>

        <div className="space-y-4">
  {popularPosts.map((post, index) => (
    <Link
      key={post.slug}
      href={`/blog/${post.slug}`}
      className="flex items-center gap-4 p-3 transition-all border rounded-lg group border-border bg-card hover:shadow-md"
    >
      {/* Rank Badge */}
      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white rounded-full bg-primary">
        {index + 1}
      </div>

      {/* Thumbnail */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-md w-14 h-14">
        <Image
          src={post.featuredImage || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          
        />
      </div>

      {/* Post Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium leading-tight transition-colors line-clamp-2 group-hover:text-primary">
          {post.title}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{post.views.toLocaleString()} views</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span>
            {new Date(
              post.createdAt?.toDate?.() || post.createdAt
            ).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  ))}
</div>

      </div>
    </div>
  )
}
