"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Save, Search, Award, CheckCircle2, AlertCircle } from "lucide-react"
import { getCourseStudents, updateMarksBulk } from "@/lib/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function MarksEntryClient({ courses }: { courses: any[] }) {
  const router = useRouter()
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "")
  const [students, setStudents] = useState<any[]>([])
  const [marks, setMarks] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (selectedCourseId) {
      loadStudents()
    }
  }, [selectedCourseId])

  const loadStudents = async () => {
    const data = await getCourseStudents(selectedCourseId)
    setStudents(data)
    
    // Initialize marks from existing data or defaults
    const initial: Record<string, any> = {}
    data.forEach((s: any) => {
        const studentMarks = s.marks?.[0] || {}
        initial[s.id] = {
            cat1: studentMarks.cat1 || 0,
            cat2: studentMarks.cat2 || 0,
            fat: studentMarks.fat || 0,
            da1: studentMarks.da1 || 0,
            da2: studentMarks.da2 || 0,
            quiz: studentMarks.quiz || 0
        }
    })
    setMarks(initial)
  }

  const handleMarkChange = (studentId: string, field: string, value: string) => {
    const numValue = parseInt(value) || 0
    setMarks(prev => ({
        ...prev,
        [studentId]: {
            ...prev[studentId],
            [field]: numValue
        }
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
        const marksData = Object.entries(marks).map(([studentId, data]) => ({
            studentId,
            ...data
        }))
        await updateMarksBulk(selectedCourseId, marksData)
        toast.success("Marks updated successfully!")
        router.refresh()
    } catch (error) {
        toast.error("Failed to update marks")
    } finally {
        setIsSubmitting(false)
    }
  }

  const filteredStudents = students.filter(s => 
    s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-[#0A0A0B]/80 border-white/10 h-fit">
            <CardHeader>
                <CardTitle className="text-white text-lg uppercase font-black italic tracking-tight">Active Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {courses.map(c => (
                    <div 
                        key={c.id} 
                        onClick={() => setSelectedCourseId(c.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedCourseId === c.id ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/40' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                    >
                        <h4 className="text-white font-black text-sm uppercase italic">{c.title}</h4>
                        <p className={`text-[10px] font-bold mt-1 ${selectedCourseId === c.id ? 'text-indigo-100' : 'text-gray-500'}`}>{c.code} • {c.slot}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-[#0A0A0B]/80 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <CardTitle className="text-white text-lg uppercase font-black italic tracking-tight">Marks Entry Matrix</CardTitle>
                    <CardDescription className="text-[10px] text-gray-500 font-bold uppercase">{filteredStudents.length} Students List</CardDescription>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                        placeholder="Search student profile..." 
                        className="pl-10 h-10 bg-black/40 border-white/10 text-white text-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-6">Student</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CAT-1 (50)</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CAT-2 (50)</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">DA 1/2 (20)</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quiz (10)</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 pr-6 text-right">FAT (100)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id} className="border-white/5 hover:bg-white/[0.01] transition-all">
                                    <TableCell className="pl-6">
                                        <div className="flex flex-col py-2">
                                            <span className="text-white font-black text-xs uppercase italic">{student.user.name}</span>
                                            <span className="text-[9px] text-gray-600 font-bold uppercase">{student.regNo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            className="w-16 h-8 bg-white/5 border-white/10 text-white text-center font-black italic"
                                            value={marks[student.id]?.cat1 || 0}
                                            onChange={(e) => handleMarkChange(student.id, 'cat1', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            className="w-16 h-8 bg-white/5 border-white/10 text-white text-center font-black italic"
                                            value={marks[student.id]?.cat2 || 0}
                                            onChange={(e) => handleMarkChange(student.id, 'cat2', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Input 
                                                type="number" 
                                                className="w-12 h-8 bg-white/5 border-white/10 text-white text-center text-[10px]"
                                                value={marks[student.id]?.da1 || 0}
                                                onChange={(e) => handleMarkChange(student.id, 'da1', e.target.value)}
                                            />
                                            <Input 
                                                type="number" 
                                                className="w-12 h-8 bg-white/5 border-white/10 text-white text-center text-[10px]"
                                                value={marks[student.id]?.da2 || 0}
                                                onChange={(e) => handleMarkChange(student.id, 'da2', e.target.value)}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            className="w-14 h-8 bg-white/5 border-white/10 text-white text-center text-[10px]"
                                            value={marks[student.id]?.quiz || 0}
                                            onChange={(e) => handleMarkChange(student.id, 'quiz', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <Input 
                                            type="number" 
                                            className="w-20 h-8 ml-auto bg-indigo-500/10 border-indigo-500/20 text-indigo-400 text-center font-black italic"
                                            value={marks[student.id]?.fat || 0}
                                            onChange={(e) => handleMarkChange(student.id, 'fat', e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <p className="text-[10px] text-gray-500 uppercase font-black italic tracking-widest max-w-md">
                        Warning: Grade calculation algorithms will execute immediately upon commit. High-security session active.
                    </p>
                    <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || students.length === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest px-8 h-11 rounded-xl shadow-xl shadow-indigo-600/20"
                    >
                        {isSubmitting ? "Processing Matrix..." : <><Save className="w-4 h-4 mr-2" /> Commit Batch to ERP</>}
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
