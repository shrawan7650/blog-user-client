import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  increment,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { usersService } from "./usersService"
import type { BlogPost ,BlogPostWithAuthor} from "@/types/blog"
import { serializeData } from "@/utils/serializeData"

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const LONG_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>()

// Cache utilities
const getCacheKey = (key: string, params?: any) => {
  return params ? `${key}_${JSON.stringify(params)}` : key
}

const setCache = (key: string, data: any, ttl: number = CACHE_TTL) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  })
}

const getCache = (key: string) => {
  const cached = cache.get(key)
  if (!cached) return null

  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }

  return cached.data
}

const clearCacheByPattern = (pattern: string) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// Request deduplication utility\
const deduplicate = async (key: string, fn: () => Promise<any>): Promise<any> => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<any>
  }

  const promise = fn().finally(() => {
    pendingRequests.delete(key)
  })

  pendingRequests.set(key, promise)
  return promise
}
// Helper function to attach author data to posts
const attachAuthorsToPosts = async (posts: BlogPost[]): Promise<BlogPostWithAuthor[]> => {
  const uniqueAuthorIds = [...new Set(posts.map((post) => post.createdBy))]
  const authors = await usersService.getUsersByIds(uniqueAuthorIds)

  return posts.map((post) => ({
    ...post,
    author: authors.get(post.createdBy) || {
      uid: post.createdBy,
      name: "Unknown Author",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "",
      socialLinks: {},
      totalPosts: 0,
    },
  }))
}

export const postsService = {
  async getPosts(page = 1, pageSize = 10, categoryId?: string) {
    const cacheKey = getCacheKey("posts", { page, pageSize, categoryId })

    // Check cache first
    const cached = getCache(cacheKey)
    if (cached) {
      return cached
    }

    // Deduplicate requests
    return deduplicate(cacheKey, async () => {
      try {
        let q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(pageSize))

        if (categoryId) {
          q = query(
            collection(db, "posts"),
            where("category", "==", categoryId),
            orderBy("createdAt", "desc"),
            limit(pageSize),
          )
        }

        if (page > 1) {
          const previousQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            limit((page - 1) * pageSize),
          )
          const previousSnapshot = await getDocs(previousQuery)
          const lastDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1]
          q = query(q, startAfter(lastDoc))
        }

        const snapshot = await getDocs(q)
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          slug: doc.data().slug,
        })) as BlogPost[]

        const postsWithAuthors = await attachAuthorsToPosts(posts)

        // Get total count for pagination (cached separately)
        const totalCacheKey = getCacheKey("posts_total", { categoryId })
        let totalPages = getCache(totalCacheKey)

        if (!totalPages) {
          const totalQuery = categoryId
            ? query(collection(db, "posts"), where("category", "==", categoryId))
            : query(collection(db, "posts"))
          const totalSnapshot = await getDocs(totalQuery)
          totalPages = Math.ceil(totalSnapshot.size / pageSize)
          setCache(totalCacheKey, totalPages, LONG_CACHE_TTL)
        }

        const result = { posts:postsWithAuthors, totalPages }
        setCache(cacheKey, result)
        return result
      } catch (error) {
        console.error("Error fetching posts:", error)
        throw error
      }
    })
  },

  async getPostBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
    const cacheKey = getCacheKey("post", { slug })

    // Check cache first
    const cached = getCache(cacheKey)
    if (cached) {
      return cached
    }

    return deduplicate(cacheKey, async () => {
      try {
        const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          return null
        }

        const doc = snapshot.docs[0]
        const postData = doc.data() as BlogPost

        // Fetch author data
        const author = await usersService.getUserById(postData.createdBy)

        const post: BlogPostWithAuthor = {
          ...postData,
          author: author || {
            uid: postData.createdBy,
            name: "Unknown Author",
            avatar: "/placeholder.svg?height=40&width=40",
            bio: "",
            socialLinks: {},
            totalPosts: 0,
          },
        }
        const serializedPost = serializeData(post);
          setCache(cacheKey, serializedPost, LONG_CACHE_TTL) // Cache posts longer
          return post
      } catch (error) {
        console.error("Error fetching post:", error)
        throw error
      }
    })
  },
//done
  async getFeaturedPosts(): Promise<BlogPostWithAuthor[]> {
    const cacheKey = "featured_posts"

    const cached = getCache(cacheKey)
    if (cached) {
      return cached
    }

    return deduplicate(cacheKey, async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("isFeatured", "==", true),
          orderBy("createdAt", "desc"),
          limit(5),
        )

        const snapshot = await getDocs(q)
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          slug: doc.data().slug,
        })) as BlogPost[]

        const postsWithAuthors = await attachAuthorsToPosts(posts)

        setCache(cacheKey, postsWithAuthors, LONG_CACHE_TTL)
        return postsWithAuthors
      } catch (error) {
        console.error("Error fetching featured posts:", error)
        throw error
      }
    })
  },
//done
  async getTrendingPosts(page = 1, pageSize = 6) {
    const cacheKey = getCacheKey("trending_posts", { page, pageSize })

    const cached = getCache(cacheKey)
    if (cached) {
      return cached
    }

    return deduplicate(cacheKey, async () => {
      try {
        let q = query(collection(db, "posts"), orderBy("views", "desc"), limit(pageSize))

        if (page > 1) {
          const previousQuery = query(collection(db, "posts"), orderBy("views", "desc"), limit((page - 1) * pageSize))
          const previousSnapshot = await getDocs(previousQuery)
          const lastDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1]
          q = query(q, startAfter(lastDoc))
        }

        const snapshot = await getDocs(q)
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
           slug: doc.data().slug,
        })) as BlogPost[]

        const postsWithAuthors = await attachAuthorsToPosts(posts)

        const hasMore = snapshot.docs.length === pageSize
        const result = { posts: postsWithAuthors, hasMore }

        setCache(cacheKey, result)
        return result
      } catch (error) {
        console.error("Error fetching trending posts:", error)
        throw error
      }
    })
  },

  async getPopularPosts(limitCount = 5): Promise<BlogPostWithAuthor[]> {
    const cacheKey = getCacheKey("popular_posts", { limitCount })

    const cached = getCache(cacheKey)
    if (cached) {
      return cached
    }

    return deduplicate(cacheKey, async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("views", "desc"), limit(limitCount))

        const snapshot = await getDocs(q)
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
           slug: doc.data().slug,
        })) as BlogPost[]

        const postsWithAuthors = await attachAuthorsToPosts(posts)

        setCache(cacheKey, postsWithAuthors, LONG_CACHE_TTL)
        return postsWithAuthors
      } catch (error) {
        console.error("Error fetching popular posts:", error)
        throw error
      }
    })
  },
  


  async searchPosts(searchQuery: string): Promise<BlogPostWithAuthor[]> {
    const cacheKey = getCacheKey("search", { query: searchQuery.toLowerCase() })

    const cached = getCache(cacheKey)
    if (cached) {
      return cached
    }

    return deduplicate(cacheKey, async () => {
      try {
        // Note: This is a simple search. For production, consider using Algolia or similar
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50))

        const snapshot = await getDocs(q)
        const allPosts = snapshot.docs.map((doc) => ({
          ...doc.data(),
           slug: doc.data().slug,
        })) as BlogPost[]

        // Client-side filtering (for demo purposes)
        const filteredPosts = allPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )

        const postsWithAuthors = await attachAuthorsToPosts(filteredPosts.slice(0, 10))
        setCache(cacheKey, postsWithAuthors, 2 * 60 * 1000) // Cache searches for 2 minutes
        return postsWithAuthors
      } catch (error) {
        console.error("Error searching posts:", error)
        throw error
      }
    })
  },
  async getPostsByAuthor(authorId: string, page = 1, pageSize = 10) {
    const cacheKey = getCacheKey("posts_by_author", { authorId, page, pageSize })

    const cached = getCache(cacheKey)
    if (cached) {
      return cached
    }

    return deduplicate(cacheKey, async () => {
      try {
        let q = query(
          collection(db, "posts"),
          where("createdBy", "==", authorId),
          orderBy("createdAt", "desc"),
          limit(pageSize),
        )

        if (page > 1) {
          const previousQuery = query(
            collection(db, "posts"),
            where("createdBy", "==", authorId),
            orderBy("createdAt", "desc"),
            limit((page - 1) * pageSize),
          )
          const previousSnapshot = await getDocs(previousQuery)
          const lastDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1]
          q = query(q, startAfter(lastDoc))
        }

        const snapshot = await getDocs(q)
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          slug: doc.data().slug,
        })) as BlogPost[]

        const postsWithAuthors = await attachAuthorsToPosts(posts)

        // Get total count
        const totalQuery = query(collection(db, "posts"), where("createdBy", "==", authorId))
        const totalSnapshot = await getDocs(totalQuery)
        const totalPages = Math.ceil(totalSnapshot.size / pageSize)

        const result = { posts: postsWithAuthors, totalPages }
        setCache(cacheKey, result)
        return result
      } catch (error) {
        console.error("Error fetching posts by author:", error)
        throw error
      }
    })
  },

  async incrementViews(slug: string) {
    // Throttle view increments to prevent spam
    const viewKey = `view_${slug}`
    const lastView = getCache(viewKey)

    if (lastView && Date.now() - lastView < 60000) {
      // 1 minute throttle
      return
    }

    try {
  // Find document by slug
  const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const docRef = doc(db, "posts", snapshot.docs[0].id)
      await updateDoc(docRef, {
        views: increment(1),
      })

      setCache(viewKey, Date.now(), 60000) // Cache for 1 minute

      // Clear related caches
      clearCacheByPattern("trending_posts")
      clearCacheByPattern("popular_posts")
    }
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  },

  async updateLikes(slug: string, incrementValue: number) {
    try {
      const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const docRef = doc(db, "posts", snapshot.docs[0].id)
      await updateDoc(docRef, {
        likes: increment(incrementValue),
      })

      // Clear post cache
      cache.delete(getCacheKey("post", { slug }))
    }
    } catch (error) {
      console.error("Error updating likes:", error)
      throw error
    }
  },

  // Real-time subscription with caching
  subscribeToPost(slug: string, callback: (post: BlogPostWithAuthor | null) => void) {
    // First get the document by slug
    const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1))

    return onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        const postData = doc.data() as BlogPost

        // Fetch author data
        const author = await usersService.getUserById(postData.createdBy)

        const post: BlogPostWithAuthor = {
          ...postData,
          author: author || {
            uid: postData.createdBy,
            name: "Unknown Author",
            avatar: "/placeholder.svg?height=40&width=40",
            bio: "",
            socialLinks: {},
            totalPosts: 0,
          },
        }

        // Update cache
        setCache(getCacheKey("post", { slug }), post, LONG_CACHE_TTL)
        callback(post)
      } else {
        callback(null)
      }
    })
  },

  // Cache management
  clearCache() {
    cache.clear()
    pendingRequests.clear()
  },

  getCacheStats() {
    return {
      cacheSize: cache.size,
      pendingRequests: pendingRequests.size,
    }
  },
}
