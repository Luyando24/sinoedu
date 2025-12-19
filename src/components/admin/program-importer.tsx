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
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from "lucide-react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ProgramImporter() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
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
        university: "Zhejiang University", // Must match existing university
        level: "Bachelor",
        location: "Hangzhou",
        duration: "4 Years",
        tuition_fee: "20,000 RMB/Year",
        description: "Comprehensive CS program taught in English.",
        requirements: "High School Diploma, IELTS 6.0",
        language: "English",
        intake: "September 2025",
        application_deadline: "2025-06-30",
        program_id_code: "CS-ZJU-001"
      },
      {
        title: "MBA",
        university: "Beijing Language and Culture University",
        level: "Masters",
        location: "Beijing",
        duration: "2 Years",
        tuition_fee: "30,000 RMB/Year",
        description: "Focus on international business management.",
        requirements: "Bachelor Degree, 2 years work experience",
        language: "English",
        intake: "September 2025",
        application_deadline: "2025-05-15",
        program_id_code: "MBA-BLCU-002"
      }
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)
    
    // Set column widths
    const wscols = [
      { wch: 30 }, // title
      { wch: 35 }, // university
      { wch: 10 }, // level
      { wch: 15 }, // location
      { wch: 10 }, // duration
      { wch: 15 }, // tuition_fee
      { wch: 40 }, // description
      { wch: 30 }, // requirements
      { wch: 10 }, // language
      { wch: 15 }, // intake
      { wch: 15 }, // application_deadline
      { wch: 15 }, // program_id_code
    ]
    ws['!cols'] = wscols

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

        setPreviewData(jsonData)
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
      const formattedData = previewData.map((row: any) => {
          const uniName = row.university || row.University || row.school || row.School
          const uniId = findUniversityId(uniName)

          return {
            title: row.title || row.Title || row.Program,
            program_id_code: row.program_id_code || row.Code || null,
            university_id: uniId,
            level: row.level || row.Level || 'Bachelor',
            location: row.location || row.Location || null,
            duration: row.duration || row.Duration || null,
            tuition_fee: row.tuition_fee || row.Tuition || null,
            description: row.description || row.Description || null,
            requirements: row.requirements || row.Requirements || null,
            language: row.language || row.Language || 'English',
            intake: row.intake || row.Intake || null,
            application_deadline: row.application_deadline || row.Deadline || null,
            
            // Default arrays/json for complex fields if missing
            academic_requirements: row.academic_requirements ? [row.academic_requirements] : [],
            required_documents: row.required_documents ? [row.required_documents] : [],
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
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to upload data to the database.")
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
                            {previewData.slice(0, 5).map((row: any, i) => {
                                const uniName = row.university || row.University || row.school || row.School
                                const isMatched = !!findUniversityId(uniName)
                                return (
                                <tr key={i} className="border-b">
                                    <td className="p-2">{row.title || row.Title}</td>
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
