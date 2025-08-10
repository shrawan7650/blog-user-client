import type { Metadata } from "next"
import { ContactForm } from "@/components/contact/ContactForm"
import { ContactInfo } from "@/components/contact/ContactInfo"
import { ContactFAQ } from "@/components/contact/ContactFAQ"

export const metadata: Metadata = {
  title: "Contact Us - TechBlog",
  description: "Get in touch with us. We'd love to hear from you and answer any questions you might have.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>

          <div className="mt-16">
            <ContactFAQ />
          </div>
        </div>
      </div>
    </div>
  )
}
