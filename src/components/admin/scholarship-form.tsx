"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Scholarship = {
  id: string
  name: string
  description: string | null
  coverage: string | null
  amount: string | null
  is_active: boolean
}

interface ScholarshipFormProps {
  initialData?: Scholarship
}

export function ScholarshipForm({ initialData }: ScholarshipFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    coverage: initialData?.coverage || "",
    amount: initialData?.amount || "",
    is_active: initialData?.is_active ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleActive = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        name: formData.name,
        description: formData.description || null,
        coverage: formData.coverage || null,
        amount: formData.amount || null,
        is_active: formData.is_active,
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from('scholarships')
          .update(dataToSave)
          .eq('id', initialData.id)
        if (error) throw error
        toast.success("Scholarship updated successfully")
      } else {
        const { error } = await supabase
          .from('scholarships')
          .insert([dataToSave])
        if (error) throw error
        toast.success("Scholarship created successfully")
      }

      router.push("/admin/scholarships")
      router.refresh()
    } catch (error) {
      toast.error("Failed to save scholarship")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Scholarship Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Chinese Government Scholarship (CSC)"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage Type</Label>
              <Input
                id="coverage"
                name="coverage"
                placeholder="e.g. Full Tuition, Partial"
                value={formData.coverage}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount / Benefits</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="e.g. 30,000 RMB/year"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detailed information about the scholarship..."
              className="min-h-[150px]"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={handleToggleActive}
            />
            <Label htmlFor="is_active">Active (Visible in selection)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Scholarship" : "Create Scholarship"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
