"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp, ArrowLeft } from "lucide-react"
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
      // Prevent body scroll on mobile when modal is open
      document.body.style.overflow = 'hidden'
      inputRef.current?.focus()
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to ensure scroll is re-enabled
    return () => {
      document.body.style.overflow = 'unset'
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

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isSearchModalOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:bg-black/40"
      onClick={handleBackdropClick}
    >
      {/* Mobile: Full screen modal */}
      <div className="h-full md:hidden bg-background">
        {/* Mobile Header */}
        <div className="flex items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button variant="ghost" size="sm" onClick={handleClose} className="p-2 mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center flex-1">
            <Search className="flex-shrink-0 w-5 h-5 mr-3 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search posts..."
              className="text-base bg-transparent border-0 focus-visible:ring-0"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto overscroll-behavior-contain">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex space-x-3 animate-pulse">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted"></div>
                  <div className="flex-1 py-1 space-y-3">
                    <div className="w-full h-4 rounded bg-muted"></div>
                    <div className="w-3/4 h-3 rounded bg-muted"></div>
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
                  className="flex items-start p-4 space-x-4 transition-colors rounded-xl hover:bg-accent active:bg-accent/80"
                >
                  <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                    <Image
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold leading-tight line-clamp-2 text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query && !loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="mb-2 text-lg font-medium">No results found</p>
              <p className="text-sm">Try different keywords for "{query}"</p>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center px-2 mb-3 space-x-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-base font-semibold">Recent</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="flex items-center w-full px-4 py-3 text-left transition-colors rounded-xl hover:bg-accent active:bg-accent/80"
                      >
                        <Search className="flex-shrink-0 w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="text-base">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center px-2 mb-3 space-x-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <span className="text-base font-semibold">Popular</span>
                </div>
                <div className="space-y-1">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="flex items-center w-full px-4 py-3 text-left transition-colors rounded-xl hover:bg-accent active:bg-accent/80"
                    >
                      <TrendingUp className="flex-shrink-0 w-4 h-4 mr-3 text-muted-foreground" />
                      <span className="text-base">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Centered modal */}
      <div className="hidden md:flex items-start justify-center pt-[10vh] px-4 min-h-full">
        <div className="w-full max-w-3xl border shadow-2xl rounded-2xl bg-background">
          {/* Desktop Search Input */}
          <div className="flex items-center p-6 border-b">
            <Search className="flex-shrink-0 w-6 h-6 mr-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search posts..."
              className="text-lg bg-transparent border-0 focus-visible:ring-0"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <Button variant="ghost" size="sm" className="p-2 ml-4" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Desktop Search Results */}
          <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex space-x-4 animate-pulse">
                    <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-muted"></div>
                    <div className="flex-1 py-2 space-y-3">
                      <div className="w-4/5 h-5 rounded bg-muted"></div>
                      <div className="w-3/5 h-4 rounded bg-muted"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query && results.length > 0 ? (
              <div className="p-3">
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={handleClose}
                    className="flex items-start p-4 space-x-4 transition-all duration-200 rounded-xl hover:bg-accent hover:scale-[1.02] hover:shadow-md"
                  >
                    <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-xl">
                      <Image
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform hover:scale-110"
                        loading="lazy"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-foreground">
                        {post.title}
                      </h3>
                      <p className="leading-relaxed text-muted-foreground line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="p-12 text-center text-muted-foreground">
                <Search className="w-20 h-20 mx-auto mb-6 opacity-30" />
                <p className="mb-3 text-xl font-medium">No results found</p>
                <p className="text-base">Try different keywords for "{query}"</p>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center px-2 mb-4 space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span className="text-lg font-semibold">Recent</span>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl hover:bg-accent hover:scale-[1.02]"
                        >
                          <Search className="flex-shrink-0 w-4 h-4 mr-3 text-muted-foreground" />
                          <span className="text-base">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="flex items-center px-2 mb-4 space-x-3">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg font-semibold">Popular</span>
                  </div>
                  <div className="space-y-2">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl hover:bg-accent hover:scale-[1.02]"
                      >
                        <TrendingUp className="flex-shrink-0 w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="text-base">{search}</span>
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