"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Search, MoreVertical, Edit3, Trash2, UserPlus, FileText, CheckCircle, XCircle, type LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Student = {
  id: string
  regNo: string
  program: string
  school: string
  batch: string
  user: {
    name: string
    email: string
    username: string
  }
  _count: {
    attendance: number
    marks: number
  }
}

export function StudentManagementClient({ initialStudents }: { initialStudents: Student[] }) {
  const [search, setSearch] = useState("")

  const filteredStudents = initialStudents.filter((s: Student) => 
    s.regNo.toLowerCase().includes(search.toLowerCase()) ||
    s.user.name.toLowerCase().includes(search.toLowerCase()) ||
    s.user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <GraduationCap className="w-8 h-8 text-blue-500" /> Student Matrix
          </h1>
          <p className="text-gray-400 mt-1">Complete student lifecycle and academic oversight</p>
        </div>
        <div className="flex items-center gap-3">
             <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-blue-600/20">
                <UserPlus className="w-4 h-4 mr-2" /> Enroll Student
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={initialStudents.length} icon={GraduationCap} color="text-blue-500" />
          <StatCard title="Active Portals" value={initialStudents.length} icon={CheckCircle} color="text-emerald-500" />
          <StatCard title="Global Attendance Avg" value="78%" icon={FileText} color="text-amber-500" />
          <StatCard title="System Alerts" value="0" icon={XCircle} color="text-rose-500" />
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden shadow-2xl">
         <CardHeader className="bg-black/40 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
               <CardTitle className="text-white text-lg">Student Directory</CardTitle>
               <CardDescription>Manage profiles, academic records, and portal access</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="ID, Name, or Reg No..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 bg-black/20 border-white/5 text-white" 
                />
            </div>
         </CardHeader>
         <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead className="bg-black/20">
                  <tr>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Student Information</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Academic Details</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Engagement</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Status</th>
                     <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredStudents.map((student: Student) => (
                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold border border-white/10">
                                    {student.user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{student.user.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{student.user.username}</p>
                                </div>
                            </div>
                       </td>
                       <td className="p-4">
                            <p className="text-white text-xs font-semibold">{student.regNo}</p>
                            <p className="text-[10px] text-gray-500 leading-tight">{student.program} • {student.batch}</p>
                       </td>
                       <td className="p-4">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-gray-500 text-[9px] uppercase font-black">Attendance</p>
                                    <p className="text-emerald-400 text-xs font-bold">{student._count.attendance} Logs</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[9px] uppercase font-black">Assessments</p>
                                    <p className="text-purple-400 text-xs font-bold">{student._count.marks} Records</p>
                                </div>
                            </div>
                       </td>
                       <td className="p-4">
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5">ACTIVE</Badge>
                       </td>
                       <td className="p-4 text-right whitespace-nowrap">
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 text-white w-48">
                                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                                        <Edit3 className="w-4 h-4 mr-2" /> Modify Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                                        <FileText className="w-4 h-4 mr-2" /> Academic Report
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-rose-500 hover:bg-rose-500/10 cursor-pointer">
                                        <Trash2 className="w-4 h-4 mr-2" /> Decommission
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                           </DropdownMenu>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: LucideIcon, color: string }) {
    return (
        <Card className="bg-white/5 border-white/10 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{title}</p>
                    <p className={`text-2xl font-black ${color} mt-1`}>{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${color.replace('text', 'bg')}/10`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </div>
        </Card>
    )
}
