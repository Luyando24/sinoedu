import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { UniversityForm } from "@/components/admin/university-form"

export const dynamic = 'force-dynamic'

export default async function EditUniversityPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: university } = await supabase
    .from('universities')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!university) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit University</h1>
        <p className="text-muted-foreground">Update university details below.</p>
      </div>

      <UniversityForm initialData={university} />
    </div>
  )
}
