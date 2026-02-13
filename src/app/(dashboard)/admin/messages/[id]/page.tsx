import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { MessageDetailsView } from "@/components/admin/message-details-view"

export const dynamic = 'force-dynamic'

export default async function MessagePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: message } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!message) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <MessageDetailsView initialMessage={message} />
    </div>
  )
}
