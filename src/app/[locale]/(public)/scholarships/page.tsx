import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Award, MapPin, Trophy, GraduationCap, Globe, Briefcase } from "lucide-react"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function ScholarshipsPage() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0056b3] py-20 text-white">
        <div className="container text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {getContent(blocks, 'scholarships.hero.title', "Scholarship Opportunities")}
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">
            {getContent(blocks, 'scholarships.hero.desc', "Fund your studies in China with fully funded and partial scholarships available for international students.")}
          </p>
        </div>
      </section>

      <div className="container py-16 space-y-24">
        {/* Chinese Government Scholarship */}
        <div id="csc" className="scroll-mt-24">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
               <div className="bg-[#1e5aa0] p-12 text-white flex flex-col justify-center">
                 <div className="h-16 w-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-6">
                   <Award className="h-8 w-8" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">Chinese Government Scholarship</h2>
                 <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                   The most prestigious scholarship established by the Ministry of Education of China to support international students, teachers, and scholars.
                 </p>
                 <Link href="/contact">
                   <Button className="bg-white text-[#1e5aa0] hover:bg-blue-50 w-fit">
                     Check Eligibility
                   </Button>
                 </Link>
               </div>
               <div className="p-12 space-y-8">
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Coverage & Benefits</h3>
                   <ul className="space-y-3">
                     {[
                       "Full tuition waiver",
                       "Free on-campus accommodation",
                       "Monthly stipend (Undergrad: 2500 RMB, Master: 3000 RMB, PhD: 3500 RMB)",
                       "Comprehensive Medical Insurance"
                     ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3">
                         <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                         <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Available Programs</h3>
                   <div className="flex flex-wrap gap-2">
                     {["Undergraduate", "Master's", "PhD", "General Scholar", "Senior Scholar"].map((tag, i) => (
                       <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                         {tag}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Local Government Scholarship */}
        <div id="local" className="scroll-mt-24">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
               <div className="md:order-2 bg-[#2d74c4] p-12 text-white flex flex-col justify-center">
                 <div className="h-16 w-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-6">
                   <MapPin className="h-8 w-8" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">Local Government Scholarship</h2>
                 <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                   Scholarships funded by provincial and municipal governments to attract international students to local universities.
                 </p>
                 <Link href="/contact">
                   <Button className="bg-white text-[#2d74c4] hover:bg-blue-50 w-fit">
                     Apply Now
                   </Button>
                 </Link>
               </div>
               <div className="md:order-1 p-12 space-y-8">
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Coverage & Benefits</h3>
                   <ul className="space-y-3">
                     {[
                       "Partial or full tuition waiver",
                       "Living allowance (varies by city)",
                       "Accommodation subsidy",
                       "Duration: Usually 1 academic year (renewable)"
                     ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3">
                         <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                         <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Popular Provinces</h3>
                   <div className="flex flex-wrap gap-2">
                     {["Beijing", "Shanghai", "Jiangsu", "Zhejiang", "Guangdong", "Hubei"].map((tag, i) => (
                       <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                         {tag}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* University Scholarship */}
        <div id="university" className="scroll-mt-24">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
               <div className="bg-[#1e5aa0] p-12 text-white flex flex-col justify-center">
                 <div className="h-16 w-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-6">
                   <Trophy className="h-8 w-8" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">University Scholarship</h2>
                 <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                   Scholarships offered directly by Chinese universities to attract excellent international students for degree programs.
                 </p>
                 <Link href="/contact">
                   <Button className="bg-white text-[#1e5aa0] hover:bg-blue-50 w-fit">
                     Check Eligibility
                   </Button>
                 </Link>
               </div>
               <div className="p-12 space-y-8">
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Coverage & Benefits</h3>
                   <ul className="space-y-3">
                     {[
                       "Full or partial tuition waiver",
                       "Free on-campus accommodation (for some)",
                       "Monthly stipend (based on academic performance)",
                       "Duration: Covers the study period"
                     ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3">
                         <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                         <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Participating Universities</h3>
                   <div className="flex flex-wrap gap-2">
                     {["Zhejiang University", "Wuhan University", "Xiamen University", "Harbin Institute of Technology"].map((tag, i) => (
                       <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                         {tag}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* International Chinese Language Teachers Scholarship */}
        <div id="teachers" className="scroll-mt-24">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
               <div className="md:order-2 bg-[#2d74c4] p-12 text-white flex flex-col justify-center">
                 <div className="h-16 w-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-6">
                   <GraduationCap className="h-8 w-8" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">International Chinese Language Teachers Scholarship</h2>
                 <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                   Dedicated to supporting students, scholars, and Chinese language teachers worldwide to study Chinese language and culture.
                 </p>
                 <Link href="/contact">
                   <Button className="bg-white text-[#2d74c4] hover:bg-blue-50 w-fit">
                     Apply Now
                   </Button>
                 </Link>
               </div>
               <div className="md:order-1 p-12 space-y-8">
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Coverage & Benefits</h3>
                   <ul className="space-y-3">
                     {[
                       "Full tuition waiver",
                       "Free accommodation",
                       "Living allowance",
                       "Comprehensive Medical Insurance"
                     ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3">
                         <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                         <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Programs</h3>
                   <div className="flex flex-wrap gap-2">
                     {["PhD in Chinese", "Master's in Chinese", "Bachelor's in Chinese", "One-Year Study", "One-Semester Study"].map((tag, i) => (
                       <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                         {tag}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Silk Road Scholarship */}
        <div id="silk" className="scroll-mt-24">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
               <div className="bg-[#1e5aa0] p-12 text-white flex flex-col justify-center">
                 <div className="h-16 w-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-6">
                   <Globe className="h-8 w-8" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">Silk Road Scholarship</h2>
                 <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                   Designed for students from &quot;Belt and Road&quot; initiative countries to foster talent and cultural exchange.
                 </p>
                 <Link href="/contact">
                   <Button className="bg-white text-[#1e5aa0] hover:bg-blue-50 w-fit">
                     Check Eligibility
                   </Button>
                 </Link>
               </div>
               <div className="p-12 space-y-8">
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Coverage & Benefits</h3>
                   <ul className="space-y-3">
                     {[
                       "Full or partial tuition waiver",
                       "Accommodation subsidy",
                       "Stipend for living expenses",
                       "Priority for specific majors"
                     ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3">
                         <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                         <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Target Countries</h3>
                   <div className="flex flex-wrap gap-2">
                     {["Southeast Asia", "Central Asia", "Middle East", "Eastern Europe", "Africa"].map((tag, i) => (
                       <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                         {tag}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Enterprise Scholarship */}
        <div id="enterprise" className="scroll-mt-24">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
               <div className="md:order-2 bg-[#2d74c4] p-12 text-white flex flex-col justify-center">
                 <div className="h-16 w-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-6">
                   <Briefcase className="h-8 w-8" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4">Enterprise Scholarship</h2>
                 <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                   Sponsored by leading Chinese companies to cultivate future employees with international backgrounds.
                 </p>
                 <Link href="/contact">
                   <Button className="bg-white text-[#2d74c4] hover:bg-blue-50 w-fit">
                     Apply Now
                   </Button>
                 </Link>
               </div>
               <div className="md:order-1 p-12 space-y-8">
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Coverage & Benefits</h3>
                   <ul className="space-y-3">
                     {[
                       "Full tuition support",
                       "Internship opportunities",
                       "Job offer upon graduation",
                       "Mentorship from industry professionals"
                     ].map((item, i) => (
                       <li key={i} className="flex items-start gap-3">
                         <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                         <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-[#0056b3] mb-4">Partner Industries</h3>
                   <div className="flex flex-wrap gap-2">
                     {["Technology", "Engineering", "E-commerce", "Construction", "Logistics"].map((tag, i) => (
                       <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                         {tag}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
