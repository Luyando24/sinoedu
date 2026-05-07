import { createClient } from "@/lib/supabase/server"
export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, MapPin, GraduationCap } from "lucide-react"
import { HeroSearchForm } from "@/components/HeroSearchForm"
import { normalizeSearchQuery, safeTrim } from "@/lib/string-utils"
import { Pagination } from "@/components/ui/pagination"

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

const getTuitionFee = (program: { tuition_fee?: string | null; fee_structure?: Record<string, unknown> | string | null }) => {
  if (program.tuition_fee) return program.tuition_fee
  let fees = program.fee_structure
  if (typeof fees === 'string') {
    try {
      fees = JSON.parse(fees)
    } catch {
      fees = {}
    }
  }
  if (fees && typeof fees === 'object' && !Array.isArray(fees)) {
    const keys = Object.keys(fees)
    const tuitionKey = keys.find(k => {
      const kl = k.toLowerCase()
      return kl.includes('tuition') || kl.includes('tution')
    })
    if (tuitionKey) return (fees as Record<string, string>)[tuitionKey]
  }
  return "N/A"
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    city?: string
    level?: string
    language?: string
    duration?: string
    intake?: string
    scholarship?: string
    page?: string
  }
}) {
  const query = normalizeSearchQuery(searchParams?.query)
  const city = safeTrim(searchParams?.city)
  const level = safeTrim(searchParams?.level)
  const language = safeTrim(searchParams?.language)
  const duration = safeTrim(searchParams?.duration)
  const intake = safeTrim(searchParams?.intake)
  const scholarship = safeTrim(searchParams?.scholarship)

  const supabase = createClient()

  // Check if user is admin or agent
  const { data: { user } } = await supabase.auth.getUser()
  let hasPrivilegedAccess = false
  if (user) {
    const { data: role } = await supabase.rpc('get_my_role')
    hasPrivilegedAccess = role === 'admin' || role === 'agent'
  }

  // Fetch content blocks
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  // Fetch active intakes
  const { data: intakeData } = await supabase
    .from('intake_periods')
    .select('name')
    .eq('is_active', true)
    .order('name')

  const intakes = intakeData?.map(i => ({ id: i.name, name: i.name })) || []

  // Fetch active scholarships
  const { data: scholarshipData } = await supabase
    .from('scholarships')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  const scholarships = scholarshipData || []

  // Fetch active durations
  const { data: durationData } = await supabase
    .from('program_durations')
    .select('id, name, value')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const durations = durationData || []

  let queryBuilder = supabase
    .from('programs')
    .select('*, universities(name, location), scholarships(name)', { count: 'exact' })
    .eq('is_active', true)

  if (query) {
    const escaped = query.replaceAll(",", "\\,")
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(query)

    queryBuilder = queryBuilder.or(
      isUuid
        ? `id.eq.${escaped},title.ilike.%${escaped}%,program_id_code.ilike.%${escaped}%`
        : `title.ilike.%${escaped}%,program_id_code.ilike.%${escaped}%`
    )
  }
  if (city) {
    const { data: matchedUnis } = await supabase
      .from('universities')
      .select('id')
      .ilike('location', city) // Exact case-insensitive match
    
    const uniIds = (matchedUnis || []).map(u => u.id)
    
    if (uniIds.length > 0) {
      // Search in programs.location OR university_id matching the found unis
      // Changed to exact matching (ilike without wildcards)
      queryBuilder = queryBuilder.or(`location.ilike.${city},university_id.in.(${uniIds.join(',')})`)
    } else {
      // Just search programs.location if no university matches
      queryBuilder = queryBuilder.ilike('location', city)
    }
  }
  if (level) {
    queryBuilder = queryBuilder.eq('level', level)
  }
  if (language) {
    queryBuilder = queryBuilder.ilike('language', `%${language}%`)
  }
  if (duration) {
    queryBuilder = queryBuilder.ilike('duration', `%${duration}%`)
  }
  if (intake) {
    queryBuilder = queryBuilder.ilike('intake', `%${intake}%`)
  }
  if (scholarship) {
    if (scholarship === 'any') {
      queryBuilder = queryBuilder.not('scholarship_id', 'is', null)
    } else if (scholarship === 'none') {
      queryBuilder = queryBuilder.is('scholarship_id', null)
    } else if (scholarship.length === 36) { // Likely a UUID
      queryBuilder = queryBuilder.eq('scholarship_id', scholarship)
    } else {
      // Fallback for keyword search
      queryBuilder = queryBuilder.ilike('scholarship_details', `%${scholarship}%`)
    }
  }

  const page = parseInt(searchParams?.page || "1", 10)
  const limit = 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: programs, count } = await queryBuilder
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="container py-16 space-y-12 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-[#0056b3]">{getContent(blocks, 'programs.header.title', "Academic Programs")}</h1>
          <p className="text-xl text-muted-foreground">
            {getContent(blocks, 'programs.header.desc', "Curated opportunities for international students. Find your perfect match.")}
          </p>
        </div>
        <div className="w-full md:w-auto">
        </div>
      </div>

      <HeroSearchForm 
        variant="plain" 
        enableAnimation={false} 
        initialIntakes={intakes} 
        initialScholarships={scholarships} 
        initialDurations={durations}
      />

      <div className="space-y-6">
        {programs && programs.length > 0 ? (
          programs.map((program) => (
            <div key={program.id} className="group bg-white hover:bg-white border border-gray-200 rounded-2xl p-6 transition-all hover:shadow-lg flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary" className="bg-slate-100 text-[#0056b3] hover:bg-slate-200">{program.level}</Badge>
                      {program.language && <Badge variant="outline" className="border-[#0056b3]/20 text-[#0056b3]">{program.language}</Badge>}
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-[#0056b3] transition-colors">{program.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {hasPrivilegedAccess
                          ? (program.universities?.name || "University")
                          : `University in ${program.universities?.location || program.location || 'China'}`}
                      </span>
                      {program.location && <span>• {program.location}</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-[#0056b3]" />
                    {program.duration || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-[#0056b3]" />
                    {getTuitionFee(program)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-[#0056b3]" />
                    {program.intake || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-[#0056b3]" />
                    <span className={program.scholarships?.name ? "text-[#0056b3] font-medium" : ""}>
                      {program.scholarships?.name || "Self-funded"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center min-w-[150px]">
                <Link href={`/programs/${program.id}`}>
                  <Button className="w-full bg-[#0056b3] hover:bg-[#0056b3]/90">View Details</Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-[#0056b3]">No programs found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        baseUrl="/programs"
        searchParams={searchParams}
      />
    </div>
  )
}
