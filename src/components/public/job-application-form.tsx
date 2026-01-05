"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

type Profile = {
    full_name: string | null
    phone: string | null
    resume_url: string | null
}

export function JobApplicationForm({ jobId, jobTitle, userId }: { jobId: string; jobTitle: string; userId: string | null }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)

    const [formData, setFormData] = useState({
        cover_letter: "",
        resume_url: "",
    })

    // Fetch profile if user is logged in
    useEffect(() => {
        if (userId) {
            const getProfile = async () => {
                const { data } = await supabase
                    .from('job_profiles')
                    .select('full_name, phone, resume_url')
                    .eq('user_id', userId)
                    .single()

                if (data) {
                    setProfile(data)
                    if (data.resume_url) {
                        setFormData(prev => ({ ...prev, resume_url: data.resume_url || "" }))
                    }
                }
            }
            getProfile()
        }
    }, [userId, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userId) {
            toast.error("Please log in to apply")
            router.push("/auth/login")
            return
        }

        if (!formData.resume_url) {
            toast.error("Please upload your resume")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase
                .from('job_applications')
                .insert([{
                    job_id: jobId,
                    user_id: userId,
                    resume_url_snapshot: formData.resume_url,
                    cover_letter: formData.cover_letter,
                    status: 'Pending'
                }])

            if (error) {
                if (error.code === '23505') {
                    toast.error("You have already applied for this job")
                } else {
                    throw error
                }
            } else {
                setSubmitted(true)
                toast.success("Application submitted successfully!")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit application")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <Card className="border-green-200 bg-green-50 shadow-none text-center py-10">
                <CardContent className="space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
                    <p className="text-green-700">
                        Thank you for applying for the <strong>{jobTitle}</strong> position. Our team will review your application soon.
                    </p>
                    <div className="pt-4">
                        <Link href="/jobs">
                            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                                Browse More Jobs
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!userId) {
        return (
            <Card className="border-blue-100 bg-blue-50 shadow-none">
                <CardHeader>
                    <CardTitle className="text-lg">Want to apply?</CardTitle>
                    <CardDescription>You need to be logged in to apply for job opportunities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href={`/auth/login?redirect=/jobs/${jobId}`}>
                        <Button className="w-full bg-[#0056b3]">Log in to Apply</Button>
                    </Link>
                    <p className="text-xs text-center mt-3 text-muted-foreground">
                        Don&apos;t have an account? <Link href="/auth/register" className="text-blue-600 hover:underline">Register here</Link>
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
                <CardDescription>
                    {profile ? `Applying as ${profile.full_name || 'logged-in user'}` : "Fill in your details to apply."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Letter (Optional)</label>
                        <Textarea
                            placeholder="Tell us why you are a good fit for this role..."
                            value={formData.cover_letter}
                            onChange={(e) => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium">Current Resume / CV</label>
                        {formData.resume_url ? (
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center">
                                    <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium">Resume Uploaded</p>
                                        <a href={formData.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                            View Current Resume
                                        </a>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData(prev => ({ ...prev, resume_url: "" }))}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <FileUpload
                                bucket="documents"
                                folder="resumes"
                                onUpload={(url) => setFormData(prev => ({ ...prev, resume_url: url }))}
                                label="Upload Resume (PDF/DOCX)"
                                accept=".pdf,.doc,.docx"
                                description="Upload your latest CV to apply. If you have a job profile, this will be saved there too."
                            />
                        )}
                    </div>

                    {!profile && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
                            <div className="h-5 w-5 text-amber-500 mt-0.5">⚠️</div>
                            <p className="text-xs text-amber-700">
                                <strong>Tip:</strong> Create a <Link href="/profile/job" className="underline font-bold">Job Profile</Link> to save your resume and details for faster applications next time.
                            </p>
                        </div>
                    )}

                    <Button type="submit" className="w-full h-12 text-lg bg-[#0056b3]" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Submit Application"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
