"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Eye, Phone, Reply, Send, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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
}

export function MessagesTable({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const supabase = createClient()

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return

    setIsReplying(true)
    try {
      const response = await fetch("/api/admin/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          to: selectedMessage.email,
          subject: selectedMessage.subject,
          replyMessage: replyText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reply")
      }

      toast.success("Reply sent successfully")
      setReplyText("")
      setShowReplyForm(false)
      
      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === selectedMessage.id ? { ...msg, status: "replied" } : msg
        )
      )
      
      // Update selected message status
      setSelectedMessage(prev => prev ? { ...prev, status: "replied" } : null)
      
    } catch (error: any) {
      console.error("Error sending reply:", error)
      toast.error(error.message || "Failed to send reply")
    } finally {
      setIsReplying(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        )
      )
      toast.success("Status updated")
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || msg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "destructive" // Red for new
      case "read":
        return "secondary" // Gray/Blue for read
      case "replied":
        return "default" // Green/Primary for replied
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              Manage contact form submissions
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="flex h-10 w-full sm:w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {msg.first_name} {msg.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {msg.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <div className="font-medium truncate">{msg.subject}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {msg.message}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(msg.created_at), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(msg.status)}>
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View Message"
                        onClick={() => setSelectedMessage(msg)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <select
                        className="flex h-8 w-[110px] items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={msg.status}
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => {
        if (!open) {
          setSelectedMessage(null)
          setShowReplyForm(false)
          setReplyText("")
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              From {selectedMessage?.first_name} {selectedMessage?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Date:</span>
                <span className="col-span-3">
                  {format(new Date(selectedMessage.created_at), "PPP p")}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Email:</span>
                <span className="col-span-3">{selectedMessage.email}</span>
              </div>
              {selectedMessage.whatsapp_number && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-bold text-right flex items-center justify-end gap-2">
                    <Phone className="h-4 w-4" />
                    WhatsApp:
                  </span>
                  <span className="col-span-3">{selectedMessage.whatsapp_number}</span>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Subject:</span>
                <span className="col-span-3">{selectedMessage.subject}</span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="font-bold text-right mt-1">Message:</span>
                <div className="col-span-3 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold text-right">Status:</span>
                <div className="flex items-center justify-between col-span-3">
                  <Badge variant={getStatusBadgeVariant(selectedMessage.status)}>
                    {selectedMessage.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    {showReplyForm ? "Cancel Reply" : "Reply Email"}
                  </Button>
                </div>
              </div>

              {showReplyForm && (
                <div className="space-y-4 border-t pt-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="reply-text">Your Reply</Label>
                    <Textarea
                      id="reply-text"
                      placeholder="Write your reply here..."
                      className="min-h-[150px]"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSendReply} 
                      disabled={isReplying || !replyText.trim()}
                    >
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
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
