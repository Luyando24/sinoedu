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

type University = {
  id: string
  name: string
  location: string | null
  ranking: string | null
}

export function UniversitiesTable({ initialUniversities }: { initialUniversities: University[] }) {
  const [universities, setUniversities] = useState(initialUniversities)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const filteredUniversities = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (uni.location && uni.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const deleteUniversity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university? All associated programs will also be deleted.")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id)

      if (error) throw error

      setUniversities(universities.filter(u => u.id !== id))
      toast.success("University deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete university")
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
            placeholder="Search universities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/admin/universities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add University
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Ranking</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((uni) => (
                <TableRow key={uni.id}>
                  <TableCell className="font-medium">{uni.name}</TableCell>
                  <TableCell>{uni.location || "-"}</TableCell>
                  <TableCell>{uni.ranking || "-"}</TableCell>
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
                          <Link href={`/admin/universities/${uni.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => deleteUniversity(uni.id)}
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
                <TableCell colSpan={4} className="h-24 text-center">
                  No universities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
