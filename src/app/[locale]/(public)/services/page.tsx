import { createClient } from "@/lib/supabase/server"
import { CheckCircle, FileText, GraduationCap, Plane, Home, Users, ArrowRight, Languages, Lock, Building2, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function ServicesPage() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  const services = [
    {
      icon: GraduationCap,
      title: getContent(blocks, 'services.1.title', "University Admission"),
      desc: getContent(blocks, 'services.1.desc', "Navigate the complex application systems of China's elite universities with our guided support."),
      features: ["Program Selection Strategy", "Document Review & Editing", "Direct Application Submission", "Interview Preparation"]
    },
    {
      icon: FileText,
      title: getContent(blocks, 'services.2.title', "Scholarship Management"),
      desc: getContent(blocks, 'services.2.desc', "Unlock financial aid opportunities including CSC, Provincial, and University-specific scholarships."),
      features: ["Eligibility Assessment", "Scholarship Essay Polishing", "Application Tracking", "Acceptance Guidance"]
    },
    {
      icon: Plane,
      title: getContent(blocks, 'services.3.title', "Visa & Immigration"),
      desc: getContent(blocks, 'services.3.desc', "Seamless transition from acceptance letter to student visa (X1/X2) with zero stress."),
      features: ["JW201/JW202 Processing", "Embassy Interview Coaching", "Medical Checkup Guidance", "Residence Permit Support"]
    },
    {
      icon: Home,
      title: getContent(blocks, 'services.4.title', "Accommodation & Settlement"),
      desc: getContent(blocks, 'services.4.desc', "Find your home away from home before you even land in China."),
      features: ["Dormitory Booking", "Off-campus Housing Search", "Police Registration Support", "Utility Setup Assistance"]
    },
    {
      icon: Users,
      title: getContent(blocks, 'services.5.title', "Arrival & Orientation"),
      desc: getContent(blocks, 'services.5.desc', "A warm welcome to ensure you settle in comfortably and confidently."),
      features: ["Airport Pickup Service", "SIM Card & Bank Account Setup", "Campus Tour", "Cultural Integration Workshops"]
    },
    {
      icon: Languages,
      title: getContent(blocks, 'services.6.title', "Translation Services"),
      desc: getContent(blocks, 'services.6.desc', "Professional translation for your academic and personal documents."),
      features: ["Academic Transcript Translation", "Degree Certificate Translation", "Personal Statement Translation", "Legal Document Translation"]
    },
    {
      icon: Lock,
      title: getContent(blocks, 'services.7.title', "Document Authentication"),
      desc: getContent(blocks, 'services.7.desc', "Official verification and notarization services for your critical documents."),
      features: ["Embassy Legalization", "Ministry of Foreign Affairs Attestation", "Notary Public Services", "Apostille Services"]
    },
    {
      icon: Building2,
      title: getContent(blocks, 'services.8.title', "Company Registration"),
      desc: getContent(blocks, 'services.8.desc', "Expert assistance for international entrepreneurs looking to start a business in China."),
      features: ["Business License Application", "Tax Registration", "Bank Account Opening", "Office Address Registration"]
    },
    {
      icon: Briefcase,
      title: getContent(blocks, 'services.9.title', "Job Search Support"),
      desc: getContent(blocks, 'services.9.desc', "Career guidance and support for students and graduates seeking employment in China."),
      features: ["Resume/CV Optimization", "Interview Coaching", "Job Market Insights", "Work Visa (Z Visa) Consultation"]
    }
  ]

  return (
    <div className="container py-16 space-y-20 bg-slate-50 min-h-screen">
       <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0056b3]">{getContent(blocks, 'services.hero.title', "Our Service Portfolio")}</h1>
        <p className="text-xl text-muted-foreground">
          {getContent(blocks, 'services.hero.desc', "We offer a holistic suite of services designed to handle every aspect of your study abroad journey.")}
        </p>
      </div>

      <div className="space-y-12">
        {services.map((service, i) => (
          <div key={i} className="group flex flex-col md:flex-row gap-8 items-start border-b border-gray-200 pb-12 last:border-0">
             <div className="md:w-1/3 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-[#0056b3] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <service.icon className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold text-[#0056b3]">{service.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
                <Link href="/contact">
                  <Button variant="link" className="p-0 text-[#0056b3] font-semibold group-hover:translate-x-2 transition-transform">
                    Inquire Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
             </div>
             
             <div className="md:w-2/3 bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
               <h3 className="font-semibold mb-6 text-[#0056b3]">What&apos;s Included:</h3>
               <div className="grid sm:grid-cols-2 gap-4">
                 {service.features.map((feature, j) => (
                   <div key={j} className="flex items-center gap-3">
                     <CheckCircle className="h-5 w-5 text-[#0056b3] flex-shrink-0" />
                     <span className="text-sm md:text-base text-gray-700">{feature}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="bg-[#0056b3] text-white rounded-3xl p-12 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold">{getContent(blocks, 'services.cta.title', "Need a Custom Package?")}</h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          {getContent(blocks, 'services.cta.desc', "We understand every student's situation is unique. Contact us to discuss a tailored service plan that fits your specific needs.")}
        </p>
        <Link href="/contact">
          <Button size="lg" variant="secondary" className="text-[#0056b3] font-bold bg-white hover:bg-white/90">
            {getContent(blocks, 'services.cta.button', "Contact Support")}
          </Button>
        </Link>
      </div>
    </div>
  )
}
