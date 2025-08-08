"use client"

import { useEffect, useState } from "react"
import { PerformanceMonitor, monitorMemoryUsage } from "@/lib/performance"

export function PerformanceDebugger() {
  const [metrics, setMetrics] = useState<any>({})
  const [memoryUsage, setMemoryUsage] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    const interval = setInterval(() => {
      const performanceMonitor = PerformanceMonitor.getInstance()
      setMetrics(performanceMonitor.getAllMetrics())
      setMemoryUsage(monitorMemoryUsage())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== "development") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-mono"
      >
        PERF
      </button>

      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white p-4 rounded-lg shadow-lg max-w-sm text-xs font-mono max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Performance Metrics</h3>

          {memoryUsage && (
            <div className="mb-4">
              <h4 className="font-semibold text-blue-300">Memory Usage</h4>
              <div>Used: {memoryUsage.used}MB</div>
              <div>Total: {memoryUsage.total}MB</div>
              <div>Limit: {memoryUsage.limit}MB</div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-green-300">API Calls</h4>
            {Object.entries(metrics).map(([key, value]: [string, any]) => (
              <div key={key} className="mb-1">
                <div className="text-yellow-300">{key}</div>
                <div>Avg: {value.avg}ms</div>
                <div>Count: {value.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
