import Link from "next/link"
import { Tag } from "lucide-react"

interface TagsSectionProps {
  tags: string[]
}

export function TagsSection({ tags }: TagsSectionProps) {
  if (tags.length === 0) return null

  return (
    <div className="mt-8">
      <div className="flex items-center mb-4 space-x-2">
        <Tag className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Tags</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="px-3 py-1 text-sm transition-colors rounded-full bg-muted hover:bg-accent"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}
