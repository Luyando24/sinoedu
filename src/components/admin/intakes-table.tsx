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
import { MoreHorizontal, Plus, Search, Pencil, Trash, Check, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

type IntakePeriod = {
    id: string
    name: string
    is_active: boolean
    created_at: string
}

export function IntakesTable({ initialIntakes }: { initialIntakes: IntakePeriod[] }) {
    const [intakes, setIntakes] = useState(initialIntakes)
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const filteredIntakes = intakes.filter(intake =>
        intake.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const deleteIntake = async (id: string) => {
        if (!confirm("Are you sure you want to delete this intake period?")) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('intake_periods')
                .delete()
                .eq('id', id)

            if (error) throw error

            setIntakes(intakes.filter(i => i.id !== id))
            toast.success("Intake period deleted successfully")
            router.refresh()
        } catch {
            toast.error("Failed to delete intake period")
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('intake_periods')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error

            setIntakes(intakes.map(i => i.id === id ? { ...i, is_active: !currentStatus } : i))
            toast.success("Status updated successfully")
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
                        placeholder="Search intakes..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/intakes/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Intake Period
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredIntakes.length > 0 ? (
                            filteredIntakes.map((intake) => (
                                <TableRow key={intake.id}>
                                    <TableCell className="font-medium">{intake.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={intake.is_active ? "default" : "secondary"}>
                                            {intake.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(intake.created_at).toLocaleDateString()}</TableCell>
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
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/intakes/${intake.id}`}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleStatus(intake.id, intake.is_active)}>
                                                    {intake.is_active ? (
                                                        <>
                                                            <X className="mr-2 h-4 w-4" /> Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="mr-2 h-4 w-4" /> Activate
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => deleteIntake(intake.id)}
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
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No intake periods found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
