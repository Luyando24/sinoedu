import { createClient } from "@/lib/supabase/server"
import { ScholarshipForm } from "@/components/admin/scholarship-form"
import { notFound } from "next/navigation"

export default async function EditScholarshipPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: scholarship } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!scholarship) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Scholarship</h1>
        <p className="text-muted-foreground">Update scholarship details.</p>
      </div>

      <ScholarshipForm initialData={scholarship} />
    </div>
  )
}
