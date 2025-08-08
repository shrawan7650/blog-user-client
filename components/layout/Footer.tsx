'use client'
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

import { useSelector,useDispatch } from "react-redux";


export function Footer() {

  const { items: categories, loading } = useSelector((state: any) => state.categories);





  return (
    <footer className="text-white bg-gray-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="text-xl font-bold">TechBlog</span>
            </div>
            <p className="leading-relaxed text-gray-400">
              Your go-to source for the latest technology trends, tutorials, and insights. Stay ahead in the digital
              world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 transition-colors hover:text-blue-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-blue-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-blue-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-blue-400">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
     {/* Categories */}
<div>
  <h3 className="mb-4 text-lg font-semibold">Categories</h3>
  <ul className="space-y-2">
    {categories.slice(0, 6).map((category) => (
      <li key={category.id}>
        <Link
          href={`/category/${category.slug}`}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {category.name}
        </Link>
      </li>
    ))}
  </ul>

  {/* View All Link */}
  {/* {categories.length > 6 && (
    <div className="mt-3">
      <Link
        href="/categories"
        className="text-sm text-blue-400 hover:underline"
      >
        View All Categories →
      </Link>
    </div>
  )} */}
</div>


          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">hellotech.dev.blog@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">+9905737772</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">Dhanbad,Jharkhand </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-800">
          <p>&copy; 2024 TechBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
