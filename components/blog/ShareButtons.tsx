"use client"

import { useState } from "react"
import { Share2, Twitter, Linkedin, MessageCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/types/blog"

interface ShareButtonsProps {
  post: BlogPost
}

export function ShareButtons({ post }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== "undefined" ? window.location.href : ""
  const title = post.title

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy URL:", error)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Share2 className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground mr-2">Share:</span>

      <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.twitter, "_blank")}>
        <Twitter className="w-4 h-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.linkedin, "_blank")}>
        <Linkedin className="w-4 h-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.whatsapp, "_blank")}>
        <MessageCircle className="w-4 h-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  )
}
