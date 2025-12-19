"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, FileText, User, CreditCard, Shield, LucideIcon, FileEdit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"

interface SidebarItem {
  name: string
  href: string
  icon: string
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  User,
  CreditCard,
  Shield,
  FileEdit
}

interface SidebarProps {
  items: SidebarItem[]
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success("Signed out successfully")
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="hidden w-64 border-r bg-background md:block fixed inset-y-0 left-0">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image 
              src="/logo.png" 
              alt="CSA Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg">DASHBOARD</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                pathname === item.href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start gap-3" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
