"use client"

import { useState } from "react"
import Link from "next/link"
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
import { MoreHorizontal, Plus, Search, Pencil, Trash, CheckCircle2, XCircle, Briefcase } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

type Job = {
    id: string
    title: string
    company: string | null
    location: string | null
    type: string | null
    is_active: boolean
    created_at: string
}

export function JobsTable({ initialJobs }: { initialJobs: Job[] }) {
    const [jobs, setJobs] = useState(initialJobs)
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.company && job.company.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const deleteJob = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job listing?")) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id)

            if (error) throw error

            setJobs(jobs.filter(j => j.id !== id))
            toast.success("Job deleted successfully")
            router.refresh()
        } catch {
            toast.error("Failed to delete job")
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('jobs')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setJobs(jobs.map(j => j.id === id ? { ...j, is_active: !currentStatus } : j))
            toast.success(`Job marked as ${!currentStatus ? 'active' : 'inactive'}`)
            router.refresh()
        } catch {
            toast.error("Failed to update status")
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
                        placeholder="Search jobs..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/jobs/applications">
                        <Button variant="outline">
                            View Applications
                        </Button>
                    </Link>
                    <Link href="/admin/jobs/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Job
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">{job.title}</TableCell>
                                    <TableCell>{job.company || "-"}</TableCell>
                                    <TableCell>{job.location || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{job.type || "-"}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {job.is_active ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">
                                                Inactive
                                            </Badge>
                                        )}
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
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/jobs/${job.id}`}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleStatus(job.id, job.is_active)}
                                                    disabled={loading}
                                                >
                                                    {job.is_active ? (
                                                        <>
                                                            <XCircle className="mr-2 h-4 w-4" /> Mark Inactive
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Active
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => deleteJob(job.id)}
                                                    disabled={loading}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No jobs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
