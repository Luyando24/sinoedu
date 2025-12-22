import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const headersList = headers()
    
    // Get user info if authenticated
    const { data: { user } } = await supabase.auth.getUser()

    // Get IP and User Agent
    const userAgent = headersList.get("user-agent")
    // IP is tricky in Next.js/Vercel/Cloudflare, usually in x-forwarded-for
    const forwardedFor = headersList.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(',')[0] : "unknown"
    
    // Simple device detection
    const isMobile = /mobile/i.test(userAgent || "")
    const deviceType = isMobile ? "mobile" : "desktop"

    const { error } = await supabase
      .from("analytics_events")
      .insert({
        session_id: body.sessionId,
        user_id: user?.id || null,
        path: body.path,
        referrer: body.referrer || null,
        user_agent: userAgent,
        device_type: deviceType,
        country: headersList.get("x-vercel-ip-country") || null, // Vercel specific, harmless if missing
        meta: {
            ip: ip,
            search: body.search
        }
      })

    if (error) {
        console.error("Supabase Analytics Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
