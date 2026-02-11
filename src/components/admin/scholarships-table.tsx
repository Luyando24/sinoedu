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
import { Trophy, Edit2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type Scholarship = {
  id: string
  name: string
  coverage: string | null
  amount: string | null
  is_active: boolean
  created_at: string
}

export function ScholarshipsTable({ initialScholarships }: { initialScholarships: Scholarship[] }) {
  const [scholarships, setScholarships] = useState(initialScholarships)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const deleteScholarship = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship? This might affect programs using it.")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', id)

      if (error) {
        if (error.code === '23503') {
          toast.error("Cannot delete scholarship because it is being used by programs. Please remove it from programs first.")
        } else {
          throw error
        }
        return
      }

      setScholarships(scholarships.filter(s => s.id !== id))
      toast.success("Scholarship deleted successfully")
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete scholarship")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Coverage</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scholarships?.map((scholarship) => (
          <TableRow key={scholarship.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                {scholarship.name}
              </div>
            </TableCell>
            <TableCell>{scholarship.coverage || "-"}</TableCell>
            <TableCell>{scholarship.amount || "-"}</TableCell>
            <TableCell>
              <Badge variant={scholarship.is_active ? "default" : "secondary"}>
                {scholarship.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/admin/scholarships/${scholarship.id}`}>
                  <Button variant="outline" size="icon" disabled={loading}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => deleteScholarship(scholarship.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {(!scholarships || scholarships.length === 0) && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No scholarships found. Create one to get started.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
