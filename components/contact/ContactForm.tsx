"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactService } from "@/services/contactService";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    type: "contact",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to your DB/service (optional)
      await contactService.submitContact(
        formData.name,
        formData.email,
        formData.message
      );

      // Call API route
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          type: formData.type, // "contact" or "newsletter"
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Email send failed");

      setStatus("success");
      setFormData({ name: "", email: "", message: "", type: "contact" }); // reset
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (status === "success") {
    return (
      <div className="p-6 text-center border border-green-200 rounded-lg bg-green-50 h-fit">
        <div className="mb-2 text-lg font-medium text-green-600">
          ✅ Message Sent Successfully!
        </div>
        <p className="text-green-700">
          Thank you for your message. We'll get back to you soon.
        </p>
        <Button
          variant="outline"
          onClick={() => setStatus("idle")}
          className="mt-4"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium">
          Name *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Email *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block mb-2 text-sm font-medium">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Tell us how we can help you..."
          rows={6}
        />
      </div>

      {status === "error" && (
        <div className="p-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
          Failed to send message. Please try again.
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
