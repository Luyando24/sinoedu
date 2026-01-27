"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"
import { Loader2, Plus, X } from "lucide-react"
import Image from "next/image"

type Program = {
  id: string
  program_id_code: string | null
  title: string
  university_id: string | null
  cover_image: string | null
  level: string | null
  duration: string | null
  tuition_fee: string | null
  description: string | null
  requirements: string | null
  location: string | null
  language: string | null
  intake: string | null
  application_deadline: string | null
  age_requirements: string | null
  nationality_restrictions: string | null
  language_requirements: string | null
  applicants_inside_china: string | null
  academic_requirements: string[] | null
  registration_fee: string | null
  application_fee_status: string | null
  scholarship_details: string | null
  scholarship_id: string | null
  accommodation_costs: { single: string; double: string; triple?: string; quad?: string } | null
  accommodation_details: string | null
  off_campus_living: string | null
  dormitory_photos: string[] | null
  processing_speed: string | null
  required_documents: string[] | null
  is_active: boolean;
}

interface ProgramFormProps {
  initialData?: Program
}

export function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [universities, setUniversities] = useState<{ id: string, name: string }[]>([])
  const [intakePeriods, setIntakePeriods] = useState<{ id: string, name: string }[]>([])
  const [scholarships, setScholarships] = useState<{ id: string, name: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [uniRes, intakeRes, scholarshipRes] = await Promise.all([
        supabase.from('universities').select('id, name'),
        supabase.from('intake_periods').select('id, name').eq('is_active', true).order('name'),
        supabase.from('scholarships').select('id, name').eq('is_active', true).order('name')
      ])

      if (uniRes.data) setUniversities(uniRes.data)
      if (intakeRes.data) setIntakePeriods(intakeRes.data)
      if (scholarshipRes.data) setScholarships(scholarshipRes.data)
    }
    fetchData()
  }, [supabase])

  const [formData, setFormData] = useState({
    program_id_code: initialData?.program_id_code || "",
    title: initialData?.title || "",
    university_id: initialData?.university_id || "",
    scholarship_id: initialData?.scholarship_id || "",
    cover_image: initialData?.cover_image || "",
    level: initialData?.level || "Bachelor",
    duration: initialData?.duration || "",
    tuition_fee: initialData?.tuition_fee || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    location: initialData?.location || "",

    language: initialData?.language || "",
    intake: initialData?.intake || "",
    application_deadline: initialData?.application_deadline || "",

    age_requirements: initialData?.age_requirements || "",
    nationality_restrictions: initialData?.nationality_restrictions || "no",
    language_requirements: initialData?.language_requirements || "",
    applicants_inside_china: initialData?.applicants_inside_china || "Not Accepted",

    academic_requirements: initialData?.academic_requirements || [""],

    registration_fee: initialData?.registration_fee || "",
    application_fee_status: initialData?.application_fee_status || "",
    scholarship_details: initialData?.scholarship_details || "",

    accommodation_single: initialData?.accommodation_costs?.single || "",
    accommodation_double: initialData?.accommodation_costs?.double || "",
    accommodation_triple: initialData?.accommodation_costs?.triple || "",
    accommodation_quad: initialData?.accommodation_costs?.quad || "",
    accommodation_details: initialData?.accommodation_details || "",
    off_campus_living: initialData?.off_campus_living || "Not Allowed",

    dormitory_photos: initialData?.dormitory_photos || [""],

    processing_speed: initialData?.processing_speed || "",
    required_documents: initialData?.required_documents || [""],
    is_active: initialData?.is_active ?? true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Helper for array fields
  const handleArrayChange = (index: number, value: string, field: "academic_requirements" | "dormitory_photos" | "required_documents") => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: "academic_requirements" | "dormitory_photos" | "required_documents") => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }))
  }

  const removeArrayItem = (index: number, field: "academic_requirements" | "dormitory_photos" | "required_documents") => {
    const newArray = [...formData[field]]
    newArray.splice(index, 1)
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleCopyFromUniversity = async () => {
    if (!formData.university_id) {
      toast.error("Please select a university first")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('dormitory_images')
        .eq('id', formData.university_id)
        .single()

      if (error) throw error

      if (data?.dormitory_images && data.dormitory_images.length > 0) {
        setFormData(prev => ({
          ...prev,
          dormitory_photos: [...prev.dormitory_photos.filter(p => p.trim() !== ""), ...data.dormitory_images]
        }))
        toast.success(`Imported ${data.dormitory_images.length} images from university`)
      } else {
        toast.warning("Selected university has no dormitory images")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch university images")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Destructure to remove flat fields that aren't in schema
      const { accommodation_single, accommodation_double, accommodation_triple, accommodation_quad, ...rest } = formData

      const payload = {
        ...rest,
        scholarship_id: formData.scholarship_id || null,
        academic_requirements: formData.academic_requirements.filter((i: string) => i.trim() !== ""),
        dormitory_photos: formData.dormitory_photos.filter((i: string) => i.trim() !== ""),
        required_documents: formData.required_documents.filter((i: string) => i.trim() !== ""),
        accommodation_costs: {
          single: accommodation_single,
          double: accommodation_double,
          triple: accommodation_triple,
          quad: accommodation_quad
        }
      }

      // Look up school_name if needed for backward compatibility or display, 
      // but we are relying on university_id now. 
      // We will fill school_name with the university name just in case legacy code needs it
      // const selectedUni = universities.find(u => u.id === formData.university_id)
      // if (selectedUni) {
      //   (payload as any).school_name = selectedUni.name
      // }

      if (initialData) {
        const { error } = await supabase
          .from('programs')
          .update(payload)
          .eq('id', initialData.id)
        if (error) throw error
        toast.success("Program updated successfully")
      } else {
        const { error } = await supabase
          .from('programs')
          .insert([payload])
        if (error) throw error
        toast.success("Program created successfully")
      }

      router.push("/admin/programs")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Program Title</label>
            <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Bachelor in Computer Science" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Program ID Code</label>
            <Input name="program_id_code" value={formData.program_id_code} onChange={handleChange} placeholder="e.g. SWGZGZHSXY-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">University</label>
            <select
              name="university_id"
              value={formData.university_id}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location / City</label>
            <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Guangzhou" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="Doctor">Doctor</option>
              <option value="Camp">Camp</option>
              <option value="Long-term Language">Long-term Language</option>
              <option value="College">College</option>
              <option value="High School">High School</option>
              <option value="Top-up program">Top-up program</option>
              <option value="Secondary Vocational Education">Secondary Vocational Education</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
              <option value="Language">Language Program</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <Input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 4 years" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Language of Instruction</label>
            <Input name="language" value={formData.language} onChange={handleChange} placeholder="e.g. English & Chinese" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Intake</label>
            <select
              name="intake"
              value={formData.intake}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select Intake</option>
              {intakePeriods.map((intake) => (
                <option key={intake.id} value={intake.name}>{intake.name}</option>
              ))}
              {/* Fallback for legacy data or if no DB intakes exist yet */}
              {formData.intake && !intakePeriods.some(i => i.name === formData.intake) && (
                <option value={formData.intake}>{formData.intake} (Current)</option>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Application Deadline</label>
            <Input name="application_deadline" value={formData.application_deadline} onChange={handleChange} placeholder="e.g. Nov 30, 2025" />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#0056b3] focus:ring-[#0056b3]"
            />
            <label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Active Status (Visible to Public)
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Description & Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Program Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">General Requirements</label>
            <Textarea name="requirements" value={formData.requirements} onChange={handleChange} className="min-h-[100px]" />
          </div>
        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Requirements</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Age Requirements</label>
            <Input name="age_requirements" value={formData.age_requirements} onChange={handleChange} placeholder="e.g. 18 - 35 years" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nationality Restrictions</label>
            <Input name="nationality_restrictions" value={formData.nationality_restrictions} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Language Requirements/Classes</label>
            <Input name="language_requirements" value={formData.language_requirements} onChange={handleChange} placeholder="e.g. Not Available / HSK 4" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Applicants Inside China</label>
            <select
              name="applicants_inside_china"
              value={formData.applicants_inside_china}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Accepted">Accepted</option>
              <option value="Not Accepted">Not Accepted</option>
            </select>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium">Academic Requirements (List)</label>
            {formData.academic_requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleArrayChange(index, e.target.value, "academic_requirements")}
                  placeholder="e.g. High School Diploma"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(index, "academic_requirements")}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("academic_requirements")}>
              <Plus className="h-4 w-4 mr-2" /> Add Requirement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tuition Fee</label>
            <Input name="tuition_fee" value={formData.tuition_fee} onChange={handleChange} placeholder="e.g. ¥20,000/year or N/A" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Registration Fee</label>
            <Input name="registration_fee" value={formData.registration_fee} onChange={handleChange} placeholder="e.g. ¥600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Application Fee Status</label>
            <Input name="application_fee_status" value={formData.application_fee_status} onChange={handleChange} placeholder="e.g. Refundable" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Scholarship Type</label>
            <select
              name="scholarship_id"
              value={formData.scholarship_id}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">No Scholarship</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium">Scholarship Details</label>
            <Textarea name="scholarship_details" value={formData.scholarship_details} onChange={handleChange} placeholder="Details about available scholarships..." />
          </div>
        </CardContent>
      </Card>

      {/* Accommodation */}
      <Card>
        <CardHeader>
          <CardTitle>Accommodation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Single Room Cost</label>
              <Input name="accommodation_single" value={formData.accommodation_single} onChange={handleChange} placeholder="e.g. ¥N/A" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Double Room Cost</label>
              <Input name="accommodation_double" value={formData.accommodation_double} onChange={handleChange} placeholder="e.g. ¥N/A" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">3-Person Room Cost</label>
              <Input name="accommodation_triple" value={formData.accommodation_triple} onChange={handleChange} placeholder="e.g. ¥N/A" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">4-Person Room Cost</label>
              <Input name="accommodation_quad" value={formData.accommodation_quad} onChange={handleChange} placeholder="e.g. ¥N/A" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Accommodation Details</label>
            <Input name="accommodation_details" value={formData.accommodation_details} onChange={handleChange} placeholder="e.g. HAS KITCHEN AND BATHROOM" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Off-Campus Living</label>
            <select
              name="off_campus_living"
              value={formData.off_campus_living}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Allowed">Allowed</option>
              <option value="Not Allowed">Not Allowed</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Dormitory Gallery</label>
              <Button type="button" variant="outline" size="sm" onClick={handleCopyFromUniversity}>
                Import from University
              </Button>
            </div>

            {/* Gallery Grid */}
            {formData.dormitory_photos && formData.dormitory_photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.dormitory_photos.filter(url => url && url.trim() !== "").map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                    <Image
                      src={photo}
                      alt={`Dormitory ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "dormitory_photos")}
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
                    dormitory_photos: [...prev.dormitory_photos, url]
                  }))
                }
              }}
              bucket="documents"
              folder="dormitory-images"
              accept="image/*"
              label="Add Dormitory Photo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Application Process */}
      <Card>
        <CardHeader>
          <CardTitle>Application Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Processing Speed</label>
            <Input name="processing_speed" value={formData.processing_speed} onChange={handleChange} placeholder="e.g. usually 2-4 weeks" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Required Documents</label>

            <div className="flex flex-wrap gap-2 mb-2">
              {[
                "Application form",
                "Passport",
                "Passport-sized photos",
                "Original copy of highest academic certificate",
                "Original copy of academic transcripts (highest education)",
                "Signature",
                "Original copy of police clearance certificate",
                "Medical examination form",
                "Letter of recommendation from high school"
              ].map((doc) => (
                <Button
                  key={doc}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1"
                  onClick={() => {
                    if (!formData.required_documents.includes(doc)) {
                      setFormData(prev => ({
                        ...prev,
                        required_documents: [...prev.required_documents.filter(d => d !== ""), doc]
                      }))
                    } else {
                      toast.info("Document already added")
                    }
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" /> {doc}
                </Button>
              ))}
            </div>

            {formData.required_documents.map((doc, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={doc}
                  onChange={(e) => handleArrayChange(index, e.target.value, "required_documents")}
                  placeholder="e.g. Passport"
                  className="min-h-[40px]"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(index, "required_documents")}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("required_documents")}>
              <Plus className="h-4 w-4 mr-2" /> Add Document
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Program" : "Create Program"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
