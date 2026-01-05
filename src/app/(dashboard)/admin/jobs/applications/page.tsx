import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobApplicationsTable } from "@/components/admin/job-applications-table"

export const dynamic = 'force-dynamic'

export default async function AdminJobApplicationsPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: applications } = await supabase
        .from('job_applications')
        .select(`
      *,
      jobs (
        title,
        company
      ),
      users (
        email
      )
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
                <p className="text-muted-foreground">Review and manage job applications from candidates.</p>
            </div>

            <JobApplicationsTable initialApplications={applications || []} />
        </div>
    )
}
