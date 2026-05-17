import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    // 1. Verify the caller is authenticated and is an admin
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: role } = await supabase.rpc('get_my_role')
    if (role !== 'admin') {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
    }

    // 2. Parse and validate the request body
    const { userId, newPassword } = await request.json()

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 })
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ error: "Missing or invalid newPassword" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // 3. Use the admin client to update the user's password directly (no email sent)
    const adminClient = createAdminClient()
    const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
      password: newPassword,
    })

    if (updateError) {
      console.error("Admin password update error:", updateError)
      return NextResponse.json(
        { error: updateError.message || "Failed to update password" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Change agent password API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
