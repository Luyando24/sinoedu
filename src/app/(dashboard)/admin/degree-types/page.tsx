import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DegreeTypesTable } from "@/components/admin/degree-types-table"

export const dynamic = 'force-dynamic'

export default async function DegreeTypesAdminPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: degreeTypes } = await supabase
        .from('program_levels')
        .select('*')
        .order('sort_order', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Degree Types</h1>
                <p className="text-muted-foreground">Manage the classification of programs and their display order.</p>
            </div>

            <DegreeTypesTable initialData={degreeTypes || []} />
        </div>
    )
}
