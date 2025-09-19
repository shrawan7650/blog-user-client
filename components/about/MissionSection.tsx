import { Target, Users, Lightbulb } from "lucide-react"

export function MissionSection() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To democratize technology knowledge by providing high-quality, accessible content that empowers developers and tech enthusiasts worldwide.",
    },
    {
      icon: Users,
      title: "Our Community",
      description:
        "We believe in building a supportive community where knowledge is shared freely and everyone can learn from each other's experiences.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description:
        "To become the go-to resource for technology insights, helping shape the future of software development and innovation.",
    },
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Drives Us</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Our commitment to excellence and passion for technology guides everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-bold">{value.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
