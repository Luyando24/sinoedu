"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Reply, Send, Loader2, ArrowLeft, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type ReplyHistory = {
  text: string
  sent_at: string
  sent_by: string
}

type Message = {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
  whatsapp_number?: string
  replies?: ReplyHistory[]
}

export function MessageDetailsView({ initialMessage }: { initialMessage: Message }) {
  const [message, setMessage] = useState<Message>(initialMessage)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSendReply = async () => {
    if (!replyText.trim()) return

    setIsReplying(true)
    try {
      const response = await fetch("/api/admin/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: message.id,
          to: message.email,
          subject: message.subject,
          replyMessage: replyText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reply")
      }

      toast.success("Reply sent successfully")
      
      const newReply: ReplyHistory = {
        text: replyText,
        sent_at: new Date().toISOString(),
        sent_by: "Admin"
      }

      setReplyText("")
      setShowReplyForm(false)
      
      // Update local state
      setMessage((prev) => ({
        ...prev,
        status: "replied",
        replies: [...(prev.replies || []), newReply]
      }))
      
    } catch (error) {
      console.error("Error sending reply:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send reply")
    } finally {
      setIsReplying(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", message.id)

      if (error) throw error

      setMessage((prev) => ({ ...prev, status: newStatus }))
      toast.success("Status updated")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "destructive"
      case "read":
        return "secondary"
      case "replied":
        return "default"
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Message Details</h1>
          <p className="text-muted-foreground">View and reply to contact submission</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{message.subject}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(message.created_at), "PPP p")}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(message.status)}>
                  {message.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </div>

              {message.replies && message.replies.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Reply className="h-4 w-4" />
                    Reply History
                  </h3>
                  <div className="space-y-3">
                    {message.replies.map((reply, index) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {reply.sent_by}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {format(new Date(reply.sent_at), "MMM d, yyyy h:mm a")}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {reply.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                {!showReplyForm ? (
                  <Button onClick={() => setShowReplyForm(true)}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply to Message
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reply-text">Your Reply</Label>
                      <Textarea
                        id="reply-text"
                        placeholder="Type your message here..."
                        className="min-h-[200px] resize-none"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowReplyForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendReply} disabled={isReplying || !replyText.trim()}>
                        {isReplying ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sender Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-semibold">{message.first_name} {message.last_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <a href={`mailto:${message.email}`} className="text-brand-blue hover:underline flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {message.email}
                </a>
              </div>
              {message.whatsapp_number && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                  <a href={`https://wa.me/${message.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <Phone className="h-4 w-4 text-green-600" />
                    {message.whatsapp_number}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Update Status</Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={message.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
