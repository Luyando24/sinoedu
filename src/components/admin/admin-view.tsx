"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { FileText, CheckCircle, XCircle, Clock, Search, LucideIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Application = {
  id: string
  status: string
  submitted_at: string
  users: {
    name: string
    email: string
  }
  programs: {
    title: string
  }
}

type AdminViewProps = {
  applications: Application[]
  totalApps: number
  pendingApps: number
  acceptedApps: number
  rejectedApps: number
}

export function AdminView({ applications: initialApps, totalApps, pendingApps, acceptedApps, rejectedApps }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [applications, setApplications] = useState(initialApps)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.users?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.programs?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const updateStatus = async (id: string, newStatus: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setApplications(apps => 
        apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
      )
      toast.success(`Application updated to ${newStatus}`)
      router.refresh()
    } catch {
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <div className="flex border-b">
        {["overview", "applications"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Applications" value={totalApps} icon={FileText} className="text-blue-600" />
          <StatsCard title="Pending Review" value={pendingApps} icon={Clock} className="text-yellow-600" />
          <StatsCard title="Accepted" value={acceptedApps} icon={CheckCircle} className="text-green-600" />
          <StatsCard title="Rejected" value={rejectedApps} icon={XCircle} className="text-red-600" />
        </div>
      )}

      {activeTab === "applications" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle>Manage Applications</CardTitle>
                <CardDescription>View and manage student applications</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="More Documents Needed">More Docs Needed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">{app.users?.name || app.users?.email || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{app.users?.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={app.programs?.title}>
                      {app.programs?.title}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell>{new Date(app.submitted_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <select
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                            disabled={loading}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="More Documents Needed">Request Docs</option>
                          </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredApps.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No applications found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  className: string
}

function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${className}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    Accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    "More Documents Needed": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  )
}
