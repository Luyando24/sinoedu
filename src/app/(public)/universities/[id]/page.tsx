import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { 
  MapPin, 
  CalendarDays, 
  Globe, 
  GraduationCap, 
  ArrowLeft,
  School,
  Trophy,
  Users
} from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function UniversityDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: role } = await supabase.rpc('get_my_role')
    isAdmin = role === 'admin'
  }

  // Fetch university with programs
  const { data: university } = await supabase
    .from('universities')
    .select('*, programs(*)')
    .eq('id', params.id)
    .single()

  if (!university) notFound()

  // Filter out private fields if not admin (though university details are generally public)
  // We apply the "Hide Name" rule here too if strictly required, but usually details page shows name.
  // Based on user request "Hide university names from normal users on the frontend other than admin",
  // we should probably hide it here too or redirect if they shouldn't see details at all.
  // However, usually "details page" implies they want to see details. 
  // Let's assume the name hiding is for the list view to encourage sign-up/contact, 
  // but if they get to the details page (e.g. via direct link), we should probably respect the rule.
  
  const displayName = isAdmin ? university.name : `University in ${university.location || 'China'}`

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/universities">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Universities
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-white shadow-sm">
          {university.image_url ? (
            <Image
              src={university.image_url}
              alt={isAdmin ? university.name : "University Campus"}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/50">
              <School className="h-24 w-24 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-8 text-white w-full">
              <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {university.ranking && (
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                        <Trophy className="mr-1 h-3 w-3" /> {university.ranking}
                      </Badge>
                    )}
                    {university.location && (
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
                        <MapPin className="mr-1 h-3 w-3" /> {university.location}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold">{displayName}</h1>
                  {university.established_year && (
                      <p className="text-white/80 flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" /> Established {university.established_year}
                      </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                {isAdmin && university.website_url && (
                    <a href={university.website_url} target="_blank" rel="noreferrer">
                        <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                            <Globe className="mr-2 h-4 w-4" /> Website
                        </Button>
                    </a>
                )}
                <Link href="/contact">
                    <Button>Apply Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>About the University</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{university.description || "No description available."}</p>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Available Programs</h2>
                {university.programs && university.programs.length > 0 ? (
                    <div className="grid gap-4">
                        {university.programs.map((program: {
                            id: string;
                            title: string;
                            level: string;
                            duration?: string;
                            language?: string;
                            tuition_fee?: string;
                            description?: string;
                            application_deadline?: string;
                        }) => (
                            <Card key={program.id} className="hover:border-primary transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl">{program.title}</CardTitle>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline">{program.level}</Badge>
                                                {program.duration && <Badge variant="outline">{program.duration}</Badge>}
                                                {program.language && <Badge variant="outline">{program.language}</Badge>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-primary">
                                                {program.tuition_fee || "Contact for pricing"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Tuition Fee</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {program.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="bg-muted/30 pt-4 flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground">
                                        Deadline: {program.application_deadline || "Open"}
                                    </div>
                                    <Link href={`/programs/${program.id}`}>
                                        <Button size="sm" variant="ghost">View Program</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No programs listed for this university yet.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
            {isAdmin && university.logo_url && (
                <Card className="overflow-hidden flex justify-center p-6 bg-white">
                    <div className="relative h-32 w-32">
                        <Image 
                            src={university.logo_url} 
                            alt="Logo" 
                            fill 
                            className="object-contain"
                        />
                    </div>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Why Study Here?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-brand-gold mt-0.5" />
                        <div>
                            <span className="font-medium block">Top Ranked</span>
                            <span className="text-sm text-muted-foreground">Recognized globally for academic excellence.</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-brand-blue mt-0.5" />
                        <div>
                            <span className="font-medium block">International Community</span>
                            <span className="text-sm text-muted-foreground">Diverse student body from over 100 countries.</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-brand-red mt-0.5" />
                        <div>
                            <span className="font-medium block">Scholarship Opportunities</span>
                            <span className="text-sm text-muted-foreground">Various financial aid options available.</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-brand-blue text-white border-none">
                <CardHeader>
                    <CardTitle className="text-white">Need Guidance?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-white/90 text-sm">
                        Our counselors can help you choose the right program and guide you through the admission process.
                    </p>
                    <Link href="/contact" className="block w-full">
                        <Button variant="secondary" className="w-full">
                            Contact Us
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
