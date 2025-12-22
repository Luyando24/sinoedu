import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UsersTable } from "@/components/admin/users-table"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Ideally check for admin role here too via RPC or profile check
  const { data: role } = await supabase.rpc('get_my_role')
  if (role !== 'admin') {
    redirect("/dashboard")
  }

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage system users and administrators.</p>
      </div>

      <UsersTable initialUsers={users || []} currentUserId={user.id} />
    </div>
  )
}
