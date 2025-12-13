"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, GraduationCap, Users, Clock, Award, ArrowRight } from "lucide-react"
import { FadeIn, HoverCard, StaggerContainer } from "@/components/ui/motion"
import { motion } from "framer-motion"
import { HeroSearchForm } from "@/components/HeroSearchForm"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
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

        <div className="container relative z-10 flex flex-col items-center text-center space-y-8 pt-20">
          <FadeIn delay={0.2} direction="down">
            <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-md">
              <span className="mr-2 rounded-full bg-brand-red px-2 py-0.5 text-xs font-bold">NEW</span>
              <span className="font-medium">2025 Scholarship Applications Open</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl max-w-4xl drop-shadow-sm">
              Your Gateway to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                World-Class Education
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow-sm">
              Secure your future with Chinese Scholarship Agency. We simplify university admissions and scholarship applications for students worldwide.
            </p>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-brand-red hover:bg-white/90 font-bold w-full sm:w-auto text-lg h-12 px-8 shadow-lg shadow-white/10">
                    Apply Now
                  </Button>
                </motion.div>
              </Link>
              <Link href="/programs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto text-lg h-12 px-8">
                    Explore Programs
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.9} fullWidth>
            <HeroSearchForm />
          </FadeIn>

          <FadeIn delay={1.0} fullWidth>
            <div className="grid grid-cols-3 gap-8 pt-12 text-white/80 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm">Partner Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10k+</div>
                <div className="text-sm">Students Placed</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Who We Are */}
      <section className="container py-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-brand-red">Who We Are</h2>
              <h3 className="text-2xl font-semibold text-foreground">Bridging the Gap to Your Dreams</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Chinese Scholarship Agency is a premier educational consultancy dedicated to helping international students achieve their academic dreams in China.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With a team of international and Chinese professionals, we bridge the gap between you and top-tier Chinese institutions. Our expertise ensures a smooth application process, from choosing the right university to securing full or partial scholarships.
              </p>
              <ul className="space-y-3 pt-4">
                {[
                  "Official representatives of top universities",
                  "Dedicated scholarship support team",
                  "End-to-end visa and arrival assistance"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-brand-blue" />
                    <span className="text-foreground/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Button variant="link" className="text-brand-blue p-0 h-auto font-semibold">
                Learn more about us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 group">
              <Image
                src="/images/gallery-2.jpg"
                alt="CSA Team"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gallery / Life in China Section */}
      <section className="bg-muted/30 py-20 overflow-hidden">
        <div className="container space-y-12">
          <FadeIn direction="up">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">Student Life in China</h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of international students experiencing the rich culture, advanced technology, and world-class education system of China.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-[600px]">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
              <Image src="/images/gallery-3.jpg" alt="Student Life" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium">Campus Life</p>
              </div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="relative rounded-2xl overflow-hidden group">
              <Image src="/images/gallery-4.jpg" alt="Graduation" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="relative rounded-2xl overflow-hidden group">
              <Image src="/images/gallery-5.jpg" alt="Classroom" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden group">
              <Image src="/images/gallery-6.jpg" alt="Events" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium">Cultural Events</p>
              </div>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 py-16">
        <div className="container space-y-12">
          <FadeIn>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Why Choose CSA?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide comprehensive support to ensure your journey to China is hassle-free and successful.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Professional Team", desc: "Expert guidance from international and Chinese staff." },
              { icon: Clock, title: "Fast Processing", desc: "Expedited application handling and updates." },
              { icon: GraduationCap, title: "Direct Partnerships", desc: "Official representative of top Chinese universities." },
              { icon: Award, title: "Scholarship Experts", desc: "Maximize your chances of securing funding." },
            ].map((feature, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <HoverCard className="h-full">
                  <Card className="border-none shadow-md h-full">
                    <CardHeader>
                      <feature.icon className="h-10 w-10 text-brand-red mb-2" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </HoverCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Steps to Apply */}
      <section className="container space-y-12">
        <FadeIn>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Simple Steps to Apply</h2>
            <p className="text-muted-foreground">Your journey to China starts here.</p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Register", desc: "Create your account and complete your profile." },
            { step: "02", title: "Select Program", desc: "Browse universities and choose your desired course." },
            { step: "03", title: "Submit Documents", desc: "Upload transcripts, passport, and other required files." },
            { step: "04", title: "Get Admitted", desc: "Receive your admission letter and visa documents." },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
              className="relative flex flex-col items-center text-center space-y-4"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className="h-12 w-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xl cursor-default shadow-lg shadow-brand-blue/30"
              >
                {item.step}
              </motion.div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
              {i < 3 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-[2px] bg-muted -z-10" />
              )}
            </motion.div>
          ))}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.5}>
          <div className="flex justify-center">
            <Link href="/auth/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="gap-2 px-8 h-12 text-lg">
                  Start Your Application <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="container">
        <FadeIn>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-brand-blue rounded-3xl p-8 md:p-16 text-center text-white space-y-6 shadow-2xl shadow-brand-blue/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Study in China?</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Don&apos;t miss the opportunity to study at world-renowned universities with scholarship opportunities.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="text-brand-blue font-bold shadow-lg">
                  Apply Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </FadeIn>
      </section>
    </div>
  )
}
