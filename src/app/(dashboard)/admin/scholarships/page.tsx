import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Trophy, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function ScholarshipsPage() {
  const supabase = createClient()
  const { data: scholarships } = await supabase
    .from('scholarships')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
          <p className="text-muted-foreground">Manage scholarship types for programs.</p>
        </div>
        <Link href="/admin/scholarships/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Scholarship
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Scholarships</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <Button variant="outline" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      {/* Delete logic could be added here but keeping it simple for now */}
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
        </CardContent>
      </Card>
    </div>
  )
}
