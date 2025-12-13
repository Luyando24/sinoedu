import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UniversityForm } from "@/components/admin/university-form"

export const dynamic = 'force-dynamic'

export default async function NewUniversityPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New University</h1>
        <p className="text-muted-foreground">Enter university details below.</p>
      </div>

      <UniversityForm />
    </div>
  )
}
