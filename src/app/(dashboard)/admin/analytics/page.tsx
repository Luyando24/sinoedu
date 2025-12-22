import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsView } from "@/components/admin/analytics-view"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch analytics data (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Error fetching analytics:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Monitor web traffic and visitor statistics.</p>
      </div>

      <AnalyticsView initialEvents={events || []} />
    </div>
  )
}
