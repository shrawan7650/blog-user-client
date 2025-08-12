"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { closeSearchModal } from "@/store/slices/uiSlice"
import { postsService } from "@/services/postsService"
import { useDebounce } from "@/hooks/useDebounce"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { BlogPost } from "@/types/blog"
import Link from "next/link"
import Image from "next/image"

export function SearchModal() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>("recent-searches", [])
  const [popularSearches] = useState(["React", "Next.js", "TypeScript", "AI", "Web Development"])

  const debouncedQuery = useDebounce(query, 300) // Debounce search queries
  const { isSearchModalOpen } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchModalOpen) {
      inputRef.current?.focus()
    }
  }, [isSearchModalOpen])

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchPosts(debouncedQuery)
    } else {
      setResults([])
      setLoading(false)
    }
  }, [debouncedQuery])

  const searchPosts = async (searchQuery: string) => {
    setLoading(true)
    try {
      const posts = await postsService.searchPosts(searchQuery)
      setResults(posts)
    } catch (error) {
      console.error("Error searching posts:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    dispatch(closeSearchModal())
    setQuery("")
    setResults([])
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter((s: string) => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose()
    }
  }

  if (!isSearchModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container px-4 pt-20 mx-auto">
        <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-background">
          {/* Search Input */}
          <div className="flex items-center p-4 border-b">
            <Search className="w-5 h-5 mr-3 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search posts..."
              className="text-lg border-0 focus-visible:ring-0"
            />
            <Button variant="ghost" size="sm" className="ml-5" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Results */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex space-x-3 animate-pulse">
                    <div className="w-12 h-12 rounded bg-muted"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-4 rounded bg-muted"></div>
                      <div className="w-1/2 h-3 rounded bg-muted"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query && results.length > 0 ? (
              <div className="p-2">
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={handleClose}
                    className="flex items-center p-3 space-x-3 transition-colors rounded-lg hover:bg-accent"
                  >
                    <div className="relative w-12 h-12 overflow-hidden rounded">
                      <Image
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{post.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2 space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recent</span>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="block w-full px-3 py-2 text-left transition-colors rounded-lg hover:bg-accent"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="flex items-center mb-2 space-x-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Popular</span>
                  </div>
                  <div className="space-y-1">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="block w-full px-3 py-2 text-left transition-colors rounded-lg hover:bg-accent"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
