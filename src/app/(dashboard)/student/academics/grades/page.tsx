import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, Download, Filter, Search, FileText, ChevronRight, GraduationCap } from "lucide-react"
import { getGradeHistory } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function GradeHistoryPage() {
  const history = await getGradeHistory()

  // Group by semester for the UI
  const groupedHistory = history.reduce((acc: any, curr) => {
    if (!acc[curr.semester]) acc[curr.semester] = []
    acc[curr.semester].push(curr)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <History className="w-8 h-8 text-indigo-500" /> Grade Ledger
          </h1>
          <p className="text-gray-400 mt-1">Official Semester-wise Academic Record (2022-2026)</p>
        </div>
        <div className="flex items-center gap-3">
             <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white h-10 px-6 uppercase text-[10px] font-black tracking-widest">
                <Download className="w-4 h-4 mr-2" /> Download Transcript
             </Button>
             <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-1">VERIFIED RECORD</Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input placeholder="Search course code or title..." className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
          <Button variant="outline" className="border-white/10 text-gray-400 h-10 px-4">
              <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedHistory).map(([semester, courses]: [string, any]) => (
            <div key={semester} className="space-y-4">
                 <div className="flex items-center gap-4 px-2">
                    <h3 className="text-white font-black text-lg uppercase tracking-tight">{semester}</h3>
                    <div className="h-px flex-1 bg-white/5" />
                    <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                        {courses.length} Courses • {courses.reduce((a: any, b: any) => a + b.credits, 0)} Credits
                    </Badge>
                </div>

                <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-[9px] text-gray-500 uppercase font-black px-6">Course Detail</TableHead>
                                <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Type</TableHead>
                                <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Credits</TableHead>
                                <TableHead className="text-[9px] text-gray-500 uppercase font-black text-center">Grade</TableHead>
                                <TableHead className="text-[9px] text-gray-500 uppercase font-black text-right pr-6">Result</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((c: any) => (
                                <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <TableCell className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-bold text-sm group-hover:text-indigo-400 transition-colors">{c.courseTitle}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">{c.courseCode}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-xs text-gray-400 font-medium">Theory</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-xs text-white font-black">{c.credits}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-black text-sm">
                                            {c.grade}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Badge className={c.result === 'PASS' ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px]" : "bg-rose-600/20 text-rose-400 border border-rose-500/20 text-[9px]"}>
                                            {c.result}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                  <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">Degree Standing</h4>
                  <p className="text-xs text-gray-400 max-w-md">You have completed <span className="text-indigo-400 font-bold">142 out of 160</span> required credits for your B.Tech program. Keep up the excellent work!</p>
              </div>
          </div>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest px-8">
              View Curriculum Progress
          </Button>
      </div>
    </div>
  )
}
