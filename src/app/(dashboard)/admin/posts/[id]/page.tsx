import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { PostForm } from "@/components/admin/post-form"

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">Update blog post details.</p>
      </div>

      <PostForm initialData={post} />
    </div>
  )
}
