import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProgramsTable } from "@/components/admin/programs-table"

export const dynamic = 'force-dynamic'

export default async function ProgramsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Ideally check for admin role here too

  const { data: programs } = await supabase
    .from('programs')
    .select('id, program_id_code, title, level, location, university_id, universities(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
        <p className="text-muted-foreground">Manage university programs and courses.</p>
      </div>

      <ProgramsTable initialPrograms={programs || []} />
    </div>
  )
}
