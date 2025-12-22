import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReviewForm } from "@/components/admin/review-form"

export const dynamic = 'force-dynamic'

export default async function NewReviewPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Review</h1>
        <p className="text-muted-foreground">Add a new agent testimonial.</p>
      </div>

      <ReviewForm />
    </div>
  )
}
