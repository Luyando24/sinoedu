import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Trophy, Users, Globe, ShieldCheck, HeartHandshake } from "lucide-react"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function WhyUsPage() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  const reasons = [
    {
      icon: Trophy,
      title: getContent(blocks, 'whyus.1.title', "Proven Track Record"),
      desc: getContent(blocks, 'whyus.1.desc', "With a 98% admission success rate and over $5M in scholarships secured, our results speak for themselves.")
    },
    {
      icon: Users,
      title: getContent(blocks, 'whyus.2.title', "Personalized Mentorship"),
      desc: getContent(blocks, 'whyus.2.desc', "We don't just process papers. We provide 1-on-1 career counseling and academic roadmap planning.")
    },
    {
      icon: Globe,
      title: getContent(blocks, 'whyus.3.title', "Exclusive Partnerships"),
      desc: getContent(blocks, 'whyus.3.desc', "Direct agreements with 50+ top Chinese universities give our students priority consideration.")
    },
    {
      icon: ShieldCheck,
      title: getContent(blocks, 'whyus.4.title', "End-to-End Support"),
      desc: getContent(blocks, 'whyus.4.desc', "From the first consultation to airport pickup and dormitory settlement, we are with you every step.")
    },
    {
      icon: HeartHandshake,
      title: getContent(blocks, 'whyus.5.title', "Transparent Process"),
      desc: getContent(blocks, 'whyus.5.desc', "No hidden fees, no false promises. We believe in complete honesty and ethical counseling.")
    },
    {
      icon: CheckCircle,
      title: getContent(blocks, 'whyus.6.title', "Local Presence"),
      desc: getContent(blocks, 'whyus.6.desc', "Our team in China ensures you have on-ground support whenever you face any challenges.")
    }
  ]

  return (
    <div className="flex flex-col gap-20 py-16">
      {/* Hero */}
      <section className="container text-center space-y-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {getContent(blocks, 'whyus.hero.title_prefix', "Why Choose")} <span className="text-brand-red">{getContent(blocks, 'whyus.hero.highlight', "Sinoway?")}</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {getContent(blocks, 'whyus.hero.desc', "Choosing an education consultant is as important as choosing a university. Here is what sets us apart in the crowded landscape of study abroad agencies.")}
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
          <h2 className="text-3xl md:text-4xl font-bold">{getContent(blocks, 'whyus.cta.title', "Ready to experience the difference?")}</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            {getContent(blocks, 'whyus.cta.desc', "Let us handle the complexities of your application while you focus on your future.")}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
               <Button size="lg" variant="secondary" className="font-bold">
                 {getContent(blocks, 'whyus.cta.button', "Get Free Consultation")}
               </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
