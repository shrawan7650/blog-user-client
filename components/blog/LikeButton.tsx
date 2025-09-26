"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { postsService } from "@/services/postsService"
import { ThumbsUp } from "lucide-react"

interface LikeButtonProps {
  postSlug: string
  initialLikes: number
}

export function LikeButton({ postSlug, initialLikes }: LikeButtonProps) {
  console.log("Rendering LikeButton with initialLikes:", initialLikes)
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setLikes(initialLikes)
  }, [initialLikes])

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const increment = isLiked ? -1 : 1

      // Optimistic UI update
      setLikes((prev) => prev + increment)
      setIsLiked((prev) => !prev)

      // Update Firestore
      await postsService.updateLikes(postSlug, increment)
    } catch (error) {
      // Revert if error
      setLikes((prev) => prev + (isLiked ? 1 : -1))
      setIsLiked((prev) => !prev)
      console.error("Error updating likes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className="flex items-center mt-2 mb-2 space-x-2"
    >
      <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{likes}</span>
    </Button>
  )
}
