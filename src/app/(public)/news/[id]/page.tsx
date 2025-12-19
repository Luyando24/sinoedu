import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { CalendarDays, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  return (
    <article className="container py-16 max-w-4xl">
      <div className="mb-8">
        <Link href="/news">
          <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </Link>
      </div>

      <div className="space-y-6 text-center mb-12">
         {post.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-medium">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            {new Date(post.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
      </div>

      {post.image_url && (
        <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-xl">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  )
}
