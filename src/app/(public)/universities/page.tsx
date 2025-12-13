import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function UniversitiesPage() {
  const supabase = createClient()
  
  // Fetch universities directly
  const { data: universities } = await supabase
    .from('universities')
    .select('*, programs(count)')
    .order('name')

  return (
    <div className="container py-16 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Partner Universities</h1>
        <p className="text-xl text-muted-foreground">
          Explore China's top institutions. We are official representatives for these prestigious universities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {universities && universities.length > 0 ? (
          universities.map((uni) => (
            <Card key={uni.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
               {uni.image_url && (
                <div className="relative h-48 w-full">
                  <Image 
                    src={uni.image_url} 
                    alt={uni.name}
                    fill
                    className="object-cover"
                  />
                </div>
               )}
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                  {!uni.image_url && (
                    <div className="h-12 w-12 rounded-lg bg-brand-red/10 flex items-center justify-center">
                       <GraduationCap className="h-6 w-6 text-brand-red" />
                    </div>
                  )}
                  {uni.logo_url && (
                    <div className="relative h-12 w-12">
                      <Image 
                        src={uni.logo_url} 
                        alt={`${uni.name} Logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{uni.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{uni.location || "China"}</span>
                </div>
                {uni.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {uni.description}
                  </p>
                )}
                <div className="flex gap-2">
                   {uni.ranking && <span className="text-xs bg-muted px-2 py-1 rounded">{uni.ranking}</span>}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between items-center">
                   <span className="text-sm text-muted-foreground font-medium">
                     {uni.programs?.[0]?.count || 0} Programs
                   </span>
                   <Link href={`/programs?query=${encodeURIComponent(uni.name)}`}>
                    <Button variant="ghost" size="sm" className="group">
                      View Programs <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl">
            <h3 className="text-xl font-semibold">No universities found</h3>
            <p className="text-muted-foreground mt-2">Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  )
}
