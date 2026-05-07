"use client"

import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { normalizeSearchQuery, safeTrim } from "@/lib/string-utils"

interface HeroSearchFormProps {
  className?: string
  enableAnimation?: boolean
  variant?: "hero" | "plain"
  initialIntakes?: { id: string, name: string }[]
  initialScholarships?: { id: string, name: string }[]
  initialDurations?: { id: string, name: string, value: string }[]
}

export function HeroSearchForm({
  className,
  enableAnimation = true,
  variant = "hero",
  initialIntakes = [],
  initialScholarships = [],
  initialDurations = []
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
  const [activeDurations, setActiveDurations] = useState<{ id: string, name: string, value: string }[]>(initialDurations)
  const [cities, setCities] = useState<string[]>([])
  const [citySearch, setCitySearch] = useState("")
  const [isCityOpen, setIsCityOpen] = useState(false)
  const [isCitiesLoading, setIsCitiesLoading] = useState(false)
  const [activeDegreeTypes, setActiveDegreeTypes] = useState<{ id: string, name: string }[]>([])

  useEffect(() => {
    const fetchCities = async () => {
      setIsCitiesLoading(true)
      try {
        const supabase = createClient()
        
        // Fetch locations from both tables
        const [progRes, uniRes] = await Promise.all([
          supabase.from('programs').select('location').not('location', 'is', null),
          supabase.from('universities').select('location').not('location', 'is', null)
        ])
        
        const allLocations = [
          ...(progRes.data || []).map(p => p.location),
          ...(uniRes.data || []).map(u => u.location)
        ]

        // Unique cities and filter out duplicates efficiently
        const uniqueCities = Array.from(new Set(allLocations))
          .filter(Boolean)
          .sort() as string[]
        
        setCities(uniqueCities)
      } catch (err) {
        console.error("Error fetching cities:", err)
      } finally {
        setIsCitiesLoading(false)
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
    
    // Only fetch if initialDurations were not provided
    if (initialDurations.length === 0) {
      const fetchDurations = async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from('program_durations')
          .select('id, name, value')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (data) {
          setActiveDurations(data)
        }
      }
      fetchDurations()
    }

    // Fetch active degree types
    const fetchDegreeTypes = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('program_levels')
        .select('name')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) {
        setActiveDegreeTypes(data.map((d: { name: string }) => ({ id: d.name, name: d.name })))
      }
    }
    fetchDegreeTypes()
  }, [initialIntakes, initialScholarships])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const clearField = (name: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [name]: "" }))
    if (name === "city") setCitySearch("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    const cityClean = safeTrim(formData.city)
    const degreeClean = safeTrim(formData.degree)
    const languageClean = safeTrim(formData.language)
    const durationClean = safeTrim(formData.duration)
    const scholarshipClean = safeTrim(formData.scholarship)
    const queryClean = normalizeSearchQuery(formData.query)
    const intakeClean = safeTrim(formData.intake)

    if (cityClean) params.append("city", cityClean)
    if (degreeClean) params.append("level", degreeClean)
    if (languageClean) params.append("language", languageClean)
    if (durationClean) params.append("duration", durationClean)
    if (scholarshipClean) params.append("scholarship", scholarshipClean)
    if (queryClean) params.append("query", queryClean)
    if (intakeClean) params.append("intake", intakeClean)

    router.push(`/programs?${params.toString()}`)
  }

  const containerClasses = cn(
    "w-full max-w-5xl mx-auto p-4 rounded-2xl shadow-xl",
    variant === "hero"
      ? "mt-12 bg-white/10 backdrop-blur-md border border-white/20"
      : "bg-white border border-gray-200 shadow-sm",
    className
  )

  const inputClasses = "w-full h-12 px-4 pr-10 rounded-lg bg-white/90 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0056b3] text-gray-700 font-medium appearance-none cursor-pointer placeholder:text-gray-500 focus:outline-none transition-all"

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
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
            {formData.city && (
              <button
                type="button"
                onClick={() => clearField("city")}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="pointer-events-none text-gray-500">
              <svg className={cn("w-4 h-4 fill-current transition-transform", isCityOpen ? "rotate-180" : "")} viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        {isCityOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {isCitiesLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Loading cities...</div>
            ) : (() => {
              const filteredCities = cities.filter(city => 
                city.toLowerCase().includes(citySearch.toLowerCase())
              );
              
              if (filteredCities.length > 0) {
                return filteredCities.map((city, idx) => (
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
                ));
              }
              
              return (
                <div className="px-4 py-3 text-sm text-gray-500 italic">
                  No cities found
                </div>
              );
            })()}
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
          <option value="">All Degrees</option>
          {activeDegreeTypes.map((degree) => (
            <option key={degree.id} value={degree.id}>{degree.name}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {formData.degree && (
            <button
              type="button"
              onClick={() => clearField("degree")}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
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
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Chinese">Chinese</option>
          <option value="Bilingual">Bilingual</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {formData.language && (
            <button
              type="button"
              onClick={() => clearField("language")}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
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
          <option value="">All Durations</option>
          {activeDurations.map((d) => (
            <option key={d.id} value={d.value}>{d.name}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {formData.duration && (
            <button
              type="button"
              onClick={() => clearField("duration")}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
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
          <option value="">All Scholarships</option>
          <option value="any">Any Scholarship</option>
          {activeScholarships.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
          <option value="none">Self-Funded</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {formData.scholarship && (
            <button
              type="button"
              onClick={() => clearField("scholarship")}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
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
          <option value="">All Intakes</option>
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {formData.intake && (
            <button
              type="button"
              onClick={() => clearField("intake")}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
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
