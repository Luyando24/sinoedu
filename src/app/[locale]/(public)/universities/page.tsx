import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { SearchForm } from "@/components/programs/search-form"
import { Pagination } from "@/components/ui/pagination"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string }
}) {
  const query = searchParams?.query || ""
  const page = parseInt(searchParams?.page || "1", 10)
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  const supabase = createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  let hasPrivilegedAccess = false
  if (user) {
    // Secure RPC check
    const { data: role } = await supabase.rpc('get_my_role')
    hasPrivilegedAccess = role === 'admin' || role === 'agent'
  }// Fetch content blocks
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  // Fetch universities with optional search filtering and pagination
  let universitiesQuery = supabase
    .from('universities')
    .select('*, programs(count)', { count: 'exact' })
    .order('name')
    .range(from, to)

  if (query) {
    universitiesQuery = universitiesQuery.or(`name.ilike.%${query}%,location.ilike.%${query}%`)
  }

  const { data: universities, count } = await universitiesQuery
  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="container py-16 space-y-12 bg-slate-50 min-h-screen">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-[#0056b3]">{getContent(blocks, 'universities.header.title', "Partner Universities")}</h1>
        <p className="text-xl text-muted-foreground">
          {getContent(blocks, 'universities.header.desc', "Explore China's top institutions. We are official representatives for these prestigious universities.")}
        </p>
      </div>

      <div className="sticky top-[80px] z-40 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 py-4 -mx-4 px-4 border-b md:border-none">
        <div className="max-w-md mx-auto">
          <SearchForm />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities && universities.length > 0 ? (
          universities.map((uni) => (
            <Card key={uni.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col bg-white border-gray-200 group/card">
               {uni.image_url && (
                <div className="relative h-32 w-full overflow-hidden">
                  <Image 
                    src={uni.image_url} 
                    alt={hasPrivilegedAccess ? uni.name : "Partner University"}
                    fill
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
               )}
              <CardHeader className="p-3 pb-1 space-y-2">
                <div className="flex justify-between items-start gap-3">
                  {uni.logo_url && hasPrivilegedAccess ? (
                    <div className="relative h-8 w-8 flex-shrink-0">
                      <Image 
                        src={uni.logo_url} 
                        alt={`${uni.name} Logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : !uni.image_url && (
                    <div className="h-8 w-8 rounded bg-[#0056b3]/10 flex items-center justify-center flex-shrink-0">
                       <GraduationCap className="h-4 w-4 text-[#0056b3]" />
                    </div>
                  )}
                  <CardTitle className="text-base leading-tight text-[#0056b3] line-clamp-1 flex-1">
                      {hasPrivilegedAccess ? uni.name : "University in " + (uni.location || "China")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex-1 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="line-clamp-1">{uni.location || "China"}</span>
                </div>
                {uni.description && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
                    {uni.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                   {uni.ranking && <span className="text-[9px] bg-[#0056b3]/5 px-1.5 py-0.5 rounded text-[#0056b3] font-bold border border-[#0056b3]/10 uppercase">{uni.ranking}</span>}
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-2 border-t bg-slate-50/50 flex justify-between items-center mt-auto gap-3">
                 <div className="flex items-baseline gap-1.5">
                   <span className="text-[10px] text-muted-foreground font-medium uppercase">Programs:</span>
                   <span className="text-sm font-bold text-[#0056b3]">
                     {uni.programs?.[0]?.count || 0}
                   </span>
                 </div>
                 <Link href={`/universities/${uni.id}`}>
                    <Button size="sm" className="h-8 px-3 text-[11px] bg-[#0056b3] hover:bg-[#0056b3]/90 rounded-md shadow-sm">
                      Details <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/card:translate-x-1" />
                    </Button>
                  </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-[#0056b3]">No universities found</h3>
            <p className="text-muted-foreground mt-2">Check back later for updates.</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        baseUrl="/universities"
        searchParams={searchParams}
      />
    </div>
  )
}
