import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReviewsTable } from "@/components/admin/reviews-table"

export const dynamic = 'force-dynamic'

export default async function ReviewsAdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: reviews } = await supabase
    .from('agent_reviews')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Reviews</h1>
        <p className="text-muted-foreground">Manage agent reviews and testimonials.</p>
      </div>

      <ReviewsTable initialReviews={reviews || []} />
    </div>
  )
}
