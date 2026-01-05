import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobForm } from "@/components/admin/job-form"

export default async function NewJobPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Job</h1>
                <p className="text-muted-foreground">Fill in the details for the new job listing.</p>
            </div>

            <JobForm />
        </div>
    )
}
