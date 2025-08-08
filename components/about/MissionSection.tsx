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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to excellence and passion for technology guides everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
