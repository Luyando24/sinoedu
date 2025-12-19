import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Header content={blocks || []} user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
