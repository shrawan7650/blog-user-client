"use client"

import { useState, useEffect } from "react"
import { Share2, Twitter, Linkedin, MessageCircle, Copy, Check, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/types/blog"

interface ShareButtonsProps {
  post: BlogPost
}

export function ShareButtons({ post }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Ensure URL is set on client only
    setUrl(window.location.href)
    setIsMobile(window.innerWidth <= 768)

    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const title = post.title

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    instagram: `https://www.instagram.com/create/story/?url=${encodeURIComponent(url)}`, // Instagram doesn't support direct sharing like others
  }

  const copyToClipboard = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy URL:", error)
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        })
      } catch (err) {
        logErr("Native share cancelled or failed", err)
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="flex items-center mt-2 mb-2 space-x-2">
      <Share2 className="w-4 h-4 text-muted-foreground" />
      <span className="mr-2 text-sm text-muted-foreground">Share:</span>

      {isMobile ? (
        <Button variant="outline" size="sm" onClick={shareNative}>
          <Share2 className="w-4 h-4" />
        </Button>
      ) : (
        <>
          <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.twitter, "_blank")}>
            <Twitter className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.linkedin, "_blank")}>
            <Linkedin className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.whatsapp, "_blank")}>
            <MessageCircle className="w-4 h-4" />
          </Button>
          {/* instagram */}
          <Button variant="outline" size="sm" onClick={() => window.open(shareUrls.instagram, "_blank")}>
            <Instagram className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </>
      )}
    </div>
  )
}
