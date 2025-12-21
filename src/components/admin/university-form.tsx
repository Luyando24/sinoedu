"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import Image from "next/image"

type University = {
  id: string
  name: string
  location: string | null
  description: string | null
  logo_url: string | null
  image_url: string | null
  ranking: string | null
  established_year: string | null
  website_url: string | null
  cover_image: string | null
  gallery_images: string[] | null
  video_url: string | null
}

interface UniversityFormProps {
  initialData?: University
}

export function UniversityForm({ initialData }: UniversityFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
    logo_url: initialData?.logo_url || "",
    image_url: initialData?.image_url || "",
    cover_image: initialData?.cover_image || "",
    gallery_images: initialData?.gallery_images || [],
    video_url: initialData?.video_url || "",
    ranking: initialData?.ranking || "",
    established_year: initialData?.established_year || "",
    website_url: initialData?.website_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (initialData) {
        const { error } = await supabase
          .from('universities')
          .update(formData)
          .eq('id', initialData.id)
        if (error) throw error
        toast.success("University updated successfully")
      } else {
        const { error } = await supabase
          .from('universities')
          .insert([formData])
        if (error) throw error
        toast.success("University created successfully")
      }
      
      router.push("/admin/universities")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto pb-20">
      <Card>
        <CardHeader>
          <CardTitle>University Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">University Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Peking University" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Beijing" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} className="min-h-[100px]" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Ranking</label>
                <Input name="ranking" value={formData.ranking} onChange={handleChange} placeholder="e.g. Top 5" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Established Year</label>
                <Input name="established_year" value={formData.established_year} onChange={handleChange} placeholder="e.g. 1898" />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Website URL</label>
             <Input name="website_url" value={formData.website_url} onChange={handleChange} placeholder="https://..." />
          </div>
          
          <div className="space-y-2">
             <label className="text-sm font-medium">Logo</label>
             <div className="flex gap-4 items-start">
                <div className="flex-1">
                    <Input name="logo_url" value={formData.logo_url} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="w-[200px]">
                    <FileUpload
                        value={formData.logo_url}
                        onUpload={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                        bucket="documents"
                        folder="university-logos"
                        label="Upload Logo"
                    />
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Cover Image</label>
             <div className="flex gap-4 items-start">
                <div className="flex-1">
                    <Input name="cover_image" value={formData.cover_image} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="w-[200px]">
                    <FileUpload
                        value={formData.cover_image}
                        onUpload={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
                        bucket="documents"
                        folder="university-covers"
                        label="Upload Cover"
                    />
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Campus Image (Legacy)</label>
             <div className="flex gap-4 items-start">
                <div className="flex-1">
                    <Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="w-[200px]">
                    <FileUpload
                        value={formData.image_url}
                        onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                        bucket="documents"
                        folder="university-images"
                        label="Upload Image"
                    />
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">University Video</label>
             <div className="space-y-2">
                <Input 
                    name="video_url" 
                    value={formData.video_url} 
                    onChange={handleChange} 
                    placeholder="YouTube URL or Upload Video" 
                />
                {(!formData.video_url || (!formData.video_url.includes("youtube") && !formData.video_url.includes("youtu.be"))) && (
                    <FileUpload
                        value={formData.video_url}
                        onUpload={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
                        bucket="documents"
                        folder="university-videos"
                        accept="video/*"
                        label="Upload Video (Local)"
                    />
                )}
                {(formData.video_url && (formData.video_url.includes("youtube") || formData.video_url.includes("youtu.be"))) && (
                    <div className="p-4 bg-slate-50 rounded text-sm text-muted-foreground">
                        YouTube video linked.
                    </div>
                )}
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Campus Gallery</label>
            
            {/* Gallery Grid */}
            {formData.gallery_images && formData.gallery_images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.gallery_images.map((photo, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                            <Image 
                                src={photo} 
                                alt={`Gallery ${index + 1}`} 
                                fill 
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newGallery = [...formData.gallery_images];
                                    newGallery.splice(index, 1);
                                    setFormData(prev => ({ ...prev, gallery_images: newGallery }));
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <FileUpload
                value=""
                onUpload={(url) => {
                    if (url) {
                        setFormData(prev => ({
                            ...prev,
                            gallery_images: [...(prev.gallery_images || []), url]
                        }))
                    }
                }}
                bucket="documents"
                folder="university-gallery"
                accept="image/*"
                label="Add Gallery Photo"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update University" : "Create University"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
