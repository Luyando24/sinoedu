import { createClient } from "@/lib/supabase/server"
import { ApplicationForm } from "@/components/dashboard/application-form"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function ApplicationPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Check if application already exists
  const { data: application } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  if (application) {
    redirect("/dashboard")
  }

  // Fetch programs
  const { data: programs } = await supabase
    .from('programs')
    .select('id, title, school_name')
  
  return (
    <div className="max-w-4xl mx-auto">
      <ApplicationForm programs={programs || []} userId={user.id} />
    </div>
  )
}
