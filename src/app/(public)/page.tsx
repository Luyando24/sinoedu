import { createClient } from "@/lib/supabase/server"
import { HomeClient } from "@/components/home-client"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')
  
  return <HomeClient content={blocks || []} />
}
