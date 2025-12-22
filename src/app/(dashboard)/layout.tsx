import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
    // Use RPC for role check to be safe
    const { data: roleData } = await supabase.rpc('get_my_role')
    let userRole = roleData
    
    // Fallback if RPC fails
    if (!userRole) {
       const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
       userRole = profile?.role
    }

    if (userRole === 'admin') {
      sidebarItems = [
        { name: "Overview", href: "/admin", icon: "Shield" },
        { name: "Users", href: "/admin/users", icon: "User" },
        { name: "Agents", href: "/admin/agents", icon: "UserCog" },
        { name: "Programs", href: "/admin/programs", icon: "FileText" },
        { name: "Universities", href: "/admin/universities", icon: "LayoutDashboard" },
        { name: "Messages", href: "/admin/messages", icon: "Mail" },
        { name: "Posts", href: "/admin/posts", icon: "FileText" },
        { name: "Content", href: "/admin/content", icon: "FileEdit" },
      ]
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-muted/20">
          <Sidebar items={sidebarItems} />

          {/* Main Content */}
          <main className="flex-1 md:ml-64 mb-16 md:mb-0">
            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}