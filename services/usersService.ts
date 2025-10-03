import { collection, doc, getDoc, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/types/blog"

// In-memory cache for users
const userCache = new Map<string, { data: User; timestamp: number }>()
const USER_CACHE_TTL = 10 * 60 * 1000 // 10 minutes

const setUserCache = (uid: string, user: User) => {
  userCache.set(uid, {
    data: user,
    timestamp: Date.now(),
  })
}

const getUserCache = (uid: string): User | null => {
  const cached = userCache.get(uid)
  if (!cached) return null

  if (Date.now() - cached.timestamp > USER_CACHE_TTL) {
    userCache.delete(uid)
    return null
  }

  return cached.data
}

export const usersService = {
  async getUserById(uid: string): Promise<User | null> {
    // Check cache first
    const cached = getUserCache(uid)
    if (cached) {
      return cached
    }

    try {
      const userDoc = await getDoc(doc(db, "users", uid))

      if (!userDoc.exists()) {
        return null
      }

      const userData = userDoc.data()

      // Count total posts by this user
      const postsQuery = query(collection(db, "posts"), where("createdBy", "==", uid))
      const postsSnapshot = await getDocs(postsQuery)
      const totalPosts = postsSnapshot.size

      const user: User = {
        uid: userDoc.id,
        name: userData.name || "Unknown Author",
        avatar: userData.avatar || "/placeholder.svg?height=40&width=40",
        bio: userData.bio || "",
        socialLinks: userData.socialLinks || {},
        totalPosts,
      }

      // Cache the user data
      setUserCache(uid, user)

      return user
    } catch (error) {
      // console.error("Error fetching user:", error)
      return null
    }
  },

  async getUsersByIds(uids: string[]): Promise<Map<string, User>> {
    const users = new Map<string, User>()
    const uncachedUids: string[] = []

    // Check cache for each user
    for (const uid of uids) {
      const cached = getUserCache(uid)
      if (cached) {
        users.set(uid, cached)
      } else {
        uncachedUids.push(uid)
      }
    }

    // Fetch uncached users
    if (uncachedUids.length > 0) {
      try {
        const fetchPromises = uncachedUids.map(async (uid) => {
          const user = await this.getUserById(uid)
          if (user) {
            users.set(uid, user)
          }
          return user
        })

        await Promise.all(fetchPromises)
      } catch (error) {
        // console.error("Error fetching multiple users:", error)
      }
    }

    return users
  },

  async getTopAuthors(limit = 10): Promise<User[]> {
    try {
      // Get all posts to count by author
      const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"))
      const postsSnapshot = await getDocs(postsQuery)

      // Count posts per author
      const authorPostCounts = new Map<string, number>()
      postsSnapshot.docs.forEach((doc) => {
        const createdBy = doc.data().createdBy
        if (createdBy) {
          authorPostCounts.set(createdBy, (authorPostCounts.get(createdBy) || 0) + 1)
        }
      })

      // Sort authors by post count
      const sortedAuthors = Array.from(authorPostCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)

      // Fetch user details for top authors
      const topAuthors: User[] = []
      for (const [uid, postCount] of sortedAuthors) {
        const user = await this.getUserById(uid)
        if (user) {
          user.totalPosts = postCount
          topAuthors.push(user)
        }
      }

      return topAuthors
    } catch (error) {
      // console.error("Error fetching top authors:", error)
      return []
    }
  },

  // Clear user cache
  clearCache() {
    userCache.clear()
  },

  // Get cache statistics
  getCacheStats() {
    return {
      userCacheSize: userCache.size,
    }
  },
}
