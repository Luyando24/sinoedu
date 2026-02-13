import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { HomeContactForm } from "@/components/admin/home-contact-form"

export const dynamic = 'force-dynamic'

export default async function AdminHomeContactPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  return (
    <div className="space-y-6">
      <HomeContactForm />
    </div>
  )
}
