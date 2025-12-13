import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminView } from "@/components/admin/admin-view"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Verify admin role (mocked for now as per instructions, but in production use RLS/claims)
  
  const { data: applications } = await supabase
    .from('applications')
    .select('*, users(name, email), programs(title)')
    .order('submitted_at', { ascending: false })

  const apps = applications || []

  // Calculate stats
  const totalApps = apps.length
  const pendingApps = apps.filter(a => a.status === 'Pending').length
  const acceptedApps = apps.filter(a => a.status === 'Accepted').length
  const rejectedApps = apps.filter(a => a.status === 'Rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back, Administrator.</p>
      </div>

      <AdminView 
        applications={apps}
        totalApps={totalApps}
        pendingApps={pendingApps}
        acceptedApps={acceptedApps}
        rejectedApps={rejectedApps}
      />
    </div>
  )
}
