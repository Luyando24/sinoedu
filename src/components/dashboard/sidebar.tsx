"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, FileText, User, CreditCard, Shield, LucideIcon, FileEdit, Mail, Star, UserCog, BarChart, Calendar, Briefcase, ClipboardList, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"

export interface SidebarItem {
  name: string
  href: string
  icon: string
  group?: string
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  User,
  CreditCard,
  Shield,
  FileEdit,
  Mail,
  Star,
  UserCog,
  BarChart,
  Calendar,
  Briefcase,
  ClipboardList,
  Users
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
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image
                src="/images/logo-new.jpg"
                alt="Sinoway Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg">DASHBOARD</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-4">
            {(() => {
              const groups: Record<string, SidebarItem[]> = {}
              const ungrouped: SidebarItem[] = []

              items.forEach(item => {
                if (item.group) {
                  if (!groups[item.group]) groups[item.group] = []
                  groups[item.group].push(item)
                } else {
                  ungrouped.push(item)
                }
              })

              const renderItem = (item: SidebarItem) => {
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
              }

              return (
                <>
                  {ungrouped.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {ungrouped.map(renderItem)}
                    </div>
                  )}
                  {Object.entries(groups).map(([groupName, groupItems]) => (
                    <div key={groupName} className="space-y-1">
                      <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        {groupName}
                      </h4>
                      <div className="flex flex-col gap-1">
                        {groupItems.map(renderItem)}
                      </div>
                    </div>
                  ))}
                </>
              )
            })()}
          </div>
        </div>

        <div className="p-4 border-t shrink-0">
          <Button variant="outline" className="w-full justify-start gap-3" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  )
}
