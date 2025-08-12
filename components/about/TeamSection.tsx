import Image from "next/image"
import { Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

const team = [
  {
    name: "Shrawan Kumar",
    role: "Founder & Editor-in-Chief",
    bio: "Full-stack developer with 10+ years of experience in web technologies and a passion for sharing knowledge.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Sarah Chen",
    role: "Senior Technical Writer",
    bio: "Former software engineer turned technical writer, specializing in making complex concepts accessible to everyone.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Mike Rodriguez",
    role: "DevOps Specialist",
    bio: "Cloud infrastructure expert with extensive experience in scalable systems and modern deployment practices.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
]

export function TeamSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Meet Our Team</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            The passionate individuals behind TechBlog, dedicated to bringing you the best content.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {team.map((member, index) => (
            <div key={index} className="p-6 text-center rounded-lg shadow-sm bg-card">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover rounded-full"
                  loading="lazy"
                />
              </div>

              <h3 className="mb-2 text-xl font-bold">{member.name}</h3>
              <p className="mb-4 font-medium text-primary">{member.role}</p>
              <p className="mb-6 leading-relaxed text-muted-foreground">{member.bio}</p>

              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
