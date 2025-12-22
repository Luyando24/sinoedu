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
import { Check, X, Search, MoreHorizontal, Phone, Link as LinkIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  return (
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredAgents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No agents found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
