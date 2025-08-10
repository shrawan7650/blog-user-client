import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - TechBlog",
  description: "Terms and conditions for using our website and services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this
            agreement.
          </p>

          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on TechBlog's website for personal,
            non-commercial transitory viewing only.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The materials on TechBlog's website are provided on an 'as is' basis. TechBlog makes no warranties,
            expressed or implied, and hereby disclaims and negates all other warranties.
          </p>

          <h2>Limitations</h2>
          <p>
            In no event shall TechBlog or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption).
          </p>

          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on TechBlog's website could include technical, typographical, or photographic
            errors. TechBlog does not warrant that any of the materials on its website are accurate, complete, or
            current.
          </p>

          <h2>Links</h2>
          <p>
            TechBlog has not reviewed all of the sites linked to our website and is not responsible for the contents of
            any such linked site.
          </p>

          <h2>Modifications</h2>
          <p>
            TechBlog may revise these terms of service for its website at any time without notice. By using this
            website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </div>
      </div>
    </div>
  )
}
