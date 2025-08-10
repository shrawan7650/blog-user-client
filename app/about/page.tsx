import type { Metadata } from "next"
import { AboutHero } from "@/components/about/AboutHero"
import { MissionSection } from "@/components/about/MissionSection"
import { TeamSection } from "@/components/about/TeamSection"

export const metadata: Metadata = {
  title: "About Us - TechBlog",
  description:
    "Learn about our mission to provide the latest technology insights and tutorials to developers worldwide.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <MissionSection />
      <TeamSection />
    </div>
  )
}
