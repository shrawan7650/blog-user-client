"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterService } from "@/services/newsletterService";

export default function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type] = useState("newsletter");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubscribing(true);
    try {
      // 1️⃣ Save subscriber in newsletterService
      await newsletterService.subscribe({
        name,
        email,
        status: "active",
        subscribed: true,
      });

      // 2️⃣ Send emails via API route
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email , type }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Email send failed");

      setSubscriptionStatus("success");
      setName("");
      setEmail("");
    } catch (error) {
      // console.error("Subscription error:", error);
      setSubscriptionStatus("error");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-sm bg-card dark:bg-gray-800">
      <div className="flex items-center mb-4 space-x-2">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Subscribe to Inspitech Newsletter</h3>
      </div>

      <p className="mb-4 text-sm text-muted-foreground dark:text-gray-300">
        Get the latest AI & tech insights delivered weekly.
      </p>

      {subscriptionStatus === "success" ? (
        <div className="text-sm font-medium text-green-500">
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
            <p className="text-sm text-destructive">
              Failed to subscribe or send email. Please try again.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
