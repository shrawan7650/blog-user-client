import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
        <p className="text-muted-foreground">Have a question or want to work together? We'd love to hear from you.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-medium">Email</h3>
            <p className="text-muted-foreground">hellotech.dev.blog@gmail.com</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-medium">Phone</h3>
            <p className="text-muted-foreground">+9905737772</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-medium">Address</h3>
            <p className="text-muted-foreground">
              Dhanbad
              <br />
              Jharkhand
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-medium">Business Hours</h3>
            <p className="text-muted-foreground">
              Monday - Friday: 9:00 AM - 6:00 PM
              <br />
              Saturday: 10:00 AM - 4:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
