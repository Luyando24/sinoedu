import { Resend } from 'resend';
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messageId, to, subject, replyMessage } = await request.json()

    if (!to || !subject || !replyMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send email using Resend
    // Note: If you're using a free tier, you might only be able to send to your own email 
    // or verified domains unless you've added a custom domain to Resend.
    const { data, error: sendError } = await resend.emails.send({
      from: 'Sino Study <onboarding@resend.dev>', // You should change this to your verified domain
      to: [to],
      subject: `Re: ${subject}`,
      text: replyMessage,
      // You can also use html: `<p>${replyMessage}</p>`
    });

    if (sendError) {
      console.error("Resend Error:", sendError)
      return NextResponse.json({ error: sendError.message }, { status: 500 })
    }

    // Update message status in Supabase
    if (messageId) {
      const { error: updateError } = await supabase
        .from("contact_submissions")
        .update({ status: "replied" })
        .eq("id", messageId)

      if (updateError) {
        console.error("Supabase Update Error:", updateError)
      }
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Reply API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
