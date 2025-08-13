// app/about/loading.tsx
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-4xl space-y-6">
        {/* Hero Section Skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="w-1/3 h-10 rounded-md bg-muted" />
          <div className="w-1/2 h-6 rounded-md bg-muted" />
          <div className="h-48 rounded-lg bg-muted" />
        </div>

        {/* Mission Section Skeleton */}
        <div className="space-y-3 animate-pulse">
          <div className="w-1/4 h-8 rounded-md bg-muted" />
          <div className="w-full h-4 rounded-md bg-muted" />
          <div className="w-5/6 h-4 rounded-md bg-muted" />
          <div className="h-32 rounded-lg bg-muted" />
        </div>

        {/* Team Section Skeleton */}
        <div className="grid grid-cols-1 gap-6 animate-pulse sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-muted" />
              <div className="w-1/2 h-4 rounded-md bg-muted" />
              <div className="w-2/3 h-3 rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
