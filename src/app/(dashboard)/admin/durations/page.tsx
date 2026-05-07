import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DurationsTable } from "@/components/admin/durations-table"

export const dynamic = 'force-dynamic'

export default async function DurationsAdminPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: durations } = await supabase
        .from('program_durations')
        .select('*')
        .order('sort_order', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Program Durations</h1>
                <p className="text-muted-foreground">Manage the duration options for academic programs.</p>
            </div>

            <DurationsTable initialData={durations || []} />
        </div>
    )
}
