"use client"

import { useState } from "react"
import Image from "next/image"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { createImageLoader } from "@/lib/performance"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

const imageLoader = createImageLoader()

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "/placeholder.svg",
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(priority)

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Load image when it comes into view (unless priority)
  if (isIntersecting && !shouldLoad) {
    setShouldLoad(true)
  }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  return (
    <div ref={targetRef} className={`relative overflow-hidden ${className}`}>
      {shouldLoad && !hasError ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          fill={!width && !height}
        />
      ) : (
        <Image
          src={placeholder || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="opacity-50"
          fill={!width && !height}
        />
      )}

      {/* Loading skeleton */}
      {shouldLoad && !isLoaded && !hasError && <div className="absolute inset-0 bg-muted animate-pulse" />}
    </div>
  )
}
