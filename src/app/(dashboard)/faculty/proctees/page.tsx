import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react"
import { getProctees } from "@/lib/actions"

export default async function ProcteeViewPage() {
  const procteesRaw = await getProctees()
  
  const proctees = (procteesRaw as any[]).map(p => {
    const avgAttendance = p.attendance.length > 0
        ? p.attendance.reduce((sum: number, a: any) => sum + a.percentage, 0) / p.attendance.length
        : 100
    
    let status = "GOOD"
    if (avgAttendance < 75 || p.cgpa < 7.5) status = "CRITICAL"
    else if (avgAttendance < 85 || p.cgpa < 8.5) status = "AVERAGE"

    return {
        ...p,
        name: p.user.name,
        avgAttendance,
        status
    }
  })

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                   <Users className="w-8 h-8 text-blue-400" /> Proctee Management
               </h1>
               <p className="text-gray-400 mt-1">Monitor and mentor your assigned students</p>
           </div>
           <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input placeholder="Search proctee..." className="pl-9 bg-white/5 border-white/10 text-white w-[250px]" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-[10px] tracking-widest px-6 h-10 shadow-xl shadow-blue-600/20">Message All</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none">Total Proctees</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black text-white italic tracking-tighter">{proctees.length}</div>
                </CardContent>
            </Card>
            <Card className="bg-rose-500/5 border-rose-500/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] text-rose-400 uppercase font-black tracking-widest leading-none">Low Attendance/GPA</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black text-rose-500 italic tracking-tighter">
                        {proctees.filter(p => p.status === 'CRITICAL').length}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-amber-500/5 border-amber-500/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] text-amber-400 uppercase font-black tracking-widest leading-none">Average Pulse</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black text-amber-500 italic tracking-tighter">
                        {(proctees.reduce((sum, p) => sum + p.cgpa, 0) / (proctees.length || 1)).toFixed(2)}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] text-blue-400 uppercase font-black tracking-widest leading-none">Global Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black text-blue-500 italic tracking-tighter">EX-V1</div>
                </CardContent>
            </Card>
        </div>

        <Card className="bg-[#0A0A0B]/80 border-white/10">
            <CardHeader>
                <CardTitle className="text-white uppercase font-black italic tracking-tight">Student Roster</CardTitle>
                <CardDescription className="text-[10px] text-gray-500 font-bold uppercase">Click on student to view deep performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
                    <Table>
                        <TableHeader className="bg-white/5 border-b border-white/10">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name / Reg No</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CGPA</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Attendance</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {proctees.map((student, i) => (
                                <TableRow key={i} className="border-white/5 hover:bg-white/[0.02] group transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-sm uppercase italic tracking-tight group-hover:text-blue-400 transition-colors">{student.name}</span>
                                            <span className="text-[10px] text-gray-600 font-bold uppercase">{student.regNo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white font-black italic tracking-tighter text-lg">{student.cgpa.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-1.5 rounded-full bg-black/40 overflow-hidden border border-white/5">
                                                <div 
                                                    className={cn("h-full transition-all", student.avgAttendance < 75 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]")} 
                                                    style={{ width: `${student.avgAttendance}%` }} 
                                                />
                                            </div>
                                            <span className={cn("text-[10px] font-black italic", student.avgAttendance < 75 ? "text-rose-400" : "text-emerald-400")}>
                                                {student.avgAttendance.toFixed(1)}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "font-black text-[8px] px-3 py-1 border rounded-full tracking-widest transition-all",
                                            student.status === "CRITICAL" ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]" : 
                                            student.status === "GOOD" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : 
                                            "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                        )}>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                           <Button variant="ghost" size="icon" className="group-hover:bg-blue-500/10 text-gray-600 group-hover:text-blue-400 h-8 w-8 rounded-lg transition-all">
                                                <Mail className="w-3.5 h-3.5" />
                                           </Button>
                                           <Button variant="ghost" size="icon" className="group-hover:bg-emerald-500/10 text-gray-600 group-hover:text-emerald-400 h-8 w-8 rounded-lg transition-all">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                           </Button>
                                           <Button variant="ghost" size="icon" className="group-hover:bg-white/10 text-gray-600 group-hover:text-white h-8 w-8 rounded-lg transition-all">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                           </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
