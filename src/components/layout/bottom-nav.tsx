"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Programs", href: "/programs", icon: GraduationCap },
    { name: "Services", href: "/services", icon: BookOpen },
    { name: "Account", href: "/dashboard", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center gap-1 px-2 text-[10px] font-medium transition-colors hover:bg-muted/50",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
