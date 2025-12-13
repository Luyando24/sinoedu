import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PostForm } from "@/components/admin/post-form"

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground">Write a new blog post.</p>
      </div>

      <PostForm />
    </div>
  )
}
