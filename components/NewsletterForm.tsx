"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { newsletterService } from "@/services/newsletterService"
// import { newsletterService } from "@/lib/newsletterService"

export default function NewsletterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    setIsSubscribing(true)
    try {
      // send exactly 4 fields: Name, Email, Status, Subscribed
      await newsletterService.subscribe({
        name,
        email,
        status: "active",     
        subscribed: true
      })
      setSubscriptionStatus("success")
      setName("")
      setEmail("")
    } catch (error) {
      setSubscriptionStatus("error")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="p-6 rounded-lg shadow-sm bg-card">
      <div className="flex items-center mb-4 space-x-2">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Subscribe to Newsletter</h3>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Get the latest tech insights delivered to your inbox weekly.
      </p>

      {subscriptionStatus === "success" ? (
        <div className="text-sm font-medium text-green-600">
          ✅ Successfully subscribed! Check your email.
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isSubscribing}>
            {isSubscribing ? "Subscribing..." : "Subscribe"}
          </Button>
          {subscriptionStatus === "error" && (
            <p className="text-sm text-destructive">Failed to subscribe. Please try again.</p>
          )}
        </form>
      )}
    </div>
  )
}
