import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Category } from "@/types/blog"

// Simple cache for categories (they don't change often)
let categoriesCache: { data: Category[]; timestamp: number } | null = null
const CATEGORIES_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    // Check cache first
    if (categoriesCache && Date.now() - categoriesCache.timestamp < CATEGORIES_CACHE_TTL) {
      return categoriesCache.data
    }

    try {
      const q = query(collection(db, "categories"), orderBy("name"))
      const snapshot = await getDocs(q)
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[]

      // Update cache
      categoriesCache = {
        data: categories,
        timestamp: Date.now(),
      }

      return categories
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    // Get all categories from cache first
    const categories = await this.getCategories()
    return categories.find((category) => category.slug === slug) || null
  },

  // Clear cache when categories are updated
  clearCache() {
    categoriesCache = null
  },
}
