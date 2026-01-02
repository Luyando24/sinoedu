import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { IntakeForm } from "@/components/admin/intake-form"

export default async function EditIntakePage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    const { data: intake } = await supabase
        .from('intake_periods')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!intake) notFound()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Intake Period</h1>
                <p className="text-muted-foreground">Modify the intake period details.</p>
            </div>

            <IntakeForm initialData={intake} />
        </div>
    )
}
