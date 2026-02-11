"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface HeroSearchFormProps {
  className?: string
  enableAnimation?: boolean
  variant?: "hero" | "plain"
  initialIntakes?: { id: string, name: string }[]
  initialScholarships?: { id: string, name: string }[]
}

export function HeroSearchForm({
  className,
  enableAnimation = true,
  variant = "hero",
  initialIntakes = [],
  initialScholarships = []
}: HeroSearchFormProps) {
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
  const [activeIntakes, setActiveIntakes] = useState<{ id: string, name: string }[]>(initialIntakes)
  const [activeScholarships, setActiveScholarships] = useState<{ id: string, name: string }[]>(initialScholarships)
  const [cities, setCities] = useState<string[]>([])
  const [citySearch, setCitySearch] = useState("")
  const [isCityOpen, setIsCityOpen] = useState(false)

  useEffect(() => {
    const fetchCities = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('programs')
        .select('location')
        .not('location', 'is', null)
        .order('location')

      if (data) {
        // Safe data loading: unique cities and limit processing if needed
        const uniqueCities = Array.from(new Set(data.map(p => p.location))).filter(Boolean) as string[]
        setCities(uniqueCities)
      }
    }
    fetchCities()
  }, [])

  useEffect(() => {
    if (searchParams) {
      const city = searchParams.get("city") || ""
      setFormData({
        city: city,
        degree: searchParams.get("level") || "",
        language: searchParams.get("language") || "",
        duration: searchParams.get("duration") || "",
        scholarship: searchParams.get("scholarship") || "",
        query: searchParams.get("query") || "",
        intake: searchParams.get("intake") || ""
      })
      if (city) setCitySearch(city)
    }
  }, [searchParams])

  useEffect(() => {
    // Only fetch if initialIntakes were not provided
    if (initialIntakes.length === 0) {
      const fetchIntakes = async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from('intake_periods')
          .select('name')
          .eq('is_active', true)
          .order('name')

        if (data) {
          setActiveIntakes(data.map((i: { name: string }) => ({ id: i.name, name: i.name })))
        }
      }
      fetchIntakes()
    }
    
    // Only fetch if initialScholarships were not provided
    if (initialScholarships.length === 0) {
      const fetchScholarships = async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from('scholarships')
          .select('id, name')
          .eq('is_active', true)
          .order('name')

        if (data) {
          setActiveScholarships(data)
        }
      }
      fetchScholarships()
    }
  }, [initialIntakes, initialScholarships])

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

  const inputClasses = "w-full h-12 px-4 rounded-lg bg-white/90 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0056b3] text-gray-700 font-medium appearance-none cursor-pointer placeholder:text-gray-500 focus:outline-none transition-all"

  const formContent = (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search Input - Moved to top for better UX */}
      <div className="relative lg:col-span-2">
        <input
          type="text"
          name="query"
          placeholder="Search by keywords (e.g. Computer Science)"
          className={inputClasses}
          value={formData.query}
          onChange={handleChange}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* City Search Dropdown */}
      <div className="relative group">
        <div className="relative">
          <input
            type="text"
            className={cn(inputClasses, "pr-10")}
            placeholder="Select or Search City"
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value)
              setIsCityOpen(true)
              if (e.target.value === "") {
                setFormData(prev => ({ ...prev, city: "" }))
              }
            }}
            onFocus={() => setIsCityOpen(true)}
            onBlur={() => {
              // Delay closing to allow clicking on an option
              setTimeout(() => setIsCityOpen(false), 200)
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className={cn("w-4 h-4 fill-current transition-transform", isCityOpen ? "rotate-180" : "")} viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {isCityOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {cities
              .filter(city => city.toLowerCase().includes(citySearch.toLowerCase()))
              .length > 0 ? (
                cities
                  .filter(city => city.toLowerCase().includes(citySearch.toLowerCase()))
                  .map((city, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors text-gray-700 font-medium border-b border-gray-50 last:border-0"
                      onClick={() => {
                        setCitySearch(city)
                        setFormData(prev => ({ ...prev, city: city }))
                        setIsCityOpen(false)
                      }}
                    >
                      {city}
                    </button>
                  ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 italic">
                  No cities found
                </div>
              )}
          </div>
        )}
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
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>
          <option value="Language">Language Program</option>
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
          <option value="any">Any Scholarship</option>
          {activeScholarships.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
          <option value="none">Self-Funded</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </div>
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
          {activeIntakes.length > 0 ? (
            activeIntakes.map((intake) => (
              <option key={intake.id} value={intake.name}>{intake.name} Intake</option>
            ))
          ) : (
            <>
              <option value="March">March Intake</option>
              <option value="September">September Intake</option>
            </>
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
          </svg>
        </div>
      </div>

      <Button className="h-12 w-full bg-[#0056b3] hover:bg-[#0056b3]/90 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg">
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
        {formContent}
      </motion.div>
    )
  }

  return (
    <div className={containerClasses}>
      {formContent}
    </div>
  )
}
