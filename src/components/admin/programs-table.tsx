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
import { MoreHorizontal, Plus, Search, Pencil, Trash } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type Program = {
  id: string
  program_id_code: string | null
  title: string
  university_id: string | null
  universities: {
    name: string
  } | { name: string }[] | null
  level: string | null
  location: string | null
}

import { ProgramImporter } from "./program-importer"

export function ProgramsTable({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  if (loading) {
     // prevent unused variable warning
  }

  const getUniversityName = (program: Program) => {
    if (!program.universities) return ""
    if (Array.isArray(program.universities)) {
      return program.universities[0]?.name || ""
    }
    return program.universities.name || ""
  }

  const filteredPrograms = programs.filter(program => 
    program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getUniversityName(program).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (program.program_id_code && program.program_id_code.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const deleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPrograms(programs.filter(p => p.id !== id))
      toast.success("Program deleted successfully")
      router.refresh()
    } catch {
      toast.error("Failed to delete program")
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
            placeholder="Search programs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <ProgramImporter />
            <Link href="/admin/programs/new">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Program
            </Button>
            </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-mono text-xs">{program.program_id_code || "-"}</TableCell>
                  <TableCell className="font-medium">{program.title}</TableCell>
                  <TableCell>{getUniversityName(program) || "-"}</TableCell>
                  <TableCell>{program.level || "-"}</TableCell>
                  <TableCell>{program.location || "-"}</TableCell>
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
                          <Link href={`/admin/programs/${program.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => deleteProgram(program.id)}
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
                  No programs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
