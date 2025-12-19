import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function ContactPage() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <div className="flex flex-col gap-12 py-16 bg-slate-50 min-h-screen">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
           {/* Left: Contact Info & Text */}
           <div className="space-y-8">
             <div className="space-y-4">
               <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0056b3]">{getContent(blocks, 'contact.hero.title', "Let's Start Your Journey")}</h1>
               <p className="text-xl text-muted-foreground leading-relaxed">
                 {getContent(blocks, 'contact.hero.desc', "Whether you have questions about a specific program or need guidance on the visa process, our dedicated team is here to assist you.")}
               </p>
             </div>

             <div className="space-y-6">
                {[
                  { 
                    icon: MapPin, 
                    title: getContent(blocks, 'contact.info.visit.title', "Visit Us"), 
                    details: [
                      getContent(blocks, 'contact.info.visit.line1', "Room 1201, Building D, Guicheng Garden, Beijing Road"), 
                      getContent(blocks, 'contact.info.visit.line2', "Haicheng District, Beihai City, Guangxi Province, China")
                    ] 
                  },
                  { 
                    icon: Mail, 
                    title: getContent(blocks, 'contact.info.email.title', "Email Us"), 
                    details: [
                      getContent(blocks, 'contact.info.email.line1', "admissions@sinoway.com"), 
                      getContent(blocks, 'contact.info.email.line2', "support@sinoway.com")
                    ] 
                  },
                  { 
                    icon: Phone, 
                    title: getContent(blocks, 'contact.info.phone.title', "Call Us"), 
                    details: [
                      getContent(blocks, 'contact.info.phone.line1', "+86 123 456 7890"), 
                      getContent(blocks, 'contact.info.phone.line2', "Mon-Fri, 9am - 6pm CST")
                    ] 
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#0056b3]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-[#0056b3]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-[#0056b3]">{item.title}</h3>
                      {item.details.map((line, j) => (
                        <p key={j} className="text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
           </div>

           {/* Right: Clean Form */}
           <div className="bg-white p-8 md:p-10 rounded-3xl border shadow-lg">
             <h3 className="text-2xl font-bold mb-6 text-[#0056b3]">{getContent(blocks, 'contact.form.title', "Send a Message")}</h3>
             <form className="space-y-5">
               <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">First Name</label>
                   <Input placeholder="John" className="bg-slate-50" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Last Name</label>
                   <Input placeholder="Doe" className="bg-slate-50" />
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-medium">Email Address</label>
                 <Input type="email" placeholder="john@example.com" className="bg-slate-50" />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium">Subject</label>
                 <select className="flex h-10 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                   <option>General Inquiry</option>
                   <option>Admissions</option>
                   <option>Partnerships</option>
                   <option>Support</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-medium">Message</label>
                 <Textarea placeholder="How can we help you?" className="min-h-[150px] bg-slate-50" />
               </div>

               <Button size="lg" className="w-full bg-[#0056b3] hover:bg-[#0056b3]/90">Send Message</Button>
             </form>
           </div>
        </div>
      </div>

      {/* Full Width Map */}
      <div className="w-full h-[500px] bg-muted relative">
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.081829207436!2d116.4575!3d39.9042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35f052d9a30d315f%3A0x6a0c0e5a8b7a0b0!2sChina%20World%20Trade%20Center!5e0!3m2!1sen!2scn!4v1620000000000!5m2!1sen!2scn" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(100%)" }} 
            allowFullScreen 
            loading="lazy"
          ></iframe>
      </div>
    </div>
  )
}
