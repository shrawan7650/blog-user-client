"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Eye, Github, Linkedin, Twitter, Globe, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPostWithAuthor } from "@/types/blog"
import { formatDate } from "@/utils/form-date"

interface BlogHeaderProps {
  post: BlogPostWithAuthor
}

export function BlogHeader({ post }: BlogHeaderProps) {
  const { author } = post
  const router = useRouter()
  console.log("post", post)

  return (
    <header className="space-y-6">
      {/* Back Button */}
      {/* <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button> */}

      {/* Feature Image */}
      <div className="relative h-[400px] overflow-hidden rounded-lg">
        <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
      </div>

      {/* Title and Meta */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>

        <p className="text-xl leading-relaxed text-muted-foreground">{post.summary}</p>

        {/* Author Info */}
        <Link
          href={`/author/${author.uid}`}
          className="flex items-start p-4 space-x-4 transition rounded-lg bg-muted/30 hover:bg-muted/50"
        >
          <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-full">
            <Image
              src={author.avatar || "/placeholder.svg?height=64&width=64&query=user"}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1 space-x-2">
              <h3 className="text-lg font-semibold">{author.name}</h3>
              <span className="text-sm text-muted-foreground">
                {author.totalPosts} {author.totalPosts === 1 ? "post" : "posts"}
              </span>
            </div>

            {author.bio && <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{author.bio}</p>}

            {/* Social Links */}
            {Object.keys(author.socialLinks).length > 0 && (
              <div className="flex items-center space-x-2">
                {author.socialLinks.github && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={author.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {author.socialLinks.linkedin && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {author.socialLinks.twitter && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {author.socialLinks.website && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{post.views.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </header>
  )
}
