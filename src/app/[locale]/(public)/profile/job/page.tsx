import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobProfileForm } from "@/components/public/job-profile-form"
import { Briefcase } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function JobProfilePage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/auth/login?redirect=/profile/job")

    const { data: profile } = await supabase
        .from('job_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return (
        <div className="container py-10">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#0056b3]">
                        <Briefcase className="w-6 h-6" />
                        <h1 className="text-3xl font-bold">My Job Profile</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Set up your professional profile once and use it to apply for multiple job opportunities in China.
                    </p>
                </div>

                <JobProfileForm initialData={profile} userId={user.id} />
            </div>
        </div>
    )
}
