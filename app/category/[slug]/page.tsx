import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryHeader } from "@/components/category/CategoryHeader"
import { CategoryPosts } from "@/components/category/CategoryPosts"
import { categoriesService } from "@/services/categoriesService"
import type { Category } from "@/types/blog"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const category = await categoriesService.getCategoryBySlug(params.slug)

    if (!category) {
      return {
        title: "Category Not Found",
      }
    }

    return {
      title: `${category.name} - TechBlog`,
      description: `Browse all posts in ${category.name} category. Stay updated with the latest trends and insights.`,
      openGraph: {
        title: `${category.name} - TechBlog`,
        description: `Browse all posts in ${category.name} category. Stay updated with the latest trends and insights.`,
        type: "website",
      },
    }
  } catch (error) {
    return {
      title: "Category Not Found",
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let category: Category | null = null

  try {
    category = await categoriesService.getCategoryBySlug(params.slug)
  } catch (error) {
    // console.error("Error fetching category:", error)
  }

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        <CategoryHeader category={category} />
        <CategoryPosts categoryId={category.id} />
      </div>
    </div>
  )
}
