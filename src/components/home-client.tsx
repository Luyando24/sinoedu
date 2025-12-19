"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, Globe, ArrowUp, MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, HelpCircle, Target, CheckCircle, Play } from "lucide-react"
import Link from "next/link"
import { HeroSearchForm } from "./HeroSearchForm"

const SLIDER_IMAGES = [
  "/images/sliders/slider-1.jpg",
  "/images/sliders/slider-2.jpg",
  "/images/sliders/slider-3.jpg",
  "/images/sliders/slider-4.jpg",
]

type ContentBlock = {
  key: string
  content: string
}

const getContent = (blocks: ContentBlock[], key: string, fallback: string) => {
  return blocks?.find(b => b.key === key)?.content || fallback
}

export function HomeClient({ content }: { content: ContentBlock[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-20 bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={SLIDER_IMAGES[currentSlide]}
                alt="Hero Background"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Text Overlay & Search */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pb-10">
          <div className="container px-4 text-center space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide text-white drop-shadow-lg">
              {getContent(content, 'home.hero.title_new', 'Study in China')}
            </h1>
            <p className="text-base md:text-xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-md">
              {getContent(content, 'home.hero.subtitle_long', 'Professional team, professional service, making study in China simpler.')}
            </p>
            
            <div className="w-full max-w-5xl mx-auto">
              <HeroSearchForm />
            </div>
          </div>
        </div>

        {/* TOP Button */}
        <button 
          onClick={scrollToTop}
          className="absolute bottom-20 right-4 md:bottom-24 md:right-12 z-20 bg-[#2d74c4] hover:bg-[#2d74c4]/90 text-white w-12 h-14 md:w-14 md:h-16 flex flex-col items-center justify-center rounded shadow-lg transition-colors"
        >
          <ArrowUp className="h-5 w-5 md:h-6 md:w-6 mb-1" />
          <span className="text-[10px] md:text-xs font-bold">TOP</span>
        </button>
      </section>

      {/* Sinoway Education Section */}
      <section className="container">
        <h2 className="text-[#0056b3] text-3xl font-bold mb-8">Sinoway Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Headquarters */}
          <div className="bg-[#0056b3] text-white p-8 rounded-lg shadow-md relative overflow-hidden min-h-[300px]">
            {/* Background Image Overlay */}
             <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20 pointer-events-none">
               <Image src="/images/gallery-1.jpg" alt="Beijing" fill className="object-cover object-bottom" />
             </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-semibold mb-4">Headquarters</h3>
              <div className="flex gap-3 items-start text-sm">
                <MapPin className="h-5 w-5 shrink-0 mt-1" />
                <p>Level 15, China World Tower B, Chaoyang District, Beijing, China</p>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Phone className="h-5 w-5 shrink-0" />
                <p>+86 123 456 7890</p>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Mail className="h-5 w-5 shrink-0" />
                <p>admissions@sinoway.com</p>
              </div>
              <div className="flex gap-4 mt-6">
                <Facebook className="h-6 w-6 cursor-pointer hover:text-white/80" />
                <div className="h-6 w-6 border rounded flex items-center justify-center cursor-pointer hover:bg-white/10">VK</div>
                <Instagram className="h-6 w-6 cursor-pointer hover:text-white/80" />
                <MessageCircle className="h-6 w-6 cursor-pointer hover:text-white/80" />
              </div>
            </div>
          </div>

          {/* International Support */}
          <div className="bg-[#0056b3] text-white p-8 rounded-lg shadow-md relative overflow-hidden min-h-[300px]">
             <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20 pointer-events-none">
               <Image src="/images/gallery-2.jpg" alt="Support" fill className="object-cover object-bottom" />
             </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-semibold mb-4">International Support</h3>
              <div className="flex gap-3 items-start text-sm">
                <MapPin className="h-5 w-5 shrink-0 mt-1" />
                <p>Online Support Center, Available Globally</p>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Phone className="h-5 w-5 shrink-0" />
                <p>+86 123 456 7890</p>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Mail className="h-5 w-5 shrink-0" />
                <p>support@sinoway.com</p>
              </div>
              <div className="flex gap-3 items-center text-sm mt-4">
                <Globe className="h-5 w-5 shrink-0" />
                <p>www.sinoway.com</p>
              </div>
            </div>
          </div>

          {/* Student Services */}
          <div className="bg-[#0056b3] text-white p-8 rounded-lg shadow-md relative overflow-hidden min-h-[300px]">
             <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20 pointer-events-none">
               <Image src="/images/gallery-3.jpg" alt="Student Services" fill className="object-cover object-bottom" />
             </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-semibold mb-4">Student Services</h3>
              <div className="flex gap-3 items-start text-sm">
                <MapPin className="h-5 w-5 shrink-0 mt-1" />
                <p>Global Student Center</p>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Phone className="h-5 w-5 shrink-0" />
                <p>+86 123 456 7890</p>
              </div>
              <div className="flex gap-3 items-center text-sm">
                <Mail className="h-5 w-5 shrink-0" />
                <p>students@sinoway.com</p>
              </div>
              <div className="flex gap-3 items-start text-sm mt-4">
                <Globe className="h-5 w-5 shrink-0 mt-1" />
                <p className="break-all">www.sinoway.com/services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Program */}
      <section className="bg-[#2d74c4] py-16">
        <div className="container">
          <h2 className="text-white text-3xl font-bold mb-8">Scholarship Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chinese Government Scholarship */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg h-[350px] flex flex-col">
              <div className="h-2/3 relative">
                 <Image src="/images/gallery-6.jpg" alt="Chinese Government Scholarship" fill className="object-cover" />
              </div>
              <div className="h-1/3 bg-[#1e5aa0] flex items-center justify-center gap-4 text-white p-4">
                <div className="h-12 w-12 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xl font-bold">¥</span>
                </div>
                <span className="text-xl font-semibold">Chinese Government<br/>Scholarship</span>
              </div>
            </div>

             {/* Local Government Scholarship */}
             <div className="bg-white rounded-xl overflow-hidden shadow-lg h-[350px] flex items-center justify-center relative">
               <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                 <div className="w-64 h-64 border-[20px] border-blue-200 rotate-45 rounded-3xl"></div>
               </div>
               <div className="flex items-center gap-6 z-10">
                 <div className="h-20 w-20 bg-[#1e5aa0] rounded-xl flex items-center justify-center shadow-lg text-white">
                    <span className="text-4xl font-bold">¥</span>
                 </div>
                 <div className="text-[#1e5aa0] text-2xl font-bold">
                   Local Government<br/>Scholarship
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Application */}
      <section className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[#0056b3] text-3xl font-bold">University application</h2>
          <Link href="/universities" className="text-[#0056b3] font-bold text-lg hover:underline">MORE+</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { name: "Tsinghua University", img: "/images/gallery-10.jpg", desc: "Renowned for its outstanding engineering programs and rich historical and cultural heritage, offers a wealth of academic resources." },
             { name: "Shanghai University", img: "/images/gallery-11.jpg", desc: "Recognized for its comprehensive academic disciplines and vibrant international community, is known for its strong emphasis on global perspectives." },
             { name: "Peking University", img: "/images/gallery-9.jpg", desc: "A major Chinese research university in Beijing and a member of the C9 League. It is colloquially known as Beida." },
           ].map((uni, i) => (
             <div key={i} className="bg-white shadow-lg rounded-none overflow-hidden group hover:shadow-xl transition-shadow">
               <div className="h-64 relative overflow-hidden">
                 <Image src={uni.img} alt={uni.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-6 bg-slate-100 min-h-[200px]">
                 <h3 className="text-xl font-bold mb-4 text-black">{uni.name}</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">{uni.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Short-term Study Tour */}
      <section className="container">
        <h2 className="text-[#0056b3] text-3xl font-bold mb-8">Short-term Study Tour</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
             {/* Academic Experience */}
             <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-6 items-center">
               <div className="w-full sm:w-1/2 h-48 relative rounded-lg overflow-hidden shrink-0">
                 <Image src="/images/gallery-4.jpg" alt="Academic Experience" fill className="object-cover" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-[#0056b3] font-bold text-lg">Academic Experience:</h3>
                 <p className="text-sm text-gray-600">Visiting prestigious universities, broaden international perspectives, enhance intercultural communication skills.</p>
               </div>
             </div>

             {/* Cultural Perception */}
             <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-6 items-center">
               <div className="w-full sm:w-1/2 h-48 relative rounded-lg overflow-hidden shrink-0">
                 <Image src="/images/gallery-7.jpg" alt="Cultural Perception" fill className="object-cover" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-[#0056b3] font-bold text-lg">Cultural Perception:</h3>
                 <p className="text-sm text-gray-600">Immersive experience in traditional Chinese culture and arts, visiting historical sites and monuments, understand Chinese history.</p>
               </div>
             </div>
          </div>

          {/* Right Column - Language Study */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-4">
             <div className="w-full h-[300px] lg:h-[400px] relative rounded-lg overflow-hidden">
               <Image src="/images/gallery-8.jpg" alt="Language study" fill className="object-cover" />
             </div>
             <div className="p-2 space-y-2">
               <h3 className="text-[#0056b3] font-bold text-lg">Language study:</h3>
               <p className="text-sm text-gray-600">Incorporating Chinese language learning with practical activities, familiarize students with HSK examination, explore the charm of language</p>
             </div>
          </div>
        </div>
      </section>

      {/* Cityscape */}
      <section className="container">
        <h2 className="text-[#0056b3] text-3xl font-bold mb-8">Cityscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { city: "Beijing", img: "/images/gallery-1.jpg" },
             { city: "Shanghai", img: "/images/gallery-2.jpg" },
             { city: "Guangzhou", img: "/images/gallery-3.jpg" },
           ].map((item, i) => (
             <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
               <div className="h-64 relative">
                 <Image src={item.img} alt={item.city} fill className="object-cover" />
               </div>
               <div className="p-4 bg-gray-100 flex justify-between items-center">
                 <span className="text-lg font-medium">{item.city}</span>
                 <Button size="sm" className="bg-[#1e5aa0] hover:bg-[#1e5aa0]/90 text-white font-bold px-6 rounded">CHINA</Button>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Application Process */}
      <section className="container py-8">
        <h2 className="text-[#0056b3] text-3xl font-bold mb-12">Application Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            { 
              icon: HelpCircle, 
              title: "Assessment", 
              desc: "Identify the student's needs, initially grasp the student's academic situation and application information" 
            },
            { 
              icon: Target, 
              title: "Counseling", 
              desc: "Develop a strategy, guide the student in preparing application materials" 
            },
            { 
              icon: Clock, 
              title: "Submission", 
              desc: "Submit applications, track application status, and promptly supplement materials" 
            },
            { 
              icon: CheckCircle, 
              title: "Enrollment", 
              desc: "Obtain admission results, Interpret the admission notification and pay the required fees" 
            }
          ].map((step, i, arr) => (
            <div key={i} className="flex flex-col items-center text-center relative group">
              <div className="w-24 h-24 rounded-full border-[3px] border-[#0056b3] flex items-center justify-center mb-6 bg-white z-10">
                <step.icon className="h-12 w-12 text-[#0056b3]" strokeWidth={1.5} />
              </div>
              {i < arr.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full z-0">
                  <div className="flex items-center justify-center w-full pl-12">
                     <Play className="h-6 w-6 text-[#0056b3] fill-[#0056b3]" />
                  </div>
                </div>
              )}
              <h3 className="text-[#0056b3] text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-sm text-[#0056b3]/80 leading-relaxed max-w-[200px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey Banner */}
      <section className="relative h-[250px] w-full overflow-hidden bg-[#0056b3] flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/gallery-5.jpg" alt="Background" fill className="object-cover" />
        </div>
        <div className="relative z-10 flex items-center gap-8 w-full container justify-center">
           <div className="h-px bg-white/50 w-24 md:w-64"></div>
           <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wide text-center">Journey to China starts here</h2>
           <div className="h-px bg-white/50 w-24 md:w-64"></div>
        </div>
      </section>

    </div>
  )
}
