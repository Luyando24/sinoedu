import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, GraduationCap, Plane, Home, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: GraduationCap,
      title: "University Admission",
      desc: "Navigate the complex application systems of China's elite universities with our guided support.",
      features: ["Program Selection Strategy", "Document Review & Editing", "Direct Application Submission", "Interview Preparation"]
    },
    {
      icon: FileText,
      title: "Scholarship Management",
      desc: "Unlock financial aid opportunities including CSC, Provincial, and University-specific scholarships.",
      features: ["Eligibility Assessment", "Scholarship Essay Polishing", "Application Tracking", "Acceptance Guidance"]
    },
    {
      icon: Plane,
      title: "Visa & Immigration",
      desc: "Seamless transition from acceptance letter to student visa (X1/X2) with zero stress.",
      features: ["JW201/JW202 Processing", "Embassy Interview Coaching", "Medical Checkup Guidance", "Residence Permit Support"]
    },
    {
      icon: Home,
      title: "Accommodation & Settlement",
      desc: "Find your home away from home before you even land in China.",
      features: ["Dormitory Booking", "Off-campus Housing Search", "Police Registration Support", "Utility Setup Assistance"]
    },
    {
      icon: Users,
      title: "Arrival & Orientation",
      desc: "A warm welcome to ensure you settle in comfortably and confidently.",
      features: ["Airport Pickup Service", "SIM Card & Bank Account Setup", "Campus Tour", "Cultural Integration Workshops"]
    }
  ]

  return (
    <div className="container py-16 space-y-20">
       <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Service Portfolio</h1>
        <p className="text-xl text-muted-foreground">
          We offer a holistic suite of services designed to handle every aspect of your study abroad journey.
        </p>
      </div>

      <div className="space-y-12">
        {services.map((service, i) => (
          <div key={i} className="group flex flex-col md:flex-row gap-8 items-start border-b pb-12 last:border-0">
             <div className="md:w-1/3 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold">{service.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
                <Link href="/contact">
                  <Button variant="link" className="p-0 text-brand-red font-semibold group-hover:translate-x-2 transition-transform">
                    Inquire Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
             </div>
             
             <div className="md:w-2/3 bg-muted/30 rounded-3xl p-8 hover:bg-muted/50 transition-colors">
               <h3 className="font-semibold mb-6">What&apos;s Included:</h3>
               <div className="grid sm:grid-cols-2 gap-4">
                 {service.features.map((feature, j) => (
                   <div key={j} className="flex items-center gap-3">
                     <CheckCircle className="h-5 w-5 text-brand-blue flex-shrink-0" />
                     <span className="text-sm md:text-base">{feature}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="bg-brand-blue text-white rounded-3xl p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold">Need a Custom Package?</h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          We understand every student's situation is unique. Contact us to discuss a tailored service plan that fits your specific needs.
        </p>
        <Link href="/contact">
          <Button size="lg" variant="secondary" className="text-brand-blue font-bold">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  )
}
