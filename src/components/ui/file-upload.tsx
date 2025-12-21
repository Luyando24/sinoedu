"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, X, FileIcon, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"

interface FileUploadProps {
  value?: string | null
  onUpload: (url: string) => void
  bucket?: string
  folder?: string
  accept?: string
  label?: string
  description?: string
}

export function FileUpload({ 
  value, 
  onUpload, 
  bucket = "documents", 
  folder = "uploads", 
  accept = "image/*",
  label = "Upload File",
  description
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      onUpload(data.publicUrl)
      toast.success("File uploaded successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload file")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onUpload("")
  }

  const isImage = value && (value.match(/\.(jpeg|jpg|gif|png|webp)$/i) || accept.startsWith("image/"))
  const isVideo = value && (value.match(/\.(mp4|webm|ogg)$/i) || accept.startsWith("video/"))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="text-red-500 h-8 px-2">
            <X className="h-4 w-4 mr-1" /> Remove
          </Button>
        )}
      </div>
      
      {value ? (
        <div className="relative rounded-lg border overflow-hidden bg-slate-50">
          {isImage ? (
            <div className="relative aspect-video w-full h-48">
              <Image 
                src={value} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
            </div>
          ) : isVideo ? (
             <video src={value} controls className="w-full max-h-48" />
          ) : (
            <div className="flex items-center p-4 gap-3">
              <FileIcon className="h-8 w-8 text-blue-500" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{value.split('/').pop()}</p>
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                  View File
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div 
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-slate-50 transition-colors cursor-pointer text-center"
            onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <p className="text-sm text-gray-600 font-medium">
              {isUploading ? "Uploading..." : "Click to upload"}
            </p>
            {description && <p className="text-xs text-gray-400">{description}</p>}
          </div>
        </div>
      )}
      
      <Input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept={accept}
        onChange={handleFileChange}
      />
    </div>
  )
}
