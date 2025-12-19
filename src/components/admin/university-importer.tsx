"use client"

import { useState } from "react"
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

export function UniversityImporter() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        name: "Beijing Language and Culture University",
        location: "Beijing",
        ranking: "Top 50",
        description: "A top university for Chinese language studies.",
        website_url: "http://www.blcu.edu.cn",
        established_year: "1962",
        logo_url: "https://example.com/logo.png",
        image_url: "https://example.com/campus.jpg"
      },
      {
        name: "Zhejiang University",
        location: "Hangzhou",
        ranking: "Top 5",
        description: "A prestigious research university.",
        website_url: "http://www.zju.edu.cn",
        established_year: "1897",
        logo_url: "",
        image_url: ""
      }
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)
    
    // Set column widths
    const wscols = [
      { wch: 35 }, // name
      { wch: 15 }, // location
      { wch: 10 }, // ranking
      { wch: 40 }, // description
      { wch: 25 }, // website_url
      { wch: 15 }, // established_year
      { wch: 25 }, // logo_url
      { wch: 25 }, // image_url
    ]
    ws['!cols'] = wscols

    XLSX.utils.book_append_sheet(wb, ws, "Template")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" })
    saveAs(data, "university_import_template.xlsx")
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
        if (!("name" in firstRow || "Name" in firstRow)) {
            setError("Could not find a 'name' column. Please check the file format.")
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

  const handleImport = async () => {
    if (previewData.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      // Map data to database schema
      const formattedData = previewData.map((row) => {
        const r = row as Record<string, unknown>
        return {
          name: (r.name || r.Name) as string,
          location: (r.location || r.Location || null) as string | null,
          description: (r.description || r.Description || null) as string | null,
          ranking: r.ranking ? String(r.ranking) : (r.Ranking ? String(r.Ranking) : null),
          website_url: (r.website_url || r.Website || null) as string | null,
          established_year: r.established_year ? String(r.established_year) : (r.Established ? String(r.Established) : null),
          // logo_url and image_url are harder to bulk import from excel unless they are URLs
          logo_url: (r.logo_url || r.Logo || null) as string | null,
          image_url: (r.image_url || r.Image || null) as string | null,
        }
      }).filter(item => item.name) // Ensure name exists

      if (formattedData.length === 0) {
        throw new Error("No valid data found to import.")
      }

      const { error: uploadError } = await supabase
        .from('universities')
        .insert(formattedData)

      if (uploadError) throw uploadError

      toast.success(`Successfully imported ${formattedData.length} universities`)
      setOpen(false)
      setFile(null)
      setPreviewData([])
      
      // Force refresh the page data
      router.refresh()
      
      // Optional: Add a small delay before refresh to ensure DB is consistent if needed, 
      // but router.refresh() is usually enough for server components.
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
          <DialogTitle>Import Universities</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx, .xls) to bulk import universities.
            <br />
            Required column: <strong>name</strong>
            <br />
            Optional columns: location, description, ranking, website_url
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
                                <th className="p-2">Name</th>
                                <th className="p-2">Location</th>
                                <th className="p-2">Ranking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.slice(0, 5).map((row, i) => {
                                const r = row as Record<string, unknown>
                                return (
                                <tr key={i} className="border-b">
                                    <td className="p-2">{(r.name || r.Name) as string}</td>
                                    <td className="p-2">{(r.location || r.Location) as string}</td>
                                    <td className="p-2">{(r.ranking || r.Ranking) as string}</td>
                                </tr>
                            )})}
                            {previewData.length > 5 && (
                                <tr>
                                    <td colSpan={3} className="p-2 text-center text-muted-foreground">
                                        ... and {previewData.length - 5} more
                                    </td>
                                </tr>
                            )}
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
