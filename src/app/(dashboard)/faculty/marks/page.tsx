"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"
import * as XLSX from "xlsx"

export default function UploadMarksPage() {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
        setFile(selectedFile)
        parseExcel(selectedFile)
    }
  }

  const parseExcel = (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
          const ab = e.target?.result
          const wb = XLSX.read(ab, { type: 'array' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const jsonData = XLSX.utils.sheet_to_json(ws)
          setData(jsonData)
      }
      reader.readAsArrayBuffer(file)
  }

  const handleUpload = async () => {
      setIsUploading(true)
      // Mock API call to save data
      setTimeout(() => {
          setIsUploading(false)
          setUploadStatus("success")
          // In real app, POST to /api/faculty/marks/upload
      }, 2000)
  }

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Upload Marks</h1>
           <p className="text-gray-400 mt-1">Bulk upload student marks via Excel</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 bg-white/5 border-white/10 h-fit">
                <CardHeader>
                    <CardTitle className="text-white">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Select Course</label>
                        <Select onValueChange={setSelectedCourse}>
                            <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CSE3002">CSE3002 - Compiler Design</SelectItem>
                                <SelectItem value="SWE2001">SWE2001 - Software Engineering</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Upload File</label>
                         <div 
                            className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                         >
                            <FileSpreadsheet className="w-8 h-8 text-green-500 mb-2" />
                            <span className="text-sm text-gray-300 text-center">
                                {file ? file.name : "Click to select Excel file"}
                            </span>
                            <input 
                                type="file" 
                                accept=".xlsx, .xls" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!file || !selectedCourse || isUploading}
                        onClick={handleUpload}
                    >
                        {isUploading ? "Uploading..." : "Commit to Database"}
                    </Button>

                    {uploadStatus === 'success' && (
                        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 p-3 rounded border border-green-500/20">
                            <CheckCircle className="w-4 h-4" />
                            Marks updated successfully!
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Preview Data</CardTitle>
                    <CardDescription>Review the parsed data before uploading.</CardDescription>
                </CardHeader>
                <CardContent>
                    {data.length > 0 ? (
                        <div className="rounded-md border border-white/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        {Object.keys(data[0]).map((key) => (
                                            <TableHead key={key} className="text-gray-300">{key}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.slice(0, 10).map((row, i) => (
                                        <TableRow key={i} className="border-white/10 hover:bg-white/5">
                                            {Object.values(row).map((val: any, j) => (
                                                <TableCell key={j} className="text-gray-300">{val}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {data.length > 10 && (
                                <div className="p-2 text-center text-xs text-gray-500 bg-black/20">
                                    Showing first 10 rows of {data.length}
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                            <Upload className="w-8 h-8 mb-2 opacity-50" />
                            <p>No data to preview</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
