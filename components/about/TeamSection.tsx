"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from "embla-carousel-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/types/blog"

export function TeamSection() {
  const [team, setTeam] = useState<User[]>([])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" })
  const [isLoading, setIsLoading] = useState(true)
  // Fetch all users from Firestore
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const snapshot = await getDocs(collection(db, "users"))
      const usersData: User[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          uid: doc.id,
          name: data.name || "Unknown Author",
          role: data.role || "",
          bio: data.bio || "",
          avatar: data.avatar || "/placeholder.svg?height=300&width=300",
          socialLinks: data.socialLinks || {},
          totalPosts: data.totalPosts || 0,
        }
      })
      setTeam(usersData)
    } catch (err) {
      console.error("Error fetching users:", err)
    }
    finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-64 h-8 mx-auto mb-4 bg-gray-300 rounded"></div>
              <div className="h-4 mx-auto mb-12 bg-gray-300 rounded w-96"></div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full"></div>
                    <div className="w-3/4 h-4 mx-auto mb-2 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-3 mx-auto mb-4 bg-gray-300 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="w-5/6 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Meet Our Team</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            The passionate individuals behind TechBlog, dedicated to bringing you the best content.
          </p>
        </div>

        {/* Slider container */}
        {team.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {team.map((member) => (
                  <div
                    key={member.uid}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_20%] px-4"
                  >
                    <div className="p-6 text-center rounded-lg shadow-sm bg-card">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">{member.name}</h3>
                      <p className="mb-6 leading-relaxed text-muted-foreground line-clamp-3">
                        {member.bio}
                      </p>
                      <div className="flex justify-center space-x-2">
                        {member.socialLinks?.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {member.socialLinks?.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {member.socialLinks?.github && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            {team.length > 3 && (
              <div className="flex justify-center mt-6 space-x-4">
                <Button
                  variant="outline"
                  onClick={() => emblaApi && emblaApi.scrollPrev()}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  onClick={() => emblaApi && emblaApi.scrollNext()}
                >
                  →
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Loading team...</p>
        )}
      </div>
    </section>
  )
}
