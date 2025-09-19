import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - TechBlog",
  description: "Our privacy policy explains how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, subscribe to our
            newsletter, or contact us.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, send you newsletters and
            updates, and respond to your inquiries.
          </p>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your
            consent, except as described in this policy.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2>GDPR Compliance</h2>
          <p>
            If you are a resident of the European Union, you have certain rights regarding your personal data, including
            the right to access, update, or delete your information.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies to enhance your experience on our website. You can control cookie settings through your
            browser preferences.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@techblog.com.</p>
        </div>
      </div>
    </div>
  )
}
