import type { Category } from "@/types/blog"

interface CategoryHeaderProps {
  category: Category
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{category.icon}</div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Explore our latest articles and insights in {category.name.toLowerCase()}.
      </p>
    </div>
  )
}
