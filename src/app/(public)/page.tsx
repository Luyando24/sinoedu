"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, Clock, Award, Globe, BookOpen } from "lucide-react"
import { FadeIn } from "@/components/ui/motion"
import { motion } from "framer-motion"
import { HeroSearchForm } from "@/components/HeroSearchForm"

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src="/images/gallery-5.jpg"
              alt="Students in China"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-red via-brand-red/70 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center space-y-8 pt-20 pb-32">

          <FadeIn delay={0.4}>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl max-w-4xl drop-shadow-sm">
              Your Trusted Partner for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                Studying in China
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow-sm">
              From application to arrival, your gateway to top universities.
            </p>
          </FadeIn>

          <FadeIn delay={0.9} fullWidth>
            <HeroSearchForm />
          </FadeIn>

        </div>
      </section>

      {/* About Section - New Layout (Image Left, Text Right) & Copy */}
      <section className="container">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <FadeIn direction="right" className="w-full md:w-1/2">
             <div className="relative h-[600px] w-full rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-2xl">
              <Image
                src="/images/gallery-2.jpg"
                alt="Sinoway Team"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </FadeIn>

          <FadeIn direction="left" className="w-full md:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                Unlocking Global <span className="text-brand-red">Opportunities</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-loose">
                At Sinoway Education, we don&apos;t just process applications; we architect futures. As a premier consultancy, we specialize in navigating the complex landscape of Chinese higher education for ambitious international students.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="flex flex-col gap-2">
                 <div className="h-10 w-10 rounded-full bg-brand-red/10 flex items-center justify-center">
                   <Globe className="h-5 w-5 text-brand-red" />
                 </div>
                 <h4 className="font-bold text-lg">Global Network</h4>
                 <p className="text-sm text-muted-foreground">Connecting you with 100+ top-tier universities across China.</p>
               </div>
               <div className="flex flex-col gap-2">
                 <div className="h-10 w-10 rounded-full bg-brand-red/10 flex items-center justify-center">
                   <BookOpen className="h-5 w-5 text-brand-red" />
                 </div>
                 <h4 className="font-bold text-lg">Scholarship Focus</h4>
                 <p className="text-sm text-muted-foreground">Dedicated team securing full and partial funding for 95% of students.</p>
               </div>
            </div>

            <Button size="lg" className="rounded-full px-8">
              Discover Our Story
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section - New */}
      <section className="bg-brand-blue py-16 text-white">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Partner Universities", value: "50+" },
            { label: "Students Placed", value: "2,000+" },
            { label: "Scholarships Awarded", value: "$5M+" },
            { label: "Success Rate", value: "98%" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-bold text-brand-hero">{stat.value}</h3>
              <p className="text-white/80 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services/Features - New Layout (Horizontal Cards) */}
      <section className="container py-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold">The Sinoway Advantage</h2>
          <p className="text-muted-foreground">Comprehensive support designed for your success.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {[
             { icon: Users, title: "Expert Guidance", desc: "Our counselors are alumni of Chinese universities, offering firsthand insights." },
             { icon: Clock, title: "Rapid Processing", desc: "Optimized workflows ensure your application moves faster than standard channels." },
             { icon: Award, title: "Elite Partnerships", desc: "Direct lines of communication with admissions offices at prestige institutions." },
           ].map((feature, i) => (
             <div key={i} className="group relative bg-muted/20 p-8 rounded-3xl hover:bg-brand-red hover:text-white transition-all duration-300">
               <div className="mb-6 inline-block p-4 rounded-2xl bg-white text-brand-red shadow-sm group-hover:bg-white/10 group-hover:text-white">
                 <feature.icon className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
               <p className="text-muted-foreground group-hover:text-white/90 leading-relaxed">
                 {feature.desc}
               </p>
             </div>
           ))}
        </div>
      </section>

      {/* Gallery - New Layout (Masonry-ish) */}
      <section className="container">
         <div className="flex flex-col md:flex-row gap-8 h-[600px]">
           <div className="w-full md:w-1/3 flex flex-col gap-8">
             <div className="flex-1 bg-muted rounded-3xl relative overflow-hidden group">
                <Image src="/images/gallery-3.jpg" alt="Campus" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                  <span className="text-white font-bold">Campus Life</span>
                </div>
             </div>
             <div className="h-1/3 bg-muted rounded-3xl relative overflow-hidden group">
                <Image src="/images/gallery-6.jpg" alt="Culture" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
             </div>
           </div>
           <div className="w-full md:w-1/3 bg-muted rounded-3xl relative overflow-hidden group">
              <Image src="/images/gallery-1.jpg" alt="Education" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/80 to-transparent w-full text-white">
                  <h3 className="text-2xl font-bold mb-2">Immersive Education</h3>
                  <p className="text-white/80 text-sm">Experience world-class learning facilities.</p>
              </div>
           </div>
           <div className="w-full md:w-1/3 flex flex-col gap-8">
             <div className="h-1/3 bg-muted rounded-3xl relative overflow-hidden group">
                <Image src="/images/gallery-4.jpg" alt="Graduation" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
             </div>
             <div className="flex-1 bg-muted rounded-3xl relative overflow-hidden group">
                <Image src="/images/gallery-5.jpg" alt="Students" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                 <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                  <span className="text-white font-bold">Community</span>
                </div>
             </div>
           </div>
         </div>
      </section>

      {/* CTA - New Layout (Full Width) */}
      <section className="bg-brand-red text-white py-24 mt-12">
        <div className="container text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Your Future Starts Here</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join the ranks of successful graduates who transformed their lives through education in China.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full">
              Begin Application
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-transparent border-white text-white hover:bg-white hover:text-brand-red">
              Speak to an Advisor
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
