"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

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

  const handleToggleActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }))
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

  const handleDelete = async () => {
    if (!initialData?.id || !confirm("Are you sure you want to delete this scholarship? This might affect programs using it.")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', initialData.id)

      if (error) {
        if (error.code === '23503') {
          toast.error("Cannot delete scholarship because it is being used by programs. Please remove it from programs first.")
        } else {
          throw error
        }
        return
      }

      toast.success("Scholarship deleted successfully")
      router.push("/admin/scholarships")
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete scholarship")
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
              <Label htmlFor="coverage">Coverage</Label>
              <Input
                id="coverage"
                name="coverage"
                placeholder="e.g. Full Tuition"
                value={formData.coverage}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Optional)</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="e.g. 2500 RMB/month"
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
              placeholder="Details about requirements, benefits, etc."
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={handleToggleActive}
              className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
            />
            <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Active (Visible in search filters)
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Scholarship" : "Create Scholarship"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/scholarships")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>

        {initialData && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Scholarship
          </Button>
        )}
      </div>
    </form>
  )
}
