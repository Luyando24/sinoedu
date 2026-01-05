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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, FileText, ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

type Application = {
    id: string
    created_at: string
    status: string
    cover_letter: string | null
    resume_url_snapshot: string | null
    jobs: {
        title: string
        company: string | null
    }
    users: {
        email: string
    }
}

export function JobApplicationsTable({ initialApplications }: { initialApplications: Application[] }) {
    const [applications, setApplications] = useState(initialApplications)
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const filteredApplications = applications.filter(app =>
        app.jobs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.users.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const updateStatus = async (id: string, newStatus: string) => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error

            setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app))
            toast.success(`Application status updated to ${newStatus}`)
            router.refresh()
        } catch {
            toast.error("Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Pending</Badge>
            case 'Reviewing':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Reviewing</Badge>
            case 'Accepted':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Accepted</Badge>
            case 'Rejected':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search applications..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Applied Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{app.users.email}</span>
                                            {app.resume_url_snapshot && (
                                                <a
                                                    href={app.resume_url_snapshot}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline flex items-center mt-1"
                                                >
                                                    <FileText className="h-3 w-3 mr-1" /> View CV
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{app.jobs.title}</span>
                                            <span className="text-xs text-muted-foreground">{app.jobs.company}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(app.created_at), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(app.status)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'Reviewing')} disabled={loading}>
                                                    <Clock className="mr-2 h-4 w-4 text-blue-500" /> Reviewing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'Accepted')} disabled={loading}>
                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Accept
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'Rejected')} disabled={loading}>
                                                    <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject
                                                </DropdownMenuItem>
                                                {app.resume_url_snapshot && (
                                                    <>
                                                        <DropdownMenuLabel className="border-t mt-1 pt-2">Candidate Details</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <a href={app.resume_url_snapshot} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="mr-2 h-4 w-4" /> View Resume
                                                            </a>
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
