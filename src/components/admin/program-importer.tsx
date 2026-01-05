"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, AlertCircle, CheckCircle, Download } from "lucide-react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ProgramImporter() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [universities, setUniversities] = useState<{id: string, name: string}[]>([])
  
  const router = useRouter()
  const supabase = createClient()

  // Fetch universities for mapping
  useEffect(() => {
    const fetchUniversities = async () => {
        const { data } = await supabase.from('universities').select('id, name')
        if (data) setUniversities(data)
    }
    if (open) fetchUniversities()
  }, [open, supabase])

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        title: "Bachelor of Computer Science",
        program_id_code: "CS-ZJU-001",
        university: "Zhejiang University", // Must match existing university
        location: "Hangzhou",
        level: "Bachelor",
        duration: "4 Years",
        language: "English",
        intake: "September 2025",
        application_deadline: "2025-06-30",
        is_active: "TRUE", // or FALSE
        
        description: "Comprehensive CS program taught in English.",
        requirements: "High School Diploma, IELTS 6.0",
        
        // Eligibility
        age_requirements: "18-25",
        nationality_restrictions: "None",
        language_requirements: "IELTS 6.0 or TOEFL 80",
        applicants_inside_china: "Accepted",
        academic_requirements: "High School Diploma\nTranscripts", // Array items separated by newline
        
        // Financial
        tuition_fee: "20,000 RMB/Year",
        registration_fee: "400 RMB",
        application_fee_status: "Non-refundable",
        scholarship_details: "Full scholarship available for top students",
        
        // Accommodation
        accommodation_single: "12000 RMB/Year",
        accommodation_double: "6000 RMB/Year",
        accommodation_triple: "4000 RMB/Year",
        accommodation_quad: "3000 RMB/Year",
        accommodation_details: "Private bathroom, AC, Internet",
        off_campus_living: "Allowed",
        
        // Other
        processing_speed: "Fast",
        required_documents: "Passport\nPhoto\nDiploma\nTranscripts" // Array items separated by newline
      },
      {
        title: "MBA",
        program_id_code: "MBA-BLCU-002",
        university: "Beijing Language and Culture University",
        location: "Beijing",
        level: "Master",
        duration: "2 Years",
        language: "English",
        intake: "September 2025",
        application_deadline: "2025-05-15",
        is_active: "TRUE",

        description: "Focus on international business management.",
        requirements: "Bachelor Degree, 2 years work experience",

        age_requirements: "22-40",
        nationality_restrictions: "None",
        language_requirements: "IELTS 6.5",
        applicants_inside_china: "Accepted",
        academic_requirements: "Bachelor Degree\nTranscripts",

        tuition_fee: "30,000 RMB/Year",
        registration_fee: "800 RMB",
        application_fee_status: "Non-refundable",
        scholarship_details: "Partial scholarship available",

        accommodation_single: "15000 RMB/Year",
        accommodation_double: "8000 RMB/Year",
        accommodation_triple: "",
        accommodation_quad: "",
        accommodation_details: "Shared kitchen",
        off_campus_living: "Not Allowed",

        processing_speed: "Normal",
        required_documents: "Passport\nPhoto\nDegree Certificate\nTranscripts\nRecommendation Letters"
      }
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)
    
    // Set column widths
    const wscols = [
      { wch: 30 }, // title
      { wch: 15 }, // program_id_code
      { wch: 35 }, // university
      { wch: 15 }, // location
      { wch: 10 }, // level
      { wch: 10 }, // duration
      { wch: 10 }, // language
      { wch: 15 }, // intake
      { wch: 15 }, // application_deadline
      { wch: 10 }, // is_active
      { wch: 40 }, // description
      { wch: 30 }, // requirements
      { wch: 15 }, // age_requirements
      { wch: 20 }, // nationality_restrictions
      { wch: 20 }, // language_requirements
      { wch: 20 }, // applicants_inside_china
      { wch: 30 }, // academic_requirements
      { wch: 15 }, // tuition_fee
      { wch: 15 }, // registration_fee
      { wch: 20 }, // application_fee_status
      { wch: 30 }, // scholarship_details
      { wch: 15 }, // accommodation_single
      { wch: 15 }, // accommodation_double
      { wch: 15 }, // accommodation_triple
      { wch: 15 }, // accommodation_quad
      { wch: 30 }, // accommodation_details
      { wch: 15 }, // off_campus_living
      { wch: 15 }, // processing_speed
      { wch: 30 }, // required_documents
    ]
    ws['!cols'] = wscols

    // Apply text format to date columns (Intake and Application Deadline)
    // to prevent Excel from auto-formatting them as dates
    if (ws['!ref']) {
      const range = XLSX.utils.decode_range(ws['!ref'])
      const dateCols = [7, 8] // Indexes for intake (H) and application_deadline (I)
      
      // Extend range to 1000 rows to ensure future entries also respect text format
      range.e.r = Math.max(range.e.r, 1000)
      ws['!ref'] = XLSX.utils.encode_range(range)

      for (let R = range.s.r; R <= range.e.r; ++R) {
        if (R === 0) continue // Skip header row
        
        dateCols.forEach(C => {
          const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
          if (!ws[cellRef]) {
             ws[cellRef] = { t: 's', v: '' } // Initialize empty cell as string
          }
          ws[cellRef].z = '@' // Text format
          ws[cellRef].t = 's' // Force string type
        })
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Template")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" })
    saveAs(data, "program_import_template.xlsx")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFile(selectedFile || null)
    setError(null)
    setPreviewData([])

    if (selectedFile) {
      parseFile(selectedFile)
    }
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet)
        
        if (jsonData.length === 0) {
          setError("The file appears to be empty.")
          return
        }

        // Validate headers (basic check)
        const firstRow = jsonData[0] as object
        if (!("title" in firstRow || "Title" in firstRow || "Program" in firstRow)) {
            setError("Could not find a 'title' or 'Program' column. Please check the file format.")
            return
        }

        setPreviewData(jsonData as Record<string, unknown>[])
      } catch (err) {
        console.error(err)
        setError("Failed to parse the file. Please ensure it is a valid Excel file.")
      }
    }
    reader.readAsBinaryString(file)
  }

  const findUniversityId = (uniName: string): string | null => {
      if (!uniName) return null
      const match = universities.find(u => u.name.toLowerCase() === uniName.toLowerCase())
      return match ? match.id : null
  }

  const handleImport = async () => {
    if (previewData.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const formattedData = previewData.map((row) => {
          const r = row as Record<string, unknown>
          const uniName = (r.university || r.University || r.school || r.School) as string
          const uniId = findUniversityId(uniName)

          return {
            title: (r.title || r.Title || r.Program) as string,
            program_id_code: (r.program_id_code || r.Code || null) as string | null,
            university_id: uniId,
            level: (r.level || r.Level || 'Bachelor') as string,
            location: (r.location || r.Location || null) as string | null,
            duration: (r.duration || r.Duration || null) as string | null,
            tuition_fee: (r.tuition_fee || r.Tuition || null) as string | null,
            description: (r.description || r.Description || null) as string | null,
            requirements: (r.requirements || r.Requirements || null) as string | null,
            language: (r.language || r.Language || 'English') as string,
            intake: (r.intake || r.Intake || null) as string | null,
            application_deadline: (r.application_deadline || r.Deadline || null) as string | null,
            is_active: r.is_active === 'TRUE' || r.is_active === true || r.is_active === 'true',

            // Eligibility
            age_requirements: (r.age_requirements || null) as string | null,
            nationality_restrictions: (r.nationality_restrictions || null) as string | null,
            language_requirements: (r.language_requirements || null) as string | null,
            applicants_inside_china: (r.applicants_inside_china || null) as string | null,

            // Financial
            registration_fee: (r.registration_fee || null) as string | null,
            application_fee_status: (r.application_fee_status || null) as string | null,
            scholarship_details: (r.scholarship_details || null) as string | null,

            // Accommodation
            accommodation_details: (r.accommodation_details || null) as string | null,
            off_campus_living: (r.off_campus_living || null) as string | null,
            
            // Accommodation Costs (Store as JSON)
            accommodation_costs: {
                single: (r.accommodation_single || null) as string | null,
                double: (r.accommodation_double || null) as string | null,
                triple: (r.accommodation_triple || null) as string | null,
                quad: (r.accommodation_quad || null) as string | null,
            },

            // Other
            processing_speed: (r.processing_speed || null) as string | null,
            
            // Default arrays/json for complex fields if missing
            academic_requirements: r.academic_requirements ? (r.academic_requirements as string).split('\n').filter(Boolean) : [],
            required_documents: r.required_documents ? (r.required_documents as string).split('\n').filter(Boolean) : [],
          }
      }).filter(item => item.title) // Ensure title exists

      if (formattedData.length === 0) {
        throw new Error("No valid data found to import.")
      }
      
      // Check for missing universities
      const missingUniCount = formattedData.filter(i => !i.university_id).length
      if (missingUniCount > 0) {
          if (!confirm(`${missingUniCount} programs have university names that don't match our database. They will be imported without a university link. Continue?`)) {
              setIsUploading(false)
              return
          }
      }

      const { error: uploadError } = await supabase
        .from('programs')
        .insert(formattedData)

      if (uploadError) throw uploadError

      toast.success(`Successfully imported ${formattedData.length} programs`)
      setOpen(false)
      setFile(null)
      setPreviewData([])
      
      // Force refresh the page data
      router.refresh()
    } catch (err) {
      console.error(err)
      setError((err as Error).message || "Failed to upload data to the database.")
      toast.error("Import failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Programs</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx, .xls) to bulk import programs.
            <br />
            Required column: <strong>title</strong>
            <br />
            Important columns: <strong>university</strong> (must match existing university name), level, tuition_fee, deadline
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-dashed">
             <div className="text-sm text-muted-foreground">
                <p>Need a starting point?</p>
                <p>Download our sample template.</p>
             </div>
             <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" /> Download Template
             </Button>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">Excel File</Label>
            <Input id="file" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewData.length > 0 && !error && (
            <div className="space-y-2">
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Ready to Import</AlertTitle>
                    <AlertDescription>
                        Found <strong>{previewData.length}</strong> records.
                    </AlertDescription>
                </Alert>
                <div className="max-h-[200px] overflow-auto border rounded-md text-sm">
                    <table className="w-full text-left p-2">
                        <thead className="bg-muted sticky top-0">
                            <tr>
                                <th className="p-2">Title</th>
                                <th className="p-2">University (Excel)</th>
                                <th className="p-2">Match Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.slice(0, 5).map((row, i) => {
                                const r = row as Record<string, unknown>
                                const uniName = (r.university || r.University || r.school || r.School) as string
                                const isMatched = !!findUniversityId(uniName)
                                return (
                                <tr key={i} className="border-b">
                                    <td className="p-2">{(r.title || r.Title) as string}</td>
                                    <td className="p-2">{uniName || '-'}</td>
                                    <td className="p-2">
                                        {isMatched ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Matched</span>
                                        ) : (
                                            <span className="text-amber-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Not Found</span>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={!file || previewData.length === 0 || isUploading}>
            {isUploading ? "Importing..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
