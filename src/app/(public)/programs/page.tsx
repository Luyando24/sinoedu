import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SearchForm } from "@/components/programs/search-form"

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
  }
}) {
  const query = searchParams?.query || ""
  const supabase = createClient()
  
  let queryBuilder = supabase.from('programs').select('*')
  
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,school_name.ilike.%${query}%`)
  }

  const { data: programs } = await queryBuilder

  return (
    <div className="container py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Available Programs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our wide range of programs and scholarships.
        </p>
        <div className="pt-4">
          <SearchForm />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs && programs.length > 0 ? (
          programs.map((program) => (
            <Card key={program.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{program.title}</CardTitle>
                <CardDescription>{program.school_name}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Level:</span> {program.level}</p>
                  <p><span className="font-semibold">Duration:</span> {program.duration}</p>
                  <p><span className="font-semibold">Tuition:</span> {program.tuition_fee}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/auth/register?program=${program.id}`} className="w-full">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No programs available at the moment. Please check back later.
          </div>
        )}
      </div>
    </div>
  )
}
