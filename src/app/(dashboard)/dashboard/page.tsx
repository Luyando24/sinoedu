import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, AlertCircle, CheckCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch application
  const { data: application } = await supabase
    .from('applications')
    .select('*, programs(title, school_name)')
    .eq('user_id', user?.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.name || 'Student'}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Application Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {application ? application.status : "Not Started"}
            </div>
            <p className="text-xs text-muted-foreground">
              {application ? "Last updated recently" : "Start your application today"}
            </p>
          </CardContent>
        </Card>
         {/* Add more cards for stats if needed */}
      </div>

      {!application ? (
        <Card className="bg-brand-blue/5 border-brand-blue/20">
          <CardHeader>
            <CardTitle>Start Your Application</CardTitle>
            <CardDescription>
              You haven&apos;t submitted an application yet. Apply now to secure your spot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/application">
              <Button>Apply for Admission</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>
              Applying for {application.programs?.title} at {application.programs?.school_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
              {application.status === 'Accepted' ? (
                <CheckCircle className="text-green-500 h-5 w-5" />
              ) : (
                <AlertCircle className="text-yellow-500 h-5 w-5" />
              )}
              <div>
                <p className="font-medium">Status: {application.status}</p>
                <p className="text-sm text-muted-foreground">
                  {application.status === 'Pending' && "Your application is under review."}
                  {application.status === 'More Documents Needed' && "Please upload additional documents."}
                </p>
              </div>
            </div>
            {application.status === 'More Documents Needed' && (
               <Link href="/dashboard/application">
                 <Button variant="outline">Upload Documents</Button>
               </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
