import { createClient } from "@/lib/supabase/server"
import { Briefcase, MapPin, Clock, Search, Building2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const dynamic = 'force-dynamic'

export default async function JobsPage({
    searchParams
}: {
    searchParams: { search?: string; type?: string; location?: string }
}) {
    const supabase = createClient()

    let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (searchParams.search) {
        query = query.ilike('title', `%${searchParams.search}%`)
    }

    if (searchParams.type) {
        query = query.eq('type', searchParams.type)
    }

    const { data: jobs } = await query

    return (
        <div className="container py-10 space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold text-[#0056b3]">Find Your Career in China</h1>
                <p className="text-xl text-muted-foreground">
                    Opportunities for international graduates and professionals.
                </p>
            </div>

            {/* Search and Filters */}
            <Card className="bg-slate-50 border-none shadow-sm">
                <CardContent className="pt-6">
                    <form className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="search"
                                placeholder="Search job titles..."
                                defaultValue={searchParams.search}
                                className="pl-10"
                            />
                        </div>
                        <select
                            name="type"
                            defaultValue={searchParams.type || ""}
                            className="md:w-48 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                        <Button type="submit" className="bg-[#0056b3] hover:bg-[#004494]">
                            Search Jobs
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs && jobs.length > 0 ? (
                    jobs.map((job) => (
                        <Card key={job.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="bg-sky-50 text-sky-700 hover:bg-sky-50 border-none">
                                        {job.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(job.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-xl mt-2 line-clamp-1">{job.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-3">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Building2 className="w-4 h-4 mr-2 text-[#0056b3]" />
                                    {job.company || "Confidential"}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mr-2 text-[#0056b3]" />
                                    {job.location || "Multiple Locations"}
                                </div>
                                {job.salary_range && (
                                    <div className="text-sm font-medium text-amber-600">
                                        {job.salary_range}
                                    </div>
                                )}
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                    {job.description}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Link href={`/jobs/${job.id}`} className="w-full">
                                    <Button variant="outline" className="w-full border-[#0056b3] text-[#0056b3] hover:bg-sky-50">
                                        View Details
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-slate-600">No jobs found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
