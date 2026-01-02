import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { IntakesTable } from "@/components/admin/intakes-table"

export const dynamic = 'force-dynamic'

export default async function IntakesAdminPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: intakes } = await supabase
        .from('intake_periods')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Intake Periods</h1>
                <p className="text-muted-foreground">Manage program intake periods.</p>
            </div>

            <IntakesTable initialIntakes={intakes || []} />
        </div>
    )
}
