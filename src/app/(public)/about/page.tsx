import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function AboutPage() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <div className="flex flex-col gap-24 py-16">
      {/* Intro Section - Split View */}
      <section className="container">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {getContent(blocks, 'about.hero.title_prefix', 'Pioneering')} <span className="text-brand-red">{getContent(blocks, 'about.hero.title_highlight', 'Educational Bridges')}</span> {getContent(blocks, 'about.hero.title_suffix', 'to China')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {getContent(blocks, 'about.hero.description', 'Founded on the belief that education knows no borders, Sinoway Education has evolved from a small consultancy to a leading authority in Sino-international student exchange. We are more than agents; we are mentors, strategists, and your first family in a new land.')}
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                getContent(blocks, 'about.stats.1', "10+ Years Experience"),
                getContent(blocks, 'about.stats.2', "Official University Partners"),
                getContent(blocks, 'about.stats.3', "98% Visa Success Rate"),
                getContent(blocks, 'about.stats.4', "24/7 Student Support")
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-red" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={getContent(blocks, 'about.hero.image', "/images/gallery-3.jpg")}
              alt="Our Team" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section - 3 Column */}
      <section className="bg-muted/30 py-20">
        <div className="container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">{getContent(blocks, 'about.values.title', 'Core Values Driving Us')}</h2>
            <p className="text-muted-foreground">{getContent(blocks, 'about.values.subtitle', 'The principles that guide every interaction and decision.')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: getContent(blocks, 'about.values.1.title', "Integrity First"), desc: getContent(blocks, 'about.values.1.desc', "Transparent processes with no hidden fees or false promises.") },
              { title: getContent(blocks, 'about.values.2.title', "Student-Centric"), desc: getContent(blocks, 'about.values.2.desc', "Your academic goals and personal well-being are our top priority.") },
              { title: getContent(blocks, 'about.values.3.title', "Excellence"), desc: getContent(blocks, 'about.values.3.desc', "We strive for the highest standards in application quality and support.") }
            ].map((value, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl border hover:border-brand-red transition-colors shadow-sm">
                <div className="h-12 w-12 bg-brand-red/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-brand-red">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Office - Large Image */}
      <section className="container">
        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
          <Image 
            src={getContent(blocks, 'about.team.image', "/images/gallery-5.jpg")}
            alt="Office Environment" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <div className="text-center text-white space-y-4 max-w-2xl px-4">
               <h2 className="text-3xl md:text-4xl font-bold">{getContent(blocks, 'about.team.title', 'Meet Our Experts')}</h2>
               <p className="text-lg text-white/90">
                 {getContent(blocks, 'about.team.desc', 'Our team consists of former admission officers and alumni from China\'s top universities.')}
               </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
