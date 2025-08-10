export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  featuredImage: string
  createdBy: string // User ID who created the post
  createdAt: string // Post creation date
  readingTime: string
  isFeatured: boolean
  views: number
  likes: number
  blocks: BlogContentBlock[]
}
export interface User {
  uid: string
  name: string
  avatar: string
  bio: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  totalPosts?: number // Will be calculated
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export interface BlogContentBlock {
  type:
    | "heading"
    | "paragraph"
    | "list"
    | "code"
    | "image"
    | "gallery"
    | "table"
    | "faq"
    | "product"
    | "callout"
    | "embed"
    | "divider"
  data: any
}

export interface Newsletter {
  email: string
  subscribedAt: string
}

export interface Contact {
  name: string
  email: string
  message: string
  submittedAt: string
}
export interface BlogPostWithAuthor extends BlogPost {
  author: User
}