import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UniversitiesTable } from "@/components/admin/universities-table"

export const dynamic = 'force-dynamic'

export default async function UniversitiesAdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: universities } = await supabase
    .from('universities')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
        <p className="text-muted-foreground">Manage partner universities.</p>
      </div>

      <UniversitiesTable initialUniversities={universities || []} />
    </div>
  )
}
