import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MapPin, Building2, Briefcase, Calendar, ChevronLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JobApplicationForm } from "@/components/public/job-application-form"

export const dynamic = 'force-dynamic'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!job) notFound()

    return (
        <div className="container py-10">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Breadcrumbs / Back */}
                <Link href="/jobs" className="flex items-center text-sm text-muted-foreground hover:text-[#0056b3] transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Job Board
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-[#0056b3] text-[#0056b3]">
                                    {job.type}
                                </Badge>
                                <Badge variant="outline">
                                    {job.category || "General"}
                                </Badge>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900">{job.title}</h1>

                            <div className="flex flex-wrap gap-6 text-muted-foreground">
                                <div className="flex items-center">
                                    <Building2 className="w-5 h-5 mr-2 text-[#0056b3]" />
                                    <span className="font-medium">{job.company || "Confidential"}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-[#0056b3]" />
                                    <span>{job.location}</span>
                                </div>
                                {job.salary_range && (
                                    <div className="flex items-center text-amber-600 font-semibold">
                                        <Briefcase className="w-5 h-5 mr-2" />
                                        <span>{job.salary_range}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed mb-8">
                                {job.description}
                            </div>

                            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                {job.requirements}
                            </div>
                        </div>

                        <div className="pt-8 border-t flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Interested in this position? Apply using the form OR share with someone you know.
                            </p>
                            <Button variant="ghost" size="sm" className="hidden sm:flex">
                                <Share2 className="w-4 h-4 mr-2" /> Share Job
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar / Application Form */}
                    <div className="space-y-6">
                        <JobApplicationForm
                            jobId={job.id}
                            jobTitle={job.title}
                            userId={user?.id || null}
                        />

                        {/* Disclaimer / Info */}
                        <div className="p-6 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
                            <h3 className="font-bold flex items-center">
                                <Briefcase className="w-4 h-4 mr-2 text-[#0056b3]" />
                                About Sinoway Jobs
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                We specialize in connecting international talent with opportunities in China. All listings are verified and compliant with local labor laws.
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Your data is safe with us and will only be shared with the relevant employers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
