import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Author Header Skeleton */}
          <div className="p-8 mb-8 rounded-lg shadow-sm bg-card">
            <div className="flex flex-col items-start space-y-6 md:flex-row md:space-y-0 md:space-x-8">
              <Skeleton className="flex-shrink-0 w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="w-64 h-8" />
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-full h-20" />
                <div className="flex space-x-2">
                  <Skeleton className="w-24 h-8" />
                  <Skeleton className="w-24 h-8" />
                  <Skeleton className="w-24 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-64 h-8" />
              <Skeleton className="w-20 h-4" />
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="overflow-hidden rounded-lg shadow-sm bg-card">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="w-full h-6" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-center mt-8 space-x-2">
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-20 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}