'use client'
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useSelector } from "react-redux"

// Constant data arrays
const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com/techblog",
    icon: Facebook,
    color: "hover:text-blue-500"
  },
  {
    name: "Twitter",
    href: "https://twitter.com/techblog",
    icon: Twitter,
    color: "hover:text-sky-400"
  },
  {
    name: "Instagram",
    href: "https://instagram.com/techblog",
    icon: Instagram,
    color: "hover:text-pink-500"
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/techblog",
    icon: Linkedin,
    color: "hover:text-blue-600"
  }
]

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  // { name: "FAQ", href: "/faq" } 
]

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hellotech.dev.blog@gmail.com",
    href: "mailto:hellotech.dev.blog@gmail.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 99057 37772",
    href: "tel:+919905737772"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhanbad, Jharkhand, India",
    href: "https://maps.google.com/?q=Dhanbad,Jharkhand,India"
  }
]

const COMPANY_INFO = {
  name: "TechBlog",
  description: "Your go-to source for the latest technology trends, tutorials, and insights. Stay ahead in the digital world with expert-driven content.",
  logo: "T",
  year: 2025
}

export function Footer() {
  const { items: categories = [], loading } = useSelector((state: any) => state.categories)

  return (
    <footer className="text-white bg-gray-900">
      <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Section */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 transition-transform bg-blue-600 rounded-lg hover:scale-105">
                <span className="text-xl font-bold text-white">
                  {COMPANY_INFO.logo}
                </span>
              </div>
              <span className="text-2xl font-bold sm:text-xl">
                {COMPANY_INFO.name}
              </span>
            </div>

            {/* Description */}
            <p className="max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">
              {COMPANY_INFO.description}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-all duration-200 ${social.color} hover:scale-110 p-2 rounded-full hover:bg-gray-800`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="pb-2 text-lg font-semibold text-white border-b border-gray-700">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-gray-400 transition-colors duration-200 transform hover:text-white hover:translate-x-1 sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="pb-2 text-lg font-semibold text-white border-b border-gray-700">
              Categories
            </h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-5 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/category/${category.slug}`}
                      className="inline-block text-sm text-gray-400 transition-colors duration-200 transform hover:text-white hover:translate-x-1 sm:text-base"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                
                {/* View All Link - only show if more than 6 categories */}
                {/* {categories.length > 6 && (
                  <li className="pt-2">
                    <Link
                      href="/categories"
                      className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline group"
                    >
                      View All Categories
                      <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                )} */}
              </ul>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="pb-2 text-lg font-semibold text-white border-b border-gray-700">
              Contact Info
            </h3>
            <div className="space-y-3">
              {CONTACT_INFO.map((contact) => {
                const IconComponent = contact.icon
                return (
                  <div key={contact.label} className="group">
                    {contact.href ? (
                      <a
                        href={contact.href}
                        target={contact.label === 'Location' ? '_blank' : undefined}
                        rel={contact.label === 'Location' ? 'noopener noreferrer' : undefined}
                        className="flex items-start space-x-3 text-gray-400 transition-colors duration-200 hover:text-white"
                      >
                        <IconComponent className="w-5 h-5 mt-0.5 text-blue-400 shrink-0" />
                        <span className="text-sm leading-relaxed break-all sm:text-base sm:break-normal">
                          {contact.value}
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-start space-x-3 text-gray-400">
                        <IconComponent className="w-5 h-5 mt-0.5 text-blue-400 shrink-0" />
                        <span className="text-sm leading-relaxed break-all sm:text-base sm:break-normal">
                          {contact.value}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Business Hours - Additional Info */}
            <div className="pt-4 mt-4 border-t border-gray-800">
              <h4 className="mb-2 text-sm font-medium text-gray-300">Business Hours</h4>
              <p className="text-xs text-gray-400">
                Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                Weekend: Support via Email 
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Section - Mobile Friendly */}
        {/* <div className="pt-8 mt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center lg:max-w-2xl">
            <h3 className="mb-2 text-lg font-semibold">Stay Updated</h3>
            <p className="mb-4 text-sm text-gray-400">
              Get the latest tech insights delivered to your inbox
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Footer */}
        {/* <div className="pt-6 mt-8 text-center border-t border-gray-800">
          <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {COMPANY_INFO.year} {COMPANY_INFO.name}. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 sm:justify-end">
              <Link href="/sitemap" className="text-sm text-gray-400 transition-colors hover:text-white">
                Sitemap
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/rss" className="text-sm text-gray-400 transition-colors hover:text-white">
                RSS Feed
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  )
}