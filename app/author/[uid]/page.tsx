import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Github, Linkedin, Twitter, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usersService } from "@/services/usersService"
import { postsService } from "@/services/postsService"
import type { User, BlogPostWithAuthor } from "@/types/blog"

interface AuthorPageProps {
  params: {
    uid: string
  }
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  try {
    const author = await usersService.getUserById(params.uid)

    if (!author) {
      return {
        title: "Author Not Found",
      }
    }

    return {
      title: `${author.name} - TechBlog Author`,
      description: author.bio || `Read articles by ${author.name} on TechBlog`,
      openGraph: {
        title: `${author.name} - TechBlog Author`,
        description: author.bio || `Read articles by ${author.name} on TechBlog`,
        type: "profile",
        images: [
          {
            url: author.avatar,
            width: 400,
            height: 400,
            alt: author.name,
          },
        ],
      },
    }
  } catch (error) {
    return {
      title: "Author Not Found",
    }
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  let author: User | null = null
  let posts: BlogPostWithAuthor[] = []

  try {
    author = await usersService.getUserById(params.uid)
    console.log("author",author)
    if (author) {
      console.log("post.........")
      const { posts: authorPosts } = await postsService.getPostsByAuthor(params.uid, 1, 10)
      
      posts = authorPosts
    }
  } catch (error) {
    console.error("Error fetching author data:", error)
  }
  console.log("posts",posts)

  if (!author) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        {/* Author Header */}
        <div className="max-w-4xl mx-auto">
          <div className="p-8 mb-8 rounded-lg shadow-sm bg-card">
            <div className="flex flex-col items-start space-y-6 md:flex-row md:space-y-0 md:space-x-8">
              <div className="relative flex-shrink-0 w-32 h-32 overflow-hidden rounded-full">
                <Image
                  src={author.avatar || "/placeholder.svg?height=128&width=128&query=user"}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold">{author.name}</h1>

                <div className="flex items-center mb-4 space-x-4 text-muted-foreground">
                  <span>
                    {author.totalPosts} {author.totalPosts === 1 ? "post" : "posts"}
                  </span>
                </div>

                {author.bio && <p className="mb-6 leading-relaxed text-muted-foreground">{author.bio}</p>}

                {/* Social Links */}
                {Object.keys(author.socialLinks).length > 0 && (
                  <div className="flex items-center space-x-3">
                    {author.socialLinks.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={author.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {author.socialLinks.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {author.socialLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {author.socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Author's Posts */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Latest Posts by {author.name}</h2>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="overflow-hidden transition-all duration-200 rounded-lg shadow-sm group bg-card hover:shadow-md"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="mb-3 text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                        {post.title}
                      </h3>

                      <p className="mb-4 text-muted-foreground line-clamp-3">{post.summary}</p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">No posts found by this author yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
