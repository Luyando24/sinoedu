"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

type Post = any

interface PostFormProps {
  initialData?: Post
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    category: initialData?.category || "",
    published: initialData?.published ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (initialData) {
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', initialData.id)
        if (error) throw error
        toast.success("Post updated successfully")
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([formData])
        if (error) throw error
        toast.success("Post created successfully")
      }
      
      router.push("/admin/posts")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input name="title" value={formData.title} onChange={handleChange} required placeholder="Enter post title" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select Category</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Immigration">Immigration</option>
              <option value="Events">Events</option>
              <option value="Academics">Academics</option>
              <option value="Education">Education</option>
              <option value="Alumni">Alumni</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt (Short Description)</label>
            <Textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="min-h-[80px]" placeholder="Brief summary for cards..." />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Cover Image URL</label>
             <Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea name="content" value={formData.content} onChange={handleChange} className="min-h-[300px]" placeholder="Write your post content here..." />
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="published" 
              name="published" 
              checked={formData.published} 
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
            />
            <label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Publish immediately
            </label>
          </div>

        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
