"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { toggleLike, setLikes } from "@/store/slices/blogSlice"
import { postsService } from "@/services/postsService"
import { ThumbsUp } from "lucide-react"
// import { Thumb } from "@radix-ui/react-scroll-area"

interface LikeButtonProps {
  postSlug: string
  initialLikes: number
}

export function LikeButton({ postSlug, initialLikes }: LikeButtonProps) {
  const dispatch = useAppDispatch()
  const { likes, userLikes } = useAppSelector((state) => state.blog)
  const [isLoading, setIsLoading] = useState(false)

  const currentLikes = likes[postSlug] ?? initialLikes
  const isLiked = userLikes[postSlug] ?? false

  useEffect(() => {
    dispatch(setLikes({ slug: postSlug, count: initialLikes }))
  }, [dispatch, postSlug, initialLikes])

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      dispatch(toggleLike(postSlug))

      // Update in Firestore
      const increment = isLiked ? -1 : 1
      await postsService.updateLikes(postSlug, increment)
    } catch (error) {
      // Revert on error
      dispatch(toggleLike(postSlug))
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
      <span>{currentLikes}</span>
    </Button>
  )
}
