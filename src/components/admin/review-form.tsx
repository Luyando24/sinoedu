"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"

type Review = {
  id: string
  name: string
  role: string | null
  country: string | null
  content: string
  image_url: string | null
}

interface ReviewFormProps {
  initialData?: Review
}

export function ReviewForm({ initialData }: ReviewFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    country: initialData?.country || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `reviews/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents') 
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload image: " + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        name: formData.name,
        role: formData.role || null,
        country: formData.country || null,
        content: formData.content,
        image_url: formData.image_url || null,
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from('agent_reviews')
          .update(dataToSave)
          .eq('id', initialData.id)
        if (error) throw error
        toast.success("Review updated successfully")
      } else {
        const { error } = await supabase
          .from('agent_reviews')
          .insert([dataToSave])
        if (error) throw error
        toast.success("Review created successfully")
      }

      router.push("/admin/reviews")
      router.refresh()
    } catch (error) {
      toast.error("Failed to save review")
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
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Nguyen Van Minh"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role / Company</Label>
              <Input
                id="role"
                name="role"
                placeholder="e.g. Director, Global Education Solutions"
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="e.g. Vietnam"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Review Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write the review here..."
              className="min-h-[150px]"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Agent Picture</Label>
            <div className="flex flex-col gap-4">
              {formData.image_url && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <Image 
                    src={formData.image_url} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4 mr-2" />
                  )}
                  Upload Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <span className="text-sm text-muted-foreground">
                  Recommended: Square image (1:1)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Review" : "Create Review"}
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
