import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AgentsTable } from "@/components/admin/agents-table"

export const dynamic = 'force-dynamic'

export default async function AdminAgentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: role } = await supabase.rpc('get_my_role')
  if (role !== 'admin') {
    redirect("/dashboard")
  }

  const { data: agents } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'agent')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Approvals</h1>
        <p className="text-muted-foreground">Manage and approve agent accounts.</p>
      </div>

      <AgentsTable initialAgents={agents || []} />
    </div>
  )
}
