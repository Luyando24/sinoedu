import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ServicesPage() {
  const services = [
    "University Admission Assistance",
    "Scholarship Application Support",
    "Visa Application Guidance",
    "Accommodation Arrangement",
    "Airport Pickup & Welcome",
    "Pre-departure Orientation",
  ]

  return (
    <div className="container py-16 space-y-12">
       <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive support for every step of your journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="text-brand-blue h-5 w-5" />
                {service}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide expert assistance to ensure this part of your journey is smooth and successful.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
