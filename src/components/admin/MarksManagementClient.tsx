"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trophy, Search, Edit2, Loader2, Check, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateMarks } from "@/lib/admin-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Marks = {
  id: string
  studentId: string
  courseId: string
  cat1: number | null
  cat2: number | null
  fat: number | null
  da1: number | null
  da2: number | null
  quiz: number | null
  pbl: number | null
  total: number | null
  grade: string | null
  student: {
    regNo: string
    user: { name: string }
  }
  course: {
    code: string
    title: string
  }
}

export function MarksManagementClient({ initialMarks }: { initialMarks: Marks[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMarks, setSelectedMarks] = useState<Marks | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    cat1: 0,
    cat2: 0,
    fat: 0,
    da1: 0,
    da2: 0,
    quiz: 0,
    pbl: 0,
    total: 0,
    grade: ""
  })

  const filteredMarks = initialMarks.filter((m: Marks) => 
    m.student.regNo.toLowerCase().includes(search.toLowerCase()) ||
    m.student.user.name.toLowerCase().includes(search.toLowerCase()) ||
    m.course.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = async () => {
    if (!selectedMarks) return
    setIsLoading(true)
    try {
      await updateMarks(selectedMarks.id, formData)
      toast.success("Marks updated successfully!")
      setEditDialogOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update marks")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (m: Marks) => {
    setSelectedMarks(m)
    setFormData({
      cat1: m.cat1 || 0,
      cat2: m.cat2 || 0,
      fat: m.fat || 0,
      da1: m.da1 || 0,
      da2: m.da2 || 0,
      quiz: m.quiz || 0,
      pbl: m.pbl || 0,
      total: m.total || 0,
      grade: m.grade || ""
    })
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" /> Grade Registry
          </h1>
          <p className="text-gray-400 mt-1">Master grade ledger and assessment control</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Assessment Records ({filteredMarks.length})</CardTitle>
              <CardDescription>Direct grade overrides and auditing</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search student or course..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-black/20 border-white/10 text-white w-[300px]" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-300">Student</TableHead>
                  <TableHead className="text-gray-300">Course</TableHead>
                  <TableHead className="text-gray-300 text-center">CAT-1</TableHead>
                  <TableHead className="text-gray-300 text-center">CAT-2</TableHead>
                  <TableHead className="text-gray-300 text-center">FAT</TableHead>
                  <TableHead className="text-gray-300 text-center">Total</TableHead>
                  <TableHead className="text-gray-300">Grade</TableHead>
                  <TableHead className="text-gray-300 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMarks.map((m: Marks) => (
                  <TableRow key={m.id} className="border-white/10 hover:bg-white/5 transition-colors group">
                    <TableCell>
                      <div>
                        <p className="text-white font-bold text-sm">{m.student.user.name}</p>
                        <p className="text-[10px] text-amber-500 font-bold uppercase">{m.student.regNo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-gray-300 text-xs truncate max-w-[150px]">{m.course.title}</p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase">{m.course.code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs text-gray-400">{m.cat1 || 0}</TableCell>
                    <TableCell className="text-center font-mono text-xs text-gray-400">{m.cat2 || 0}</TableCell>
                    <TableCell className="text-center font-mono text-xs text-gray-400">{m.fat || 0}</TableCell>
                    <TableCell className="text-center font-bold text-sm text-white">{m.total || 0}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "bg-opacity-20 border w-8 h-8 flex items-center justify-center p-0 rounded-lg",
                        m.grade === 'S' ? 'bg-emerald-500 text-emerald-400 border-emerald-500/30' : 
                        m.grade === 'A' ? 'bg-blue-500 text-blue-400 border-blue-500/30' :
                        m.grade === 'F' ? 'bg-rose-500 text-rose-400 border-rose-500/30' :
                        'bg-gray-500 text-gray-400 border-gray-500/30'
                      )}>
                        {m.grade || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-amber-500/10 hover:text-amber-500 h-8 w-8"
                        onClick={() => openEditDialog(m)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-2xl shadow-2xl shadow-amber-500/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               <GraduationCap className="w-5 h-5 text-amber-500" /> Override Assessment: {selectedMarks?.student.regNo}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Directly modify the marks for <strong>{selectedMarks?.course.title}</strong>. 
              Recalculation will occur on the user terminal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-6 py-6">
            <div className="space-y-4">
               <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-600">Core Assessments</h4>
               <div className="space-y-2">
                  <Label className="text-xs">CAT-1 (50)</Label>
                  <Input type="number" value={formData.cat1} onChange={e => setFormData({...formData, cat1: Number(e.target.value)})} className="bg-white/5 border-white/10" />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs">CAT-2 (50)</Label>
                  <Input type="number" value={formData.cat2} onChange={e => setFormData({...formData, cat2: Number(e.target.value)})} className="bg-white/5 border-white/10" />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs">FAT (100)</Label>
                  <Input type="number" value={formData.fat} onChange={e => setFormData({...formData, fat: Number(e.target.value)})} className="bg-white/5 border-white/10" />
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-600">Continuous Evaluation</h4>
               <div className="space-y-2">
                  <Label className="text-xs">DA-1 (10)</Label>
                  <Input type="number" value={formData.da1} onChange={e => setFormData({...formData, da1: Number(e.target.value)})} className="bg-white/5 border-white/10" />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs">DA-2 (10)</Label>
                  <Input type="number" value={formData.da2} onChange={e => setFormData({...formData, da2: Number(e.target.value)})} className="bg-white/5 border-white/10" />
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                     <Label className="text-xs">Quiz (10)</Label>
                     <Input type="number" value={formData.quiz} onChange={e => setFormData({...formData, quiz: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-xs">PBL (20)</Label>
                     <Input type="number" value={formData.pbl} onChange={e => setFormData({...formData, pbl: Number(e.target.value)})} className="bg-white/5 border-white/10" />
                  </div>
               </div>
            </div>

            <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
               <h4 className="text-[10px] uppercase font-black tracking-widest text-amber-500">Final Attribution</h4>
               <div className="space-y-2">
                  <Label className="text-xs">Total Aggregate</Label>
                  <Input type="number" value={formData.total} onChange={e => setFormData({...formData, total: Number(e.target.value)})} className="bg-black/40 border-amber-500/20 text-amber-500 font-bold" />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs">Letter Grade</Label>
                  <Input value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value.toUpperCase()})} className="bg-black/40 border-amber-500/20 text-amber-500 font-bold" maxLength={1} />
               </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-white/10">Cancel</Button>
            <Button onClick={handleEdit} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Apply Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
