import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { BlogHeader } from "@/components/blog/BlogHeader"
import { BlogContent } from "@/components/blog/BlogContent"
import { BlogSidebar } from "@/components/blog/BlogSidebar"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { RelatedPosts } from "@/components/blog/RelatedPosts"
import { NavigationButtons } from "@/components/blog/NavigationButtons"
import { TagsSection } from "@/components/blog/TagsSection"
import { LikeButton } from "@/components/blog/LikeButton"
import { postsService } from "@/services/postsService"
import type { BlogPostWithAuthor } from "@/types/blog"
interface BlogPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const post = await postsService.getPostBySlug(params.slug)

    if (!post) {
      return {
        title: "Post Not Found",
      }
    }

    return {
      title: post.title,
      description: post.summary,
      keywords: post.tags.join(", "),
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.summary,
        type: "article",
        publishedTime: post.createdAt,
        authors: [post.author.name],
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.summary,
        images: [post.featuredImage],
      },
    }
  } catch (error) {
    return {
      title: "Post Not Found",
    }
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  let post: BlogPostWithAuthor | null = null

  try {
    post = await postsService.getPostBySlug(params.slug)
   
  } catch (error) {
    console.error("Error fetching post:", error)
  }

  if (!post) {
    notFound()
  }

  // Increment view count
  postsService.incrementViews(post.slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    image: post.featuredImage,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.socialLinks.website,
    },
    publisher: {
      "@type": "Organization",
      name: "TechBlog",
    },
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://techblog.com/blog/${post.slug}`,
    },
  }
  // console.log("post",post)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="min-h-screen">
        <div className="container px-4 py-8 mx-auto">
        {/* <pre>{JSON.stringify(post, null, 2)}</pre> */}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <BlogHeader post={post} />
     {/* {console.log("post.category",post.category)} */}
             <div className="flex items-center justify-between my-6">
                <ShareButtons post={post} />
                <LikeButton postSlug={post.slug} initialLikes={post.likes} />
              </div> 

              <BlogContent blocks={post.content} />

              <TagsSection tags={post.tags} /> 

              <NavigationButtons currentSlug={post.slug} category={post.category} />

             <RelatedPosts category={post.category} currentSlug={post.slug} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
