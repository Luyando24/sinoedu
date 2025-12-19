"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Why Us", href: "/why-us" },
  { name: "Services", href: "/services" },
  { name: "Universities", href: "/universities" },
  { name: "Programs", href: "/programs" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
]

import Image from "next/image"

type ContentBlock = {
  key: string
  content: string
}

const getContent = (blocks: ContentBlock[], key: string, fallback: string) => {
  return blocks?.find(b => b.key === key)?.content || fallback
}

export function Header({ content = [] }: { content?: ContentBlock[] }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#0056b3] text-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-10">
              <Image
                src="/images/logo.png"
                alt="Sinoway Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="hidden font-bold sm:inline-block">
              SinowayEdu 华途国际教育
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white/80",
                pathname === item.href
                  ? "text-white font-bold border-b-2 border-white pb-1"
                  : "text-white/90"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
              {getContent(content, 'header.nav.login', 'Log in')}
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-white text-[#0056b3] hover:bg-white/90">
              {getContent(content, 'header.nav.apply', 'Apply Now')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex items-center space-x-2 md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {getContent(content, 'header.nav.login', 'Log in')}
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-start">{getContent(content, 'header.nav.apply', 'Apply Now')}</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
