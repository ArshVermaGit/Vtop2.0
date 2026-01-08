"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Search, Filter, Edit3, Trash2, AlertCircle, Loader2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAttendance, deleteAttendance } from "@/lib/admin-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type AttendanceRecord = {
  id: string
  status: string
  date: Date
  slot: string
  student: {
    regNo: string
    user: { name: string }
  }
  course: {
    code: string
    title: string
  }
  faculty: {
    user: { name: string }
  }
}

export function AttendanceManagementClient({ initialLogs }: { initialLogs: AttendanceRecord[] }) {
  const router = useRouter()
  const [logs, setLogs] = useState(initialLogs)
  const [search, setSearch] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AttendanceRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Edit form state
  const [formData, setFormData] = useState({
    status: "",
    slot: ""
  })

  const filteredLogs = logs.filter(log => 
    log.student.regNo.toLowerCase().includes(search.toLowerCase()) ||
    log.student.user.name.toLowerCase().includes(search.toLowerCase()) ||
    log.course.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = async () => {
    if (!selectedLog) return
    setIsLoading(true)
    try {
      await updateAttendance(selectedLog.id, {
        status: formData.status as any,
        slot: formData.slot
      })
      toast.success("Attendance record updated!")
      setEditDialogOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update record")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedLog) return
    setIsLoading(true)
    try {
      await deleteAttendance(selectedLog.id)
      toast.success("Attendance record deleted!")
      setLogs(logs.filter(l => l.id !== selectedLog.id))
      setDeleteDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete record")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (log: AttendanceRecord) => {
    setSelectedLog(log)
    setFormData({
      status: log.status,
      slot: log.slot
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (log: AttendanceRecord) => {
    setSelectedLog(log)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-rose-500" /> Attendance Control
          </h1>
          <p className="text-gray-400 mt-1">Master override and administrative audit logs</p>
        </div>
        <div className="flex items-center gap-3">
             <Button variant="outline" className="border-white/10 text-gray-400">
                <Filter className="w-4 h-4 mr-2" /> Global Filter
             </Button>
             <Badge className="bg-rose-600/20 text-rose-500 border border-rose-500/20 px-4 py-1 uppercase font-black">Admin Access</Badge>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden shadow-2xl">
         <CardHeader className="bg-black/40 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
               <CardTitle className="text-white text-lg">Master Attendance Log</CardTitle>
               <CardDescription>Directly modify or purge academic attendance records</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Seach reg no, name, or course..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 bg-black/20 border-white/5 text-white" 
                />
            </div>
         </CardHeader>
         <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead className="bg-black/20">
                  <tr>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Student Info</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Course/Slot</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Current Status</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Marked By</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-4">
                            <p className="text-white font-bold text-sm">{log.student.user.name}</p>
                            <p className="text-[10px] text-rose-500 font-bold uppercase">{log.student.regNo}</p>
                       </td>
                       <td className="p-4">
                            <p className="text-white text-xs font-medium">{log.course.title}</p>
                            <Badge variant="outline" className="p-0 border-none text-[10px] text-gray-500">{log.slot}</Badge>
                       </td>
                       <td className="p-4">
                            <Badge className={
                                log.status === 'PRESENT' ? 'bg-emerald-600/10 text-emerald-400' : 
                                log.status === 'ABSENT' ? 'bg-rose-600/10 text-rose-400' : 
                                'bg-blue-600/10 text-blue-400'
                            }>
                                {log.status}
                            </Badge>
                       </td>
                       <td className="p-4">
                            <p className="text-gray-400 text-[10px] font-bold">{log.faculty.user.name}</p>
                            <p className="text-[9px] text-gray-600">{new Date(log.date).toLocaleDateString()}</p>
                       </td>
                       <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 text-blue-400 hover:bg-blue-600/10"
                                  onClick={() => openEditDialog(log)}
                                >
                                    <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 text-rose-500 hover:bg-rose-600/10"
                                  onClick={() => openDeleteDialog(log)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                           </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </CardContent>
      </Card>
      
      <div className="p-6 rounded-2xl bg-rose-600/5 border border-rose-500/10 flex items-start gap-4">
           <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
           <div className="space-y-1">
                <h4 className="text-rose-400 font-bold text-sm uppercase tracking-wider">Administrative Policy</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Overrides performed here are logged in the master audit trail. Changing an attendance record will trigger an immediate percentage recalculation for the student across all summary dashboards.</p>
           </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Override Attendance Status</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the attendance status for <span className="text-white font-bold">{selectedLog?.student.user.name}</span> in <span className="text-white font-bold">{selectedLog?.course.code}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-500">Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  <SelectItem value="PRESENT">PRESENT</SelectItem>
                  <SelectItem value="ABSENT">ABSENT</SelectItem>
                  <SelectItem value="LATE">LATE</SelectItem>
                  <SelectItem value="EXCUSED">EXCUSED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-500">Slot Override</Label>
              <Input 
                value={formData.slot}
                onChange={e => setFormData({...formData, slot: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-white/10">Cancel</Button>
            <Button onClick={handleEdit} disabled={isLoading} className="bg-rose-600 hover:bg-rose-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Update Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-rose-500">Delete Attendance Record</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this record for <span className="text-white font-bold">{selectedLog?.student.user.name}</span>? This will affect their overall attendance percentage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-white/10">Cancel</Button>
            <Button onClick={handleDelete} disabled={isLoading} className="bg-rose-600 hover:bg-rose-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Label({ children, className }: any) {
  return <label className={className}>{children}</label>
}
