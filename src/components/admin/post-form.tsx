"use client"

import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

type Post = {
  id: string
  title: string
  excerpt: string | null
  content: string | null
  image_url: string | null
  category: string | null
  published: boolean
}

interface PostFormProps {
  initialData?: Post
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }))
  }

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `posts/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents') // Reusing 'documents' bucket for simplicity, or create 'images'
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
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: "" }))
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
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{initialData ? "Edit Post" : "Create New Post"}</h1>
        <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
            </Button>
            <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Post" : "Publish Post"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter post title" 
                        className="text-lg font-medium py-6"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <div className="min-h-[400px]">
                      <ReactQuill 
                        theme="snow"
                        value={formData.content || ""}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        className="h-[350px]"
                      />
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select 
                        name="category" 
                        value={formData.category || ""} 
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
                        <label className="text-sm font-medium">Excerpt</label>
                        <Textarea 
                            name="excerpt" 
                            value={formData.excerpt || ""} 
                            onChange={handleChange} 
                            className="min-h-[100px]" 
                            placeholder="Brief summary for preview cards..." 
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input 
                        type="checkbox" 
                        id="published" 
                        name="published" 
                        checked={formData.published} 
                        onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                        />
                        <label htmlFor="published" className="text-sm font-medium leading-none cursor-pointer">
                        Publish immediately
                        </label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {formData.image_url ? (
                            <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                                <Image 
                                    src={formData.image_url} 
                                    alt="Cover" 
                                    fill 
                                    className="object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div 
                                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="h-8 w-8 mb-2" />
                                <span className="text-sm">Click to upload image</span>
                            </div>
                        )}
                        
                        <Input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                        />
                        
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">or paste URL:</span>
                        </div>
                        <Input 
                            name="image_url" 
                            value={formData.image_url || ""} 
                            onChange={handleChange} 
                            placeholder="https://..." 
                            className="text-xs"
                        />
                        {uploading && <p className="text-xs text-brand-blue animate-pulse">Uploading...</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </form>
  )
}
