import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessagesTable } from "@/components/admin/messages-table"

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  // Fetch messages
  const { data: messages } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">View and manage contact form submissions.</p>
      </div>

      <MessagesTable initialMessages={messages || []} />
    </div>
  )
}
