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
    <div className="min-h-screen bg-muted/50 ">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
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
