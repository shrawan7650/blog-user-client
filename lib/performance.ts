// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTiming(label: string): () => void {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (!this.metrics.has(label)) {
        this.metrics.set(label, [])
      }

      this.metrics.get(label)!.push(duration)

      // Keep only last 100 measurements
      const measurements = this.metrics.get(label)!
      if (measurements.length > 100) {
        measurements.shift()
      }

      // Log slow operations in development
      // if (process.env.NODE_ENV === "development" && duration > 1000) {
      //   console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`)
      // }
    }
  }

  getMetrics(label: string) {
    const measurements = this.metrics.get(label) || []
    if (measurements.length === 0) return null

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)

    return { avg, min, max, count: measurements.length }
  }

  getAllMetrics() {
    const result: Record<string, any> = {}
    for (const [label, measurements] of this.metrics.entries()) {
      if (measurements.length > 0) {
        const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length
        result[label] = {
          avg: Math.round(avg * 100) / 100,
          min: Math.min(...measurements),
          max: Math.max(...measurements),
          count: measurements.length,
        }
      }
    }
    return result
  }

  clear() {
    this.metrics.clear()
  }
}

// Image lazy loading utility
export const createImageLoader = () => {
  const imageCache = new Set<string>()

  return {
    preloadImage: (src: string): Promise<void> => {
      if (imageCache.has(src)) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          imageCache.add(src)
          resolve()
        }
        img.onerror = reject
        img.src = src
      })
    },

    preloadImages: async (urls: string[]): Promise<void> => {
      const uncachedUrls = urls.filter((url) => !imageCache.has(url))
      if (uncachedUrls.length === 0) return

      const promises = uncachedUrls.map((url) => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            imageCache.add(url)
            resolve()
          }
          img.onerror = () => resolve() // Don't fail the batch for one image
          img.src = url
        })
      })

      await Promise.all(promises)
    },

    isImageCached: (src: string): boolean => imageCache.has(src),
    clearCache: () => imageCache.clear(),
    getCacheSize: () => imageCache.size,
  }
}

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== "development") return

  const scripts = Array.from(document.querySelectorAll("script[src]"))
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))


  // Estimate bundle size (rough approximation)
  let totalSize = 0
  scripts.forEach((script: any) => {
    if (script.src.includes("/_next/")) {
      // Rough estimation based on typical Next.js bundle sizes
      totalSize += 50 // KB
    }
  })


  // console.groupEnd()
}

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === "undefined" || !("memory" in performance)) return

  const memory = (performance as any).memory

  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  }
}
