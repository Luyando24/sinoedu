import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Trophy, Users, Globe, ShieldCheck, HeartHandshake } from "lucide-react"

export default function WhyUsPage() {
  const reasons = [
    {
      icon: Trophy,
      title: "Proven Track Record",
      desc: "With a 98% admission success rate and over $5M in scholarships secured, our results speak for themselves."
    },
    {
      icon: Users,
      title: "Personalized Mentorship",
      desc: "We don't just process papers. We provide 1-on-1 career counseling and academic roadmap planning."
    },
    {
      icon: Globe,
      title: "Exclusive Partnerships",
      desc: "Direct agreements with 50+ top Chinese universities give our students priority consideration."
    },
    {
      icon: ShieldCheck,
      title: "End-to-End Support",
      desc: "From the first consultation to airport pickup and dormitory settlement, we are with you every step."
    },
    {
      icon: HeartHandshake,
      title: "Transparent Process",
      desc: "No hidden fees, no false promises. We believe in complete honesty and ethical counseling."
    },
    {
      icon: CheckCircle,
      title: "Local Presence",
      desc: "Our team in China ensures you have on-ground support whenever you face any challenges."
    }
  ]

  return (
    <div className="flex flex-col gap-20 py-16">
      {/* Hero */}
      <section className="container text-center space-y-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Why Choose <span className="text-brand-red">Sinoway?</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Choosing an education consultant is as important as choosing a university. Here is what sets us apart in the crowded landscape of study abroad agencies.
        </p>
      </section>

      {/* Grid */}
      <section className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <div key={i} className="bg-muted/20 p-8 rounded-3xl border hover:border-brand-red hover:shadow-lg transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <reason.icon className="h-7 w-7 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-blue text-white py-20">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to experience the difference?</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Let us handle the complexities of your application while you focus on your future.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
               <Button size="lg" variant="secondary" className="font-bold">
                 Get Free Consultation
               </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
