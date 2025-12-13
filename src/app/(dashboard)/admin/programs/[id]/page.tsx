import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ProgramForm } from "@/components/admin/program-form"

export const dynamic = 'force-dynamic'

export default async function EditProgramPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!program) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Program</h1>
        <p className="text-muted-foreground">Update program details below.</p>
      </div>

      <ProgramForm initialData={program} />
    </div>
  )
}
