import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "My Application", href: "/dashboard/application", icon: "FileText" },
    { name: "Profile", href: "/dashboard/profile", icon: "User" },
    { name: "Payments", href: "/dashboard/payments", icon: "CreditCard" },
  ]

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role === 'admin') {
      sidebarItems = [
        { name: "Overview", href: "/admin", icon: "Shield" },
      ]
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 mb-16 md:mb-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
