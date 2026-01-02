"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"

type IntakePeriod = {
    id: string
    name: string
    is_active: boolean
}

interface IntakeFormProps {
    initialData?: IntakePeriod
}

export function IntakeForm({ initialData }: IntakeFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        is_active: initialData?.is_active ?? true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData) {
                const { error } = await supabase
                    .from('intake_periods')
                    .update(formData)
                    .eq('id', initialData.id)
                if (error) throw error
                toast.success("Intake period updated successfully")
            } else {
                const { error } = await supabase
                    .from('intake_periods')
                    .insert([formData])
                if (error) throw error
                toast.success("Intake period created successfully")
            }

            router.push("/admin/intakes")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{initialData ? "Edit Intake Period" : "New Intake Period"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="e.g. September 2025"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={formData.is_active ? "active" : "inactive"}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === "active" }))}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button type="submit" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Intake" : "Create Intake"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
