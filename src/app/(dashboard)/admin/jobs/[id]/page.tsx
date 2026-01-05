import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { JobForm } from "@/components/admin/job-form"

export const dynamic = 'force-dynamic'

export default async function EditJobPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!job) notFound()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
                <p className="text-muted-foreground">Update the details for this job listing.</p>
            </div>

            <JobForm initialData={job} />
        </div>
    )
}
