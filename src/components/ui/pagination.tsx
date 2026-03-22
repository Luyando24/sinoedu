"use client"

import { Link } from "@/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | string[] | undefined>
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  const t = useTranslations("Common")

  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && key !== "page") {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v))
          } else {
            params.set(key, value)
          }
        }
      })
    }
    params.set("page", pageNumber.toString())
    return `${baseUrl}?${params.toString()}`
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPageButton(i))
      }
    } else {
      pages.push(renderPageButton(1))

      if (currentPage > 3) {
        pages.push(
          <span key="ellipsis-start" className="flex items-center justify-center w-10">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </span>
        )
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(renderPageButton(i))
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis-end" className="flex items-center justify-center w-10">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </span>
        )
      }

      pages.push(renderPageButton(totalPages))
    }

    return pages
  }

  const renderPageButton = (pageNumber: number) => (
    <Link key={pageNumber} href={createPageUrl(pageNumber)}>
      <Button
        variant={currentPage === pageNumber ? "default" : "outline"}
        size="icon"
        className={cn(
          "w-10 h-10",
          currentPage === pageNumber && "bg-[#0056b3] hover:bg-[#0056b3]/90"
        )}
      >
        {pageNumber}
      </Button>
    </Link>
  )

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Link href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          className="w-10 h-10"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t("previous")}</span>
        </Button>
      </Link>

      <div className="flex items-center space-x-2">{renderPageNumbers()}</div>

      <Link href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          className="w-10 h-10"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">{t("next")}</span>
        </Button>
      </Link>
    </div>
  )
}
