import type { Category } from "@/types/blog"

interface CategoryHeaderProps {
  category: Category
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="py-8 text-center sm:py-12">
      {/* Icon */}
      <div className="mb-3 text-4xl sm:text-6xl sm:mb-4">{category.icon}</div>

      {/* Title */}
      <h1 className="mb-3 text-2xl font-bold sm:text-4xl md:text-5xl sm:mb-4">
        {category.name}
      </h1>

      {/* Description */}
      <p className="max-w-xl px-4 mx-auto text-sm sm:text-lg text-muted-foreground sm:max-w-2xl">
        Explore our latest articles and insights in{" "}
        {category.name.toLowerCase()}.
      </p>
    </div>
  )
}
