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
import { 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle, 
  Download, 
  ArrowRight, 
  ArrowLeft,
  Loader2
} from "lucide-react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  getSimilarity, 
  mapHeader, 
  extractFieldsFromText 
} from "@/lib/import-utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type ImportStep = 'upload' | 'preview' | 'importing' | 'success';

const parseGroupedText = (text: string | null | undefined): Record<string, string> => {
  if (!text) return {}
  // Normalize line endings and handle both \n and \r\n
  const normalized = text.replace(/\r\n/g, '\n')
  
  // Split by newline first, then handle multi-pair lines
  const lines = normalized.split('\n').map(l => l.trim()).filter(l => !!l)
  const obj: Record<string, string> = {}
  
  lines.forEach(line => {
    // Look for colon
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      
      if (key && value) {
        // Handle multiple key-value pairs on one line (e.g. "Key1: Val1 Key2: Val2")
        const nextKeyMatch = value.match(/\s+([A-Za-z][A-Za-z\s]+):/);
        if (nextKeyMatch && nextKeyMatch.index !== undefined) {
          const actualValue = value.substring(0, nextKeyMatch.index).trim();
          const remaining = value.substring(nextKeyMatch.index).trim();
          obj[key] = actualValue;
          Object.assign(obj, parseGroupedText(remaining));
        } else {
          if (obj[key]) {
            obj[key] = `${obj[key]} / ${value}`;
          } else {
            obj[key] = value;
          }
        }
      }
    } else if (line.length > 0) {
      // Fallback for lines without colons
      if (line.length < 30 && !obj['Info']) {
         obj['Note'] = line
      }
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
  const lower = level.toLowerCase()
  if (lower.includes('bach')) return 'Bachelor'
  if (lower.includes('mast')) return 'Master'
  if (lower.includes('doct') || lower.includes('phd')) return 'PhD'
  if (lower.includes('lang')) return 'Language'
  if (lower.includes('camp')) return 'Camp'
  if (lower.includes('high')) return 'High School'
  if (lower.includes('vocational')) return 'Secondary Vocational Education'
  if (lower.includes('college')) return 'College'
  if (lower.includes('top-up')) return 'Top-up program'
  return 'Bachelor'
}


interface ProgramRow {
  id_in_file?: number;
  title: string;
  program_id_code: string | null;
  university_id: string | null;
  scholarship_id: string | null;
  level: string;
  location: string | null;
  duration: string | null;
  tuition_fee: string | null;
  description: string | null;
  language: string;
  intake: string | null;
  application_deadline: string | null;
  requirements: string | null;
  required_documents: string[] | null;
  is_active: boolean;
  general_info: Record<string, string>;
  fee_structure: Record<string, string>;
  scholarship_details: string | null;
  additional_info: string | null;
  accommodation_details: string | null;
  registration_fee: string | null;
  application_fee_status: string | null;
  
  // UI status fields
  _rawUniName?: string;
  _matchStatus?: 'exact' | 'fuzzy' | 'none';
  _suggestedUniId?: string;
  _rawScholarshipName?: string;
  _scholarshipMatchStatus?: 'exact' | 'fuzzy' | 'none';
}

export function ProgramImporter() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<ImportStep>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<ProgramRow[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [universities, setUniversities] = useState<{id: string, name: string, location: string | null}[]>([])
  const [scholarships, setScholarships] = useState<{id: string, name: string}[]>([])
  
  const router = useRouter()
  const supabase = createClient()

  // Fetch universities and scholarships for mapping
  useEffect(() => {
    const fetchData = async () => {
        const [uniRes, scholarshipRes] = await Promise.all([
          supabase.from('universities').select('id, name, location'),
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
        "Program Name": "Bachelor of Computer Science",
        "Program ID": "CS-ZJU-001",
        "University": "Zhejiang University",
        "Level": "Bachelor",
        "Tuition Fee": "20,000 RMB/Year",
        "Duration": "4 Years",
        "Language": "English",
        "Deadline": "2025-06-30",
        "Details (General Info)": "High-ranking CS program.",
        "About the Program": "This comprehensive Computer Science program covers AI, Software Engineering, and more.",
        "Entry Requirements": "High school diploma with good math grades.\nIELTS 6.0 or equivalent.",
        "Required Documents": "Passport copy\nHigh School Transcript\nGraduation Certificate\nLanguage Proficiency Certificate",
        "Fee Structure Details": "Registration: 400 RMB\nAccommodation: 12000 RMB/Year",
        "Scholarship Type": "Full Scholarship",
        "Scholarship Details": "Covers tuition, registration, and monthly stipend.",
        "Additional Information": "This is a priority program for international students."
      },
      {
        "Program Name": "MBBS (Medicine)",
        "Program ID": "MED-SOU-003",
        "University": "Southeast University",
        "Level": "Bachelor",
        "Tuition Fee": "", 
        "Duration": "", 
        "Language": "English",
        "Deadline": "2025-07-15",
        "Details (General Info)": "Duration: 6 Years.\r\nTuition: 30,000 RMB/Year.",
        "About the Program": "A leading medical program for international students.",
        "Entry Requirements": "Strong background in Biology and Chemistry.\nAge 18-25.",
        "Required Documents": "Passport\nTranscripts\nPersonal Statement",
        "Fee Structure Details": "Registration: 600 RMB",
        "Scholarship Type": "None",
        "Scholarship Details": "Self-funded program."
      },
      {
        "Program Name": "Chinese Language Program",
        "Program ID": "LANG-BLCU-004",
        "University": "Beijing Language Uni", 
        "Level": "Language",
        "Tuition Fee": "15,000 RMB/Year",
        "Duration": "1 Year",
        "Language": "Chinese+",
        "Deadline": "2025-08-01",
        "Details (General Info)": "Intensive Chinese language for international students.",
        "Fee Structure Details": "Registration: 800 RMB"
      },
      {
        "Program Name": "Artificial Intelligence MBA",
        "Program ID": "MBA-THU-005",
        "University": "Tsinghua University",
        "Level": "Master",
        "Tuition Fee": "45,000 RMB/Year",
        "Duration": "2 Years",
        "Language": "English",
        "Deadline": "2025-04-30",
        "Details (General Info)": "Focus on AI business applications.\nDegree required.",
        "Fee Structure Details": "Accommodation: 20000 RMB/Year"
      }
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)
    
    // Set column widths
    const wscols = [
      { wch: 35 }, // title
      { wch: 15 }, // program_id_code
      { wch: 35 }, // university
      { wch: 15 }, // level
      { wch: 20 }, // tuition
      { wch: 15 }, // duration
      { wch: 15 }, // language
      { wch: 15 }, // deadline
      { wch: 40 }, // general
      { wch: 40 }, // description/about
      { wch: 40 }, // requirements
      { wch: 40 }, // documents
      { wch: 40 }, // fees
      { wch: 25 }, // scholarship type
      { wch: 40 }, // scholarship details
      { wch: 40 }, // additional info
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
        const rawData = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]
        
        if (rawData.length === 0) {
          setError("The file appears to be empty.")
          return
        }

        processRows(rawData)
      } catch (err) {
        console.error(err)
        setError("Failed to parse the file. Please ensure it is a valid Excel file.")
      }
    }
    reader.readAsBinaryString(file)
  }

  const processRows = (rows: Record<string, unknown>[]) => {
    // Filter out truly empty rows (where most common fields are missing)
    const validRows = rows.filter(row => {
      const hasTitle = row['Program Name'] || row['title'] || row['Program Title']
      const hasUni = row['University'] || row['university_id']
      return !!(hasTitle || hasUni)
    })

    const processed: ProgramRow[] = validRows.map((row, index) => {
      const mappedRow: Record<string, unknown> = {}
      
      // 1. Smart Header Mapping
      Object.entries(row).forEach(([header, value]) => {
        const field = mapHeader(header)
        if (field) {
          mappedRow[field] = value
        } else {
          // Keep unmapped data in a general pool for extraction
          mappedRow[`_raw_${header}`] = value
        }
      })

      // 2. Data Extraction from text blocks
      // Merge all text values to search for missing fields
      const textPool = Object.values(row).join(" ")
      const extracted = extractFieldsFromText(textPool)
      
      const title = safeString(mappedRow.title) || ""
      const rawUniName = safeString(mappedRow.university_id) || ""
      
      // 3. Fuzzy match university
      let uniId: string | null = null
      let matchStatus: 'exact' | 'fuzzy' | 'none' = 'none'
      let suggestedUniId: string | undefined

      if (rawUniName) {
        // Exact match
        const exact = universities.find(u => u.name.toLowerCase() === rawUniName.toLowerCase())
        if (exact) {
          uniId = exact.id
          matchStatus = 'exact'
        } else {
          // Fuzzy match
          const matches = universities.map(u => ({
            id: u.id,
            similarity: getSimilarity(rawUniName, u.name)
          })).sort((a, b) => b.similarity - a.similarity)

          if (matches[0] && matches[0].similarity > 0.8) {
            const match = universities.find(u => u.id === matches[0].id)
            suggestedUniId = matches[0].id
            matchStatus = 'fuzzy'
            if (match) uniId = match.id // Set uniId for fuzzy matches too to enable location lookup below
          }
        }
      }

      const matchedUni = universities.find(u => u.id === (uniId || suggestedUniId))

      const scholarshipName = safeString(mappedRow.scholarship_id)
      let scholarshipId: string | null = null
      let scholarshipMatchStatus: 'exact' | 'fuzzy' | 'none' = 'none'

      if (scholarshipName) {
        // Exact match
        const exact = scholarships.find(s => s.name.toLowerCase() === scholarshipName.toLowerCase())
        if (exact) {
          scholarshipId = exact.id
          scholarshipMatchStatus = 'exact'
        } else {
          // Fuzzy match
          const matches = scholarships.map(s => ({
            id: s.id,
            similarity: getSimilarity(scholarshipName, s.name)
          })).sort((a, b) => b.similarity - a.similarity)

          if (matches[0] && matches[0].similarity > 0.8) {
            scholarshipId = matches[0].id
            scholarshipMatchStatus = 'fuzzy'
          }
        }
      }

      const fee_structure = parseGroupedText(safeString(mappedRow.fee_structure))
      const general_info = parseGroupedText(safeString(mappedRow.general_info || mappedRow.description))

      return {
        id_in_file: index,
        title,
        program_id_code: safeString(mappedRow.program_id_code),
        university_id: uniId || suggestedUniId || null,
        scholarship_id: scholarshipId,
        level: mapLevel(safeString(mappedRow.level)),
        location: safeString(mappedRow.location) || extracted.location || matchedUni?.location || null,
        duration: safeString(mappedRow.duration) || extracted.duration || null,
        tuition_fee: safeString(mappedRow.tuition_fee) || extracted.tuition_fee || null,
        description: safeString(mappedRow.description),
        language: safeString(mappedRow.language) || extracted.language || 'English',
        intake: safeString(mappedRow.intake) || extracted.intake || 'September',
        application_deadline: safeString(mappedRow.application_deadline),
        requirements: safeString(mappedRow.requirements),
        required_documents: safeString(mappedRow.required_documents) 
          ? safeString(mappedRow.required_documents)!.split('\n').map(s => s.trim()).filter(s => !!s)
          : null,
        is_active: true,
        scholarship_details: safeString(mappedRow.scholarship_details),
        additional_info: safeString(mappedRow.additional_info),
        accommodation_details: safeString(mappedRow.accommodation_details) || fee_structure['Accommodation'] || fee_structure['accommodation'] || null,
        registration_fee: safeString(mappedRow.registration_fee) || fee_structure['Registration'] || fee_structure['registration'] || null,
        application_fee_status: safeString(mappedRow.application_fee_status),
        fee_structure, // Use the parsed object
        general_info,
        
        _rawUniName: rawUniName,
        _matchStatus: matchStatus,
        _suggestedUniId: suggestedUniId,
        _rawScholarshipName: scholarshipName || undefined,
        _scholarshipMatchStatus: scholarshipMatchStatus
      }
    })

    setPreviewData(processed)
    setStep('preview')
  }

  const handleUpdateRow = (index: number, field: keyof ProgramRow, value: string | null | boolean | Record<string, string>) => {
    setPreviewData(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleImport = async () => {
    if (previewData.length === 0) return

    setIsUploading(true)
    setStep('importing')
    setError(null)

    try {
      const formattedData = previewData.map((row) => ({
        title: row.title,
        program_id_code: row.program_id_code,
        university_id: row.university_id,
        scholarship_id: row.scholarship_id,
        level: row.level,
        location: row.location,
        duration: row.duration,
        tuition_fee: row.tuition_fee,
        description: row.description,
        language: row.language,
        intake: row.intake,
        application_deadline: row.application_deadline,
        requirements: row.requirements,
        required_documents: row.required_documents,
        is_active: row.is_active,
        general_info: row.general_info,
        fee_structure: row.fee_structure,
        scholarship_details: row.scholarship_details,
        additional_info: row.additional_info,
        accommodation_details: row.accommodation_details,
        registration_fee: row.registration_fee,
        application_fee_status: row.application_fee_status
      }))

      // Use upsert to handle updates
      // We assume program_id_code OR title + university_id handles conflicts
      // Since Supabase usually requires a single unique constraint for upsert onConflict,
      // we'll loop or use multiple upserts if needed, but standard is title + university_id.
      
      const { error: uploadError } = await supabase
        .from('programs')
        .upsert(formattedData, { 
          onConflict: 'program_id_code,title,university_id', 
          ignoreDuplicates: false 
        })

      if (uploadError) {
        // Fallback if the combined conflict fails
        console.warn("Combined upsert failed, trying standard insert...", uploadError)
        const { error: insertError } = await supabase.from('programs').upsert(formattedData)
        if (insertError) throw insertError
      }

      setStep('success')
      toast.success(`Successfully processed ${formattedData.length} programs`)
      
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error(err)
      setError((err as Error).message || "Failed to upload data to the database.")
      setStep('preview')
      toast.error("Import failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v)
      if (!v) {
        setStep('upload')
        setFile(null)
        setPreviewData([])
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className={step === 'preview' ? "sm:max-w-[900px] max-h-[90vh] flex flex-col" : "sm:max-w-[600px]"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'upload' && "1. Upload Programs File"}
            {step === 'preview' && "2. Review & Match Data"}
            {step === 'importing' && "3. Importing Data"}
            {step === 'success' && "Import Complete"}
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && "Upload an Excel file. We'll automatically match columns and universities."}
            {step === 'preview' && `Review the ${previewData.length} programs found. You can fix university matches below.`}
            {step === 'importing' && "Please wait while we process and save your data..."}
            {step === 'success' && "Your programs have been successfully imported and updated."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="space-y-1">
                  <p className="font-semibold text-blue-900">Need the template?</p>
                  <p className="text-sm text-blue-700">Download our simplified Excel format.</p>
                </div>
                <Button variant="outline" className="bg-white" onClick={handleDownloadTemplate}>
                  <Download className="mr-2 h-4 w-4" /> Template
                </Button>
              </div>

              <div className="grid w-full items-center gap-4 p-8 border-2 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-slate-50/50">
                <div className="flex flex-col items-center gap-2 text-center">
                  <FileSpreadsheet className="h-10 w-10 text-slate-400" />
                  <Label htmlFor="file" className="text-lg font-medium cursor-pointer">
                    {file ? file.name : "Click to select or drag and drop"}
                  </Label>
                  <p className="text-xs text-muted-foreground">Supported formats: .xlsx, .xls</p>
                </div>
                <Input 
                  id="file" 
                  type="file" 
                  className="hidden" 
                  accept=".xlsx, .xls" 
                  onChange={handleFileChange} 
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="border rounded-xl overflow-hidden bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-3 text-left font-medium">Program Title</th>
                      <th className="p-3 text-left font-medium">University Match</th>
                      <th className="p-3 text-left font-medium">Scholarship</th>
                      <th className="p-3 text-left font-medium">Tuition/Info</th>
                      <th className="p-3 text-center font-medium w-[80px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previewData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <Input 
                            value={row.title} 
                            onChange={(e) => handleUpdateRow(i, 'title', e.target.value)}
                            className="h-8 text-xs font-medium"
                          />
                          <div className="text-[10px] text-muted-foreground mt-1 opacity-60">
                            {row.program_id_code || "No ID"} • {row.level}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1.5">
                            <Select 
                              value={row.university_id || "none"} 
                              onValueChange={(val) => handleUpdateRow(i, 'university_id', val === "none" ? null : val)}
                            >
                              <SelectTrigger className={`h-8 text-xs ${!row.university_id ? 'border-amber-200 bg-amber-50/30' : ''}`}>
                                <SelectValue placeholder="Select University" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-- No Match --</SelectItem>
                                {universities.map(u => (
                                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1.5 px-1">
                              <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                Excel: {row._rawUniName || "(empty)"}
                              </span>
                              {row._matchStatus === 'fuzzy' && (
                                <Badge variant="secondary" className="text-[9px] h-3.5 px-1 bg-amber-100 text-amber-700 hover:bg-amber-100">Fuzzy Match</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1.5">
                            <Select 
                              value={row.scholarship_id || "none"} 
                              onValueChange={(val) => handleUpdateRow(i, 'scholarship_id', val === "none" ? null : val)}
                            >
                              <SelectTrigger className={`h-8 text-xs ${!row.scholarship_id && row._rawScholarshipName ? 'border-amber-200 bg-amber-50/30' : ''}`}>
                                <SelectValue placeholder="Select Scholarship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-- None / Self-funded --</SelectItem>
                                {scholarships.map(s => (
                                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1.5 px-1">
                              <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                Excel: {row._rawScholarshipName || "(empty)"}
                              </span>
                              {row._scholarshipMatchStatus === 'fuzzy' && (
                                <Badge variant="secondary" className="text-[9px] h-3.5 px-1 bg-amber-100 text-amber-700 hover:bg-amber-100">Fuzzy Match</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                         <td className="p-3">
                          <div className="space-y-1.5">
                             <div className="flex items-center gap-1 text-[11px]">
                               <Badge variant="outline" className="text-[9px] font-normal py-0">Fee</Badge>
                               <span className="truncate">{row.tuition_fee || "N/A"}</span>
                             </div>
                             <div className="flex items-center gap-1 text-[11px]">
                               <Badge variant="outline" className="text-[9px] font-normal py-0">Time</Badge>
                               <span className="truncate">{row.duration || "N/A"}</span>
                             </div>
                             <div className="flex flex-wrap gap-1 mt-1">
                                {row.description && <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-blue-50/50">Details</Badge>}
                                {row.general_info && Object.keys(row.general_info).length > 0 && <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-slate-50/50">General</Badge>}
                                {row.requirements && <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-green-50/50">Reqs</Badge>}
                                {row.required_documents && row.required_documents.length > 0 && <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-purple-50/50">Docs ({row.required_documents.length})</Badge>}
                                {row.scholarship_details && <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-amber-50/50">Scholarship</Badge>}
                                {row.accommodation_details && <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-orange-50/50">Accom</Badge>}
                                {row.registration_fee && <Badge variant="outline" className="text-[8px] h-3.5 px-1 bg-slate-50/50">RegFee</Badge>}
                             </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {!row.university_id ? (
                            <AlertCircle className="h-5 w-5 text-amber-500 mx-auto" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <p>We&apos;ve automatically extracted fees and durations from your text where possible. Review them above.</p>
                </div>
                {previewData.some(r => !r.university_id) && (
                  <div className="flex items-center gap-2 text-amber-600 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    <p>Some programs are missing a university match. Please select a university for each row to enable syncing.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 text-[#0056b3] animate-spin" />
              <div className="text-center space-y-1">
                <p className="font-medium">Saving programs to database...</p>
                <p className="text-sm text-muted-foreground">This may take a moment depending on the file size.</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-green-900">Import Successful</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {previewData.length} programs have been processed and synced.<br/>
                  Existing records were updated and new ones were added.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          {step === 'upload' && (
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          )}
          {step === 'preview' && (
            <>
              <Button variant="ghost" onClick={() => setStep('upload')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={isUploading || previewData.some(r => !r.title || !r.university_id)}
                className="bg-[#0056b3] hover:bg-[#0056b3]/90"
              >
                {previewData.some(r => !r.university_id) 
                  ? `Fix Matches to Sync` 
                  : `Sync ${previewData.length} Programs`}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
          {step === 'success' && (
            <Button onClick={() => setOpen(false)} className="bg-green-600 hover:bg-green-700">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
