"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HeroSearchFormProps {
  className?: string
  enableAnimation?: boolean
  variant?: "hero" | "plain"
}

export function HeroSearchForm({ className, enableAnimation = true, variant = "hero" }: HeroSearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    city: "",
    degree: "",
    language: "",
    duration: "",
    scholarship: "",
    query: "",
    intake: ""
  })

  useEffect(() => {
    if (searchParams) {
      setFormData({
        city: searchParams.get("city") || "",
        degree: searchParams.get("level") || "",
        language: searchParams.get("language") || "",
        duration: searchParams.get("duration") || "",
        scholarship: searchParams.get("scholarship") || "",
        query: searchParams.get("query") || "",
        intake: searchParams.get("intake") || ""
      })
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (formData.city) params.append("city", formData.city)
    if (formData.degree) params.append("level", formData.degree) // mapping degree to level
    if (formData.language) params.append("language", formData.language)
    if (formData.duration) params.append("duration", formData.duration)
    if (formData.scholarship) params.append("scholarship", formData.scholarship)
    if (formData.query) params.append("query", formData.query)
    if (formData.intake) params.append("intake", formData.intake)
    
    router.push(`/programs?${params.toString()}`)
  }

  const containerClasses = cn(
    "w-full max-w-5xl mx-auto p-4 rounded-2xl shadow-xl",
    variant === "hero" 
      ? "mt-12 bg-white/10 backdrop-blur-md border border-white/20" 
      : "bg-white border border-gray-200 shadow-sm",
    className
  )

  const inputClasses = "w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-[#0056b3] text-gray-700 font-medium appearance-none cursor-pointer placeholder:text-gray-500 focus:outline-none"

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Select */}
        <div className="relative">
          <select 
            name="city"
            className={inputClasses}
            value={formData.city}
            onChange={handleChange}
          >
            <option value="" disabled>Select City</option>
            <option value="Beijing">Beijing</option>
            <option value="Shanghai">Shanghai</option>
            <option value="Guangzhou">Guangzhou</option>
            <option value="Wuhan">Wuhan</option>
            <option value="Chengdu">Chengdu</option>
            <option value="Hangzhou">Hangzhou</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Degree Select */}
        <div className="relative">
          <select 
            name="degree"
            className={inputClasses}
            value={formData.degree}
            onChange={handleChange}
          >
            <option value="" disabled>Select Degree</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="Doctor">Doctor</option>
            <option value="Camp">Camp</option>
            <option value="Long-term Language">Long-term Language</option>
            <option value="College">College</option>
            <option value="High School">High School</option>
            <option value="Top-up program">Top-up program</option>
            <option value="Secondary Vocational Education">Secondary Vocational Education</option>
            <option value="Masters">Masters (Legacy)</option>
            <option value="PhD">PhD (Legacy)</option>
            <option value="Language">Language Program (Legacy)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Teaching Language Select */}
        <div className="relative">
          <select 
            name="language"
            className={inputClasses}
            value={formData.language}
            onChange={handleChange}
          >
            <option value="" disabled>Teaching Language</option>
            <option value="English">English</option>
            <option value="Chinese">Chinese</option>
            <option value="Bilingual">Bilingual</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Duration Select */}
        <div className="relative">
          <select 
            name="duration"
            className={inputClasses}
            value={formData.duration}
            onChange={handleChange}
          >
            <option value="" disabled>Select Duration</option>
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="4">4 Years</option>
            <option value="5">5+ Years</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Scholarship Select */}
        <div className="relative">
          <select 
            name="scholarship"
            className={inputClasses}
            value={formData.scholarship}
            onChange={handleChange}
          >
            <option value="" disabled>Select Scholarship</option>
            <option value="full">Full Scholarship</option>
            <option value="partial">Partial Scholarship</option>
            <option value="self-funded">Self-Funded</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="relative">
           <input 
              type="text" 
              name="query"
              placeholder="Search Programs" 
              className={inputClasses}
              value={formData.query}
              onChange={handleChange}
           />
        </div>

        {/* Intake Select */}
        <div className="relative">
          <select 
            name="intake"
            className={inputClasses}
            value={formData.intake}
            onChange={handleChange}
          >
            <option value="" disabled>Select Intake</option>
            <option value="March">March Intake</option>
            <option value="September">September Intake</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        <Button className="h-12 w-full bg-[#1a3a3a] hover:bg-[#1a3a3a]/90 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg">
           <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>
  )

  if (enableAnimation) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className={containerClasses}
      >
        <FormContent />
      </motion.div>
    )
  }

  return (
    <div className={containerClasses}>
      <FormContent />
    </div>
  )
}
