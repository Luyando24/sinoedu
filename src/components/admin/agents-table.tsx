"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, X, Search, MoreHorizontal, Phone, Link as LinkIcon, KeyRound, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type User = {
  id: string
  email: string
  name: string | null
  country: string | null
  role: string | null
  status: string | null
  created_at: string
  social_media_link: string | null
  whatsapp_number: string | null
}

export function AgentsTable({ initialAgents }: { initialAgents: User[] }) {
  const [agents, setAgents] = useState(initialAgents)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // Change password dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const filteredAgents = agents.filter(agent => 
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (agent.name && agent.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setLoading(true)
    try {
      const functionName = action === 'approve' ? 'approve_agent' : 'reject_agent'
      const { error } = await supabase.rpc(functionName, { target_user_id: id })

      if (error) throw error

      setAgents(agents.map(a => 
        a.id === id 
          ? { ...a, status: action === 'approve' ? 'active' : 'rejected' } 
          : a
      ))
      
      toast.success(`Agent ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      router.refresh()
    } catch (error: unknown) {
      console.error(`Error ${action}ing agent:`, error)
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} agent`
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const openPasswordDialog = (agent: User) => {
    setSelectedAgent(agent)
    setNewPassword("")
    setConfirmPassword("")
    setShowPassword(false)
    setShowConfirm(false)
    setPasswordDialogOpen(true)
  }

  const handleChangePassword = async () => {
    if (!selectedAgent) return

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setPasswordLoading(true)
    try {
      const response = await fetch("/api/admin/change-agent-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedAgent.id, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      toast.success(`Password updated for ${selectedAgent.name || selectedAgent.email}`)
      setPasswordDialogOpen(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to change password"
      toast.error(errorMessage)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Total Agents: {filteredAgents.length}
          </div>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name || "N/A"}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {agent.whatsapp_number && (
                        <Link href={`https://wa.me/${agent.whatsapp_number.replace(/\D/g, '')}`} target="_blank" className="text-green-600 hover:text-green-700">
                          <Phone className="h-4 w-4" />
                        </Link>
                      )}
                      {agent.social_media_link && (
                        <Link href={agent.social_media_link} target="_blank" className="text-blue-600 hover:text-blue-700">
                          <LinkIcon className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{agent.country || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      agent.status === 'active' ? "default" : 
                      agent.status === 'rejected' ? "destructive" : "outline"
                    }>
                      {agent.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(agent.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {agent.status !== 'active' && (
                          <DropdownMenuItem onClick={() => handleAction(agent.id, 'approve')}>
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {agent.status !== 'rejected' && (
                          <DropdownMenuItem onClick={() => handleAction(agent.id, 'reject')}>
                            <X className="mr-2 h-4 w-4 text-red-600" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openPasswordDialog(agent)}>
                          <KeyRound className="mr-2 h-4 w-4 text-amber-600" />
                          Change Password
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAgents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No agents found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for{" "}
              <span className="font-medium text-foreground">
                {selectedAgent?.name || selectedAgent?.email}
              </span>
              . No email will be sent — the password changes immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleChangePassword()
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              disabled={passwordLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={
                passwordLoading ||
                newPassword.length < 8 ||
                newPassword !== confirmPassword
              }
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
