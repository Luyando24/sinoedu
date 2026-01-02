import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { IntakeForm } from "@/components/admin/intake-form"

export default async function NewIntakePage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Intake Period</h1>
                <p className="text-muted-foreground">Create a new intake period for programs.</p>
            </div>

            <IntakeForm />
        </div>
    )
}
