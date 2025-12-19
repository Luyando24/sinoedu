import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, MapPin, GraduationCap } from "lucide-react"

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
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
  }
}) {
  const query = searchParams?.query || ""
  const city = searchParams?.city || ""
  const level = searchParams?.level || ""
  const language = searchParams?.language || ""
  const duration = searchParams?.duration || ""
  const intake = searchParams?.intake || ""
  const scholarship = searchParams?.scholarship || ""

  const supabase = createClient()
  
  // Fetch content blocks
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  let queryBuilder = supabase.from('programs').select('*, universities(name)')
  
  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`)
  }
  if (city) {
    queryBuilder = queryBuilder.ilike('location', `%${city}%`)
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
    // Simple keyword search in scholarship details
    queryBuilder = queryBuilder.ilike('scholarship_details', `%${scholarship}%`)
  }

  const { data: programs } = await queryBuilder

  return (
    <div className="container py-16 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">{getContent(blocks, 'programs.header.title', "Academic Programs")}</h1>
          <p className="text-xl text-muted-foreground">
            {getContent(blocks, 'programs.header.desc', "Curated opportunities for international students. Find your perfect match.")}
          </p>
        </div>
        <div className="w-full md:w-auto">
          {/* We might want to replace this with the HeroSearchForm or keep a smaller local one */}
          {/* For now, keeping the smaller one but it might not have all fields. */}
          {/* <SearchForm /> */}
        </div>
      </div>

      <div className="space-y-6">
        {programs && programs.length > 0 ? (
          programs.map((program) => (
            <div key={program.id} className="group bg-card hover:bg-muted/30 border rounded-2xl p-6 transition-all hover:shadow-md flex flex-col md:flex-row gap-6">
               <div className="flex-1 space-y-4">
                 <div className="flex items-start justify-between">
                   <div>
                     <div className="flex gap-2 mb-2">
                        <Badge variant="secondary">{program.level}</Badge>
                        {program.language && <Badge variant="outline">{program.language}</Badge>}
                     </div>
                     <h3 className="text-2xl font-bold group-hover:text-brand-red transition-colors">{program.title}</h3>
                     <div className="flex items-center gap-2 text-muted-foreground mt-1">
                       <MapPin className="h-4 w-4" />
                       <span className="font-medium">{program.universities?.name || "University"}</span>
                       {program.location && <span>• {program.location}</span>}
                     </div>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Clock className="h-4 w-4" />
                     {program.duration || "N/A"}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <DollarSign className="h-4 w-4" />
                     {program.tuition_fee || "N/A"}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Calendar className="h-4 w-4" />
                     {program.intake || "N/A"}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <GraduationCap className="h-4 w-4" />
                     {program.scholarship_details ? "Scholarship" : "Self-funded"}
                   </div>
                 </div>
               </div>
               
               <div className="flex flex-col justify-center min-w-[150px]">
                 <Link href={`/programs/${program.id}`}>
                   <Button className="w-full">View Details</Button>
                 </Link>
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl">
            <h3 className="text-xl font-semibold">No programs found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
