"use client"

import { useEffect, useRef } from "react"

interface AdSlotProps {
  slot: string
  format?: "horizontal" | "vertical" | "square"
  className?: string
}

export function AdSlot({ slot, format = "horizontal", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && adRef.current) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error("AdSense error:", error)
      }
    }
  }, [])

  const getAdDimensions = () => {
    switch (format) {
      case "horizontal":
        return { width: "100%", height: "90px" }
      case "vertical":
        return { width: "300px", height: "600px" }
      case "square":
        return { width: "300px", height: "250px" }
      default:
        return { width: "100%", height: "90px" }
    }
  }

  const dimensions = getAdDimensions()

  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        className={`bg-muted border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground text-sm ${className}`}
        style={dimensions}
      >
        Ad Placeholder ({format})
      </div>
    )
  }

  return (
    <div ref={adRef} className={className} style={dimensions}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...dimensions }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
