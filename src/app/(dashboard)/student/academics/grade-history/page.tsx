import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { History, Award, Book, GraduationCap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMarks, getStudentProfile } from "@/lib/actions"

export default async function GradeHistoryPage() {
  const profile = await getStudentProfile()
  const marks = await getMarks()

  const semHistory = [
    { sem: "Winter 2023-24", gpa: 9.12, credits: 24, status: "Cleared" },
    { sem: "Fall 2023-24", gpa: 8.95, credits: 22, status: "Cleared" },
    { sem: "Winter 2022-23", gpa: 9.24, credits: 23, status: "Cleared" },
    { sem: "Fall 2022-23", gpa: 8.88, credits: 21, status: "Cleared" },
  ]

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                   <History className="w-8 h-8 text-purple-400" /> Grade History
               </h1>
               <p className="text-gray-400 mt-1">Consolidated view of your academic performance across all semesters</p>
           </div>
           <div className="p-4 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-center">
                <span className="text-xs text-purple-400 uppercase font-bold tracking-widest">Cumulative GPA</span>
                <div className="text-3xl font-bold text-white">{profile?.cgpa?.toFixed(2) || "0.00"}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-white">Semester-wise Performance</CardTitle>
                    <CardDescription>Historical breakdown of GPA and credits</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-gray-300">Semester</TableHead>
                                <TableHead className="text-gray-300">GPA</TableHead>
                                <TableHead className="text-gray-300 text-center">Credits</TableHead>
                                <TableHead className="text-gray-300 text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {semHistory.map((sem, i) => (
                                <TableRow key={i} className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <TableCell className="text-white font-medium">{sem.sem}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-purple-400" />
                                            <span className="text-white font-bold">{sem.gpa}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-center">{sem.credits}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/20">
                                            {sem.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Academic Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <div className="flex items-center gap-2">
                                <Book className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-400">Total Credits Earned</span>
                            </div>
                            <span className="text-white font-bold">142</span>
                         </div>
                         <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-400" />
                                <span className="text-sm text-gray-400">Arrears / S-Grades</span>
                            </div>
                            <span className="text-white font-bold">0</span>
                         </div>
                         <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-rose-400" />
                                <span className="text-sm text-gray-400">Class Rank</span>
                            </div>
                            <span className="text-white font-bold">04 / 120</span>
                         </div>
                    </CardContent>
                </Card>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent border border-white/10">
                    <h3 className="text-white font-bold mb-2">Transcript Generation</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">Request a digitally signed official transcript for your entire academic duration.</p>
                    <Button variant="outline" className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                        Request Transcript
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}
