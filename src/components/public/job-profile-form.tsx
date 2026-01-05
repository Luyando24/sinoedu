"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, FileText, Globe, Phone, User as UserIcon } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"

type JobProfile = {
    user_id: string
    full_name: string | null
    phone: string | null
    bio: string | null
    portfolio_url: string | null
    resume_url: string | null
}

interface JobProfileFormProps {
    initialData?: JobProfile | null
    userId: string
}

export function JobProfileForm({ initialData, userId }: JobProfileFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        full_name: initialData?.full_name || "",
        phone: initialData?.phone || "",
        bio: initialData?.bio || "",
        portfolio_url: initialData?.portfolio_url || "",
        resume_url: initialData?.resume_url || "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('job_profiles')
                .upsert({
                    user_id: userId,
                    ...formData,
                    updated_at: new Date().toISOString()
                })

            if (error) throw error
            toast.success("Job profile updated successfully")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>This information will be pre-filled when you apply for a job.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center">
                                    <UserIcon className="w-4 h-4 mr-2 text-[#0056b3]" /> Full Name
                                </label>
                                <Input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="As it appears on your passport" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-[#0056b3]" /> Phone Number
                                    </label>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="include country code e.g. +86..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center">
                                        <Globe className="w-4 h-4 mr-2 text-[#0056b3]" /> Portfolio / LinkedIn URL
                                    </label>
                                    <Input name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Short Bio</label>
                                <Textarea name="bio" value={formData.bio} onChange={handleChange} className="min-h-[100px]" placeholder="Briefly describe your experience and goals..." />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Resume Upload */}
                <div className="space-y-6">
                    <Card className="border-[#0056b3]/20 shadow-sm border-2">
                        <CardHeader>
                            <CardTitle>Professional Resume</CardTitle>
                            <CardDescription>Upload your latest CV in PDF format.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.resume_url ? (
                                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <FileText className="h-16 w-16 text-blue-500 mb-4" />
                                    <p className="text-sm font-medium mb-2">Resume Uploaded</p>
                                    <a
                                        href={formData.resume_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline mb-4"
                                    >
                                        View Current Doc
                                    </a>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormData(prev => ({ ...prev, resume_url: "" }))}
                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                    >
                                        Replace File
                                    </Button>
                                </div>
                            ) : (
                                <FileUpload
                                    bucket="documents"
                                    folder="resumes"
                                    onUpload={(url) => setFormData(prev => ({ ...prev, resume_url: url }))}
                                    label="Upload Resume (PDF/DOCX)"
                                    accept=".pdf,.doc,.docx"
                                    description="Max size 5MB"
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full bg-[#0056b3]" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Profile Details"}
                    </Button>
                </div>
            </div>
        </form>
    )
}
