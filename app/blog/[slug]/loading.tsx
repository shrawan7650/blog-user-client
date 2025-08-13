// app/blog/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content Skeleton */}
        <div className="space-y-4 lg:col-span-3">
          <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-4/6 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-4 lg:col-span-1">
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
