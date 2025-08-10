"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How long does it take to get a response?",
    answer:
      "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.",
  },
  {
    question: "Can I contribute to your blog?",
    answer:
      "Yes! We welcome guest contributors. Please include writing samples and your proposed topics when you contact us.",
  },
  {
    question: "Do you offer consulting services?",
    answer:
      "We offer limited consulting services for technology projects. Please describe your needs in detail when contacting us.",
  },
  {
    question: "How can I advertise on your website?",
    answer:
      "We have various advertising options available. Contact us with your requirements and we'll send you our media kit.",
  },
]

export function ContactFAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-border rounded-lg">
            <button
              className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium">{faq.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            {expandedIndex === index && <div className="px-4 pb-4 text-muted-foreground">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
