import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function NewsPage() {
  const supabase = createClient()
  
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <div className="container py-16 space-y-12 bg-slate-50 min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-[#0056b3]">{getContent(blocks, 'news.hero.title', 'Latest News & Updates')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {getContent(blocks, 'news.hero.desc', 'Stay informed about scholarships, university updates, and student life in China.')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts && posts.length > 0 ? (
          posts.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow bg-white border-gray-200">
              <div className="relative h-48 w-full bg-slate-100">
                {item.image_url ? (
                  <Image 
                    src={item.image_url} 
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                {item.category && (
                  <div className="absolute top-4 left-4 bg-[#0056b3] text-white text-xs px-2 py-1 rounded-full">
                    {item.category}
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center text-muted-foreground text-sm mb-2">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <CardTitle className="line-clamp-2 hover:text-[#0056b3] transition-colors">
                  <Link href={`/news/${item.id}`}>
                    {item.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="line-clamp-3">
                  {item.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={`/news/${item.id}`} className="w-full">
                  <Button variant="outline" className="w-full border-[#0056b3] text-[#0056b3] hover:bg-[#0056b3] hover:text-white">Read More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-[#0056b3]">{getContent(blocks, 'news.no_news.title', 'No news yet')}</h3>
            <p className="text-muted-foreground mt-2">{getContent(blocks, 'news.no_news.desc', 'Check back later for the latest updates.')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
