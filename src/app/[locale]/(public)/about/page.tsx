import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { CheckCircle, Trophy, Users, Globe, ShieldCheck, HeartHandshake, ThumbsUp, Crown, Rocket, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GalleryGrid } from "@/components/about/gallery-grid"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function AboutPage() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')
  const { data: reviews } = await supabase.from('agent_reviews').select('*').order('created_at', { ascending: true })

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

  const galleryImages = [
    ...Array.from({ length: 5 }, (_, i) => `/images/about/about-${i + 1}.jpg`),
    ...Array.from({ length: 10 }, (_, i) => `/images/about/gallery-${i + 1}.jpg`),
    ...Array.from({ length: 5 }, (_, i) => `/images/about/gallery-${i + 11}.png`),
  ]

  return (
    <div className="flex flex-col gap-24 py-16 bg-slate-50">
      {/* Unified Gallery Section */}
      <section className="container space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold text-[#0056b3]">Our Moments</h2>
          <p className="text-muted-foreground">Capturing the memories and success stories of our students.</p>
        </div>
        <GalleryGrid images={galleryImages} />
      </section>

      {/* Intro Section - Split View */}
      <section className="container">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0056b3]">
              Meet Our <span className="text-[#0056b3]">Founder</span>
            </h1>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#0056b3]">
                Steven Yang
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {getContent(blocks, 'about.hero.description', "As the founder of Sinoway Edu, I’ve steered our team in empowering international students to pursue studies in China since 2018. With nearly 8 years of dedicated experience in cross-border education consulting, we’ve forged partnerships with over 600 prestigious Chinese universities and supported more than 15,000 students in their study-in-China journey.")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                getContent(blocks, 'about.stats.1', "10+ Years Experience"),
                getContent(blocks, 'about.stats.2', "Official University Partners"),
                getContent(blocks, 'about.stats.3', "98% Visa Success Rate"),
                getContent(blocks, 'about.stats.4', "24/7 Student Support")
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#0056b3]" />
                  <span className="font-medium text-[#0056b3]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/about/founder.jpg"
              alt="Steven - Founder of Sinoway Education" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section - 4 Column */}
      <section className="bg-white py-20">
        <div className="container space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#0056b3]">Our core values</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: HeartHandshake, 
                title: "Integrity", 
                desc: "Provide accurate and reliable information, protect customer privacy, charge reasonably, and ensure the interests of the agent." 
              },
              { 
                icon: ThumbsUp, 
                title: "Professionalism", 
                desc: "Understand the enrollment characteristics and processes of various institutions, provide effective advice to agents and students, and ensure a high admission rate." 
              },
              { 
                icon: Crown, 
                title: "Customer Focus", 
                desc: "Be responsible for the agent, prioritize the agent's needs and satisfaction, and ensure the agent's interests" 
              },
              { 
                icon: Rocket, 
                title: "Efficiency", 
                desc: "Patient and enthusiastic, communicate in a timely manner, follow up promptly, and ensure the application is completed quickly and smoothly" 
              }
            ].map((value, i) => (
              <div key={i} className="bg-gray-200 p-8 rounded-xl relative group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                  <value.icon className="h-10 w-10 text-gray-800" strokeWidth={1.5} />
                  <ArrowUpRight className="h-6 w-6 text-white bg-gray-300 rounded-full p-1" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#0056b3]">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="container">
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0056b3]">
            {getContent(blocks, 'whyus.hero.title_prefix', "Why Choose")} <span className="text-[#0056b3]">{getContent(blocks, 'whyus.hero.highlight', "Sinoway?")}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {getContent(blocks, 'whyus.hero.desc', "Choosing an education consultant is as important as choosing a university. Here is what sets us apart in the crowded landscape of study abroad agencies.")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border hover:border-[#0056b3] hover:shadow-lg transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-[#0056b3]/10 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <reason.icon className="h-7 w-7 text-[#0056b3]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0056b3]">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white py-20">
        <div className="container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold text-[#0056b3]">Trusted by Partners Worldwide</h2>
            <p className="text-muted-foreground">Here&apos;s what our partner agents have to say about working with us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="shrink-0">
                    {review.image_url ? (
                      <div className="h-24 w-24 relative rounded-full overflow-hidden shrink-0">
                        <Image 
                          src={review.image_url} 
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-[#0056b3]/10 flex items-center justify-center shrink-0 text-[#0056b3] font-bold text-3xl">
                        {review.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="font-bold text-lg text-gray-900">{review.name}</h3>
                    <p className="font-bold text-[#0056b3]">
                      {review.country}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to hardcoded if no reviews in DB (or until migration is run)
              [
                {
                  text: "Sinoway has been an incredible partner for us. Their team's deep knowledge of Chinese universities and the admission process has helped hundreds of our students secure their spots. The efficiency and transparency they offer are unmatched.",
                  author: "Nguyen Van Minh",
                  role: "Director, Global Education Solutions",
                  country: "Vietnam"
                },
                {
                  text: "Working with Sinoway Edu is a pleasure. They are responsive, professional, and truly care about the students' success. Their support with scholarship applications has been a game-changer for our agency.",
                  author: "Aisha Karimova",
                  role: "Senior Consultant, Future Pathways",
                  country: "Kazakhstan"
                },
                {
                  text: "We value the integrity and reliability of Sinoway. They always deliver on their promises and provide accurate information. A trusted partner for anyone looking to send students to China.",
                  author: "Budi Santoso",
                  role: "Founder, Study Bridge",
                  country: "Indonesia"
                }
              ].map((review, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start">
                   <div className="shrink-0">
                      <div className="h-24 w-24 rounded-full bg-[#0056b3]/10 flex items-center justify-center shrink-0 text-[#0056b3] font-bold text-3xl">
                        {review.author.charAt(0)}
                      </div>
                   </div>
                   <div className="flex-1 text-center md:text-left space-y-2">
                     <h3 className="font-bold text-lg text-gray-900">{review.author}</h3>
                     <p className="font-bold text-[#0056b3]">{review.country}</p>
                     <p className="text-muted-foreground leading-relaxed text-sm">
                       {review.text}
                     </p>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Team/Office - Large Image */}
      <section className="container">
        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
          <Image 
            src={getContent(blocks, 'about.team.image', "/images/gallery-5.jpg")}
            alt="Office Environment" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0056b3]/60 flex items-center justify-center">
             <div className="text-center text-white space-y-4 max-w-2xl px-4">
               <h2 className="text-3xl md:text-4xl font-bold">{getContent(blocks, 'about.team.title', 'Meet Our Experts')}</h2>
               <p className="text-lg text-white/90">
                 {getContent(blocks, 'about.team.desc', 'Our team consists of former admission officers and alumni from China\'s top universities.')}
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0056b3] text-white py-20 rounded-3xl mx-4 lg:mx-20">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">{getContent(blocks, 'whyus.cta.title', "Ready to experience the difference?")}</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            {getContent(blocks, 'whyus.cta.desc', "Let us handle the complexities of your application while you focus on your future.")}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
               <Button size="lg" variant="secondary" className="font-bold text-[#0056b3]">
                 {getContent(blocks, 'whyus.cta.button', "Get Free Consultation")}
               </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
