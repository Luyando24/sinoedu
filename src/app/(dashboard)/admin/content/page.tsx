import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ContentTable } from "@/components/admin/content-table"

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  // Verify admin role
  // ...

  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('*')
    .order('key', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage dynamic content across the website.</p>
      </div>

      <ContentTable data={contentBlocks || []} />
    </div>
  )
}
