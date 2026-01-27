import { ScholarshipForm } from "@/components/admin/scholarship-form"

export default function NewScholarshipPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Scholarship</h1>
        <p className="text-muted-foreground">Create a new scholarship type.</p>
      </div>

      <ScholarshipForm />
    </div>
  )
}
