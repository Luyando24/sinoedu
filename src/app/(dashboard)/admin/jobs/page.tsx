import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobsTable } from "@/components/admin/jobs-table"

export const dynamic = 'force-dynamic'

export default async function AdminJobsPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
                <p className="text-muted-foreground">Manage job opportunities for international graduates.</p>
            </div>

            <JobsTable initialJobs={jobs || []} />
        </div>
    )
}
