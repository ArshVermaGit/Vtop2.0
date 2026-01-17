"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Search, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { getModelData, deleteModelRecord } from "@/lib/admin-actions"
import { toast } from "sonner"

const MODELS = [
  'user', 'studentProfile', 'facultyProfile', 'parentProfile', 'adminProfile',
  'course', 'attendanceLog', 'attendance', 'marks', 'payment', 'leaveRequest',
  'scholarship', 'courseRegistration', 'courseMaterial', 'meeting', 'counsellingRecord',
  'securityAudit', 'assignment', 'assignmentSubmission', 'forumPost', 'forumReply',
  'club', 'clubMembership', 'clubEvent', 'achievement', 'activityPoint',
  'hostelAdmission', 'hostelMaintenance', 'messMenu', 'hostelBlock',
  'examSchedule', 'seatAllocation', 'examApplication', 'biometricReport',
  'notification', 'message', 'researchProfile', 'researchPublication'
]

export function UniversalRegistry() {
  const [model, setModel] = useState<string>("user")
  const [data, setData] = useState<Record<string, unknown>[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getModelData(model, page)
      setData(result.data as Record<string, unknown>[])
      setTotal(result.total)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [model, page])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return
    try {
      await deleteModelRecord(model, id)
      toast.success("Record deleted")
      loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Database className="w-8 h-8 text-indigo-500" /> Master Registry
          </h1>
          <p className="text-gray-400 mt-1">Universal database explorer for VTOP 2.0 Engine</p>
        </div>
        <div className="flex items-center gap-3">
             <Select value={model} onValueChange={(v) => { setModel(v); setPage(1); }}>
                <SelectTrigger className="w-64 bg-white/5 border-white/10 text-white capitalize">
                    <SelectValue placeholder="Select Data Model" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white max-h-80">
                    {MODELS.sort().map(m => (
                        <SelectItem key={m} value={m} className="capitalize">
                            {m.replace(/([A-Z])/g, ' $1').trim()}
                        </SelectItem>
                    ))}
                </SelectContent>
             </Select>
             <Button variant="outline" className="border-white/10 text-gray-400" onClick={loadData}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Sync
             </Button>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden shadow-2xl">
         <CardHeader className="bg-black/40 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
               <CardTitle className="text-white text-lg capitalize">{model.replace(/([A-Z])/g, ' $1').trim()} Table</CardTitle>
               <CardDescription>Records: {total} | Precision management of every database node</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Local search (current page)..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 bg-black/20 border-white/5 text-white" 
                />
            </div>
         </CardHeader>
         <CardContent className="p-0 overflow-x-auto">
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
                    <AlertCircle className="w-12 h-12 opacity-20" />
                    <p>No records found in this model.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader className="bg-black/20">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            {headers.map(h => (
                                <TableHead key={h} className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{h}</TableHead>
                            ))}
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())).map((row, idx) => (
                            <TableRow key={(row.id as string) || idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                {headers.map(h => (
                                    <TableCell key={h} className="text-xs text-gray-300 max-w-[200px] truncate">
                                        {typeof row[h] === 'object' ? (
                                            <span className="text-[10px] text-indigo-400 font-mono">OBJECT</span>
                                        ) : String(row[h])}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(row.id as string)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
         </CardContent>
         <div className="bg-black/40 border-t border-white/5 p-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">Page {page} of {Math.ceil(total / 20)}</p>
            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-white/10 text-white h-8 w-8" 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-white/10 text-white h-8 w-8" 
                    disabled={page >= Math.ceil(total / 20)}
                    onClick={() => setPage(p => p + 1)}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
         </div>
      </Card>
    </div>
  )
}
