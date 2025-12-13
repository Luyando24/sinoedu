import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, MapPin, GraduationCap } from "lucide-react"

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
          <h1 className="text-4xl font-bold tracking-tight">Academic Programs</h1>
          <p className="text-xl text-muted-foreground">
            Curated opportunities for international students. Find your perfect match.
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
                     {program.intake || "Spring/Fall"}
                   </div>
                   {program.application_deadline && (
                      <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                        <GraduationCap className="h-4 w-4" />
                        Deadline: {program.application_deadline}
                      </div>
                   )}
                 </div>
               </div>

               <div className="flex flex-col justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                 <Link href={`/auth/register?program=${program.id}`} className="w-full">
                   <Button size="lg" className="w-full font-bold">Apply Now</Button>
                 </Link>
                 {/* Ideally this would link to a details page, e.g. /programs/[id] */}
                 <Button variant="outline" className="w-full">View Details</Button>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl space-y-4">
            <h3 className="text-xl font-semibold">No programs found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or browse all programs.</p>
            <Link href="/programs">
                <Button variant="link">Clear Filters</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
