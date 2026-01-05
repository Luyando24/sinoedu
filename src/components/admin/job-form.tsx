"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

type Job = {
    id: string
    title: string
    company: string | null
    location: string | null
    type: string | null
    description: string | null
    requirements: string | null
    salary_range: string | null
    category: string | null
    is_active: boolean
}

interface JobFormProps {
    initialData?: Job
}

export function JobForm({ initialData }: JobFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        company: initialData?.company || "",
        location: initialData?.location || "",
        type: initialData?.type || "Full-time",
        description: initialData?.description || "",
        requirements: initialData?.requirements || "",
        salary_range: initialData?.salary_range || "",
        category: initialData?.category || "",
        is_active: initialData?.is_active ?? true,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData) {
                const { error } = await supabase
                    .from('jobs')
                    .update(formData)
                    .eq('id', initialData.id)
                if (error) throw error
                toast.success("Job listing updated successfully")
            } else {
                const { error } = await supabase
                    .from('jobs')
                    .insert([formData])
                if (error) throw error
                toast.success("Job listing created successfully")
            }

            router.push("/admin/jobs")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto pb-20">
            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Title</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. English Teacher" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company Name</label>
                            <Input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. ABC Education Group" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Shanghai" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Job Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Salary Range</label>
                            <Input name="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="e.g. 15k - 25k RMB" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Education, Tech, Sales" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Job Description</label>
                        <Textarea name="description" value={formData.description} onChange={handleChange} className="min-h-[150px]" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Requirements</label>
                        <Textarea name="requirements" value={formData.requirements} onChange={handleChange} className="min-h-[150px]" />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-[#0056b3] focus:ring-[#0056b3]"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium leading-none">
                            Active Status (Visible to Public)
                        </label>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button type="submit" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Job" : "Create Job"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
