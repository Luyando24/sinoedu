import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReviewForm } from "@/components/admin/review-form"

export const dynamic = 'force-dynamic'

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: review } = await supabase
    .from('agent_reviews')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!review) redirect("/admin/reviews")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Review</h1>
        <p className="text-muted-foreground">Edit agent testimonial.</p>
      </div>

      <ReviewForm initialData={review} />
    </div>
  )
}
