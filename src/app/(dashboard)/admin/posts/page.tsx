import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PostsTable } from "@/components/admin/posts-table"

export const dynamic = 'force-dynamic'

export default async function PostsAdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <p className="text-muted-foreground">Manage news and updates.</p>
      </div>

      <PostsTable initialPosts={posts || []} />
    </div>
  )
}
