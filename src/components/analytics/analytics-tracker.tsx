"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Generate or retrieve session ID
    let sessionId = localStorage.getItem("analytics_session_id")
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem("analytics_session_id", sessionId)
    }

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            search: searchParams.toString(),
            referrer: document.referrer,
            sessionId,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("Failed to track analytics:", error)
      }
    }

    trackPageView()
  }, [pathname, searchParams])

  return null
}
