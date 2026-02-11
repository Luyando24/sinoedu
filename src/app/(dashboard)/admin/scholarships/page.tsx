import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScholarshipsTable } from "@/components/admin/scholarships-table"

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
          <ScholarshipsTable initialScholarships={scholarships || []} />
        </CardContent>
      </Card>
    </div>
  )
}
