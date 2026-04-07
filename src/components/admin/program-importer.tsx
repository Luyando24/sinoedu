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
  const [scholarships, setScholarships] = useState<{id: string, name: string}[]>([])
  
  const router = useRouter()
  const supabase = createClient()

  // Fetch universities and scholarships for mapping
  useEffect(() => {
    const fetchData = async () => {
        const [uniRes, scholarshipRes] = await Promise.all([
          supabase.from('universities').select('id, name'),
          supabase.from('scholarships').select('id, name')
        ])
        if (uniRes.data) setUniversities(uniRes.data)
        if (scholarshipRes.data) setScholarships(scholarshipRes.data)
    }
    if (open) fetchData()
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
        
        // Grouped Info
        general_info: "School rank: Top 50 in China\nAge limit: 18-25\nDeadline: June 30, 2025\nLanguage requirements: IELTS 6.0\nGrade requirements: Over 75%\nNationality restrictions: None\nAdmission process: Document review + Interview",
        fee_structure: "Tuition: 20000 RMB/Year\nRegistration: 400 RMB\nAccommodation Single: 12000 RMB/Year\nAccommodation Double: 6000 RMB/Year",
        
        scholarship_type: "CSC Scholarship", // Must match existing scholarship name
        scholarship_details: "Full scholarship available for top students",
        
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

        general_info: "School rank: Famous for Language\nAge limit: 22-40\nDeadline: May 15, 2025\nLanguage requirements: IELTS 6.5\nGrade requirements: Over 80%\nNationality restrictions: None\nAdmission process: Document review",
        fee_structure: "Tuition: 30000 RMB/Year\nRegistration: 800 RMB\nAccommodation Single: 15000 RMB/Year\nAccommodation Double: 8000 RMB/Year",

        scholarship_type: "Provincial Scholarship",
        scholarship_details: "Partial scholarship available",

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
      { wch: 50 }, // general_info
      { wch: 50 }, // fee_structure
      { wch: 20 }, // scholarship_type
      { wch: 30 }, // scholarship_details
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
    saveAs(data, "program_import_template_v2.xlsx")
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

  const findScholarshipId = (name: string): string | null => {
      if (!name) return null
      const match = scholarships.find(s => s.name.toLowerCase() === name.toLowerCase())
      return match ? match.id : null
  }

  const parseGroupedText = (text: string | null | undefined): Record<string, string> => {
    if (!text) return {}
    const lines = text.split('\n')
    const obj: Record<string, string> = {}
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        obj[key.trim()] = valueParts.join(':').trim()
      }
    })
    return obj
  }

  const safeString = (val: unknown): string | null => {
    if (typeof val === 'string') return val.trim()
    if (val !== null && val !== undefined) return String(val).trim()
    return null
  }

  const mapLevel = (level: string | null): string => {
    if (!level) return 'Bachelor'
    
    const validLevels = [
      'Bachelor', 
      'Master', 
      'Doctor', 
      'PhD', 
      'Masters', 
      'High School', 
      'Top-up program',
      'Language', 
      'Camp',
      'Long-term Language', 
      'College', 
      'Secondary Vocational Education'
    ];
    
    // Case-insensitive exact match
    const exactMatch = validLevels.find(l => l.toLowerCase() === level.toLowerCase());
    if (exactMatch) return exactMatch;
    
    // Mapping legacy or common variations
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('senior high')) return 'Top-up program';
    if (lowerLevel.includes('short-term') || lowerLevel.includes('short term')) return 'Camp';
    if (lowerLevel.includes('long-term') || lowerLevel.includes('long term')) return 'Long-term Language';
    if (lowerLevel.includes('ph.d')) return 'PhD';
    if (lowerLevel.includes('vocational')) return 'Secondary Vocational Education';
    
    return 'Bachelor'; // Fallback
  }

  const handleImport = async () => {
    if (previewData.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const formattedData = previewData.map((row) => {
          const r = row as Record<string, unknown>
          const uniName = safeString(r.university || r.University || r.school || r.School)
          const uniId = uniName ? findUniversityId(uniName) : null
          const scholarshipName = safeString(r.scholarship_type || r.ScholarshipType || r.scholarship || r.Scholarship)
          const scholarshipId = scholarshipName ? findScholarshipId(scholarshipName) : null

          return {
            title: safeString(r.title || r.Title || r.Program),
            program_id_code: safeString(r.program_id_code || r.Code),
            university_id: uniId,
            scholarship_id: scholarshipId,
            level: mapLevel(safeString(r.level || r.Level)),
            location: safeString(r.location || r.Location),
            duration: safeString(r.duration || r.Duration),
            tuition_fee: safeString(r.tuition_fee || r.Tuition),
            description: safeString(r.description || r.Description),
            requirements: safeString(r.requirements || r.Requirements),
            language: safeString(r.language || r.Language) || 'English',
            intake: safeString(r.intake || r.Intake),
            application_deadline: safeString(r.application_deadline || r.Deadline),
            is_active: r.is_active === 'TRUE' || r.is_active === true || r.is_active === 'true',

            // New grouped columns
            general_info: parseGroupedText(safeString(r.general_info)),
            fee_structure: parseGroupedText(safeString(r.fee_structure)),

            // Preserve old columns for now if present in Excel
            age_requirements: safeString(r.age_requirements),
            nationality_restrictions: safeString(r.nationality_restrictions),
            language_requirements: safeString(r.language_requirements),
            applicants_inside_china: safeString(r.applicants_inside_china),

            // Financial
            registration_fee: safeString(r.registration_fee),
            application_fee_status: safeString(r.application_fee_status),
            scholarship_details: safeString(r.scholarship_details),

            // Accommodation
            accommodation_details: safeString(r.accommodation_details),
            off_campus_living: safeString(r.off_campus_living),
            
            accommodation_costs: {
                single: safeString(r.accommodation_single),
                double: safeString(r.accommodation_double),
                triple: safeString(r.accommodation_triple),
                quad: safeString(r.accommodation_quad),
            },

            // Other
            processing_speed: safeString(r.processing_speed),
            
            academic_requirements: r.academic_requirements ? safeString(r.academic_requirements)?.split('\n').filter(Boolean) || [] : [],
            required_documents: r.required_documents ? safeString(r.required_documents)?.split('\n').filter(Boolean) || [] : [],
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
