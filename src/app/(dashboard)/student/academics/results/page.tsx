import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, BookOpen, GraduationCap, ChevronRight, BarChart3, Star, History, FileText, Activity } from "lucide-react"
import { getAcademicPerformance } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AcademicPerformancePage() {
  const performance = await getAcademicPerformance()
  if (!performance) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <GraduationCap className="w-8 h-8 text-amber-500" /> Academic Performance
          </h1>
          <p className="text-gray-400 mt-1">Winter Semester 2026-27 • Holistic Result Analytics</p>
        </div>
        <div className="flex items-center gap-3">
             <Link href="/student/academics/grades">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10">
                    <History className="w-4 h-4 mr-2" /> Grade Ledger
                </Button>
             </Link>
             <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/20 px-4 py-1">ACADEMIC EXCELLENCE</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-16 h-16 text-amber-400" />
              </div>
              <CardHeader className="pb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Cumulative GPA</p>
                  <CardTitle className="text-4xl font-black text-white">{performance.cgpa}</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <TrendingUp className="w-3.5 h-3.5" /> +0.12 from last sem
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award className="w-16 h-16 text-blue-400" />
              </div>
              <CardHeader className="pb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Credits Earned</p>
                  <CardTitle className="text-4xl font-black text-white">{performance.totalCredits}</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-500 uppercase">Degree Progress</span>
                        <span className="text-blue-400">72%</span>
                    </div>
                    <Progress value={72} className="h-1 bg-black/20" />
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="w-16 h-16 text-purple-400" />
              </div>
              <CardHeader className="pb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Credits</p>
                  <CardTitle className="text-4xl font-black text-white">21</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-xs text-gray-500">Currently registered for 5 courses</p>
              </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="w-16 h-16 text-rose-400" />
              </div>
              <CardHeader className="pb-2">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Arrears / Backlogs</p>
                  <CardTitle className="text-4xl font-black text-white">0</CardTitle>
              </CardHeader>
              <CardContent>
                  <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">ALL CLEAR</Badge>
              </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-lg">Semester-wise Performance</CardTitle>
                        <CardDescription className="text-xs">Historical breakdown of GPA and credit acquisition</CardDescription>
                    </div>
                    <BarChart3 className="w-5 h-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {performance.semesterPerformance.map((sem: any) => (
                            <div key={sem.semester} className="p-5 rounded-2xl bg-black/20 border border-white/5 group hover:border-amber-500/30 transition-all flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-white font-bold text-md">{sem.semester}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">{sem.courses.length} Courses • {sem.credits} Credits</p>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-500 uppercase font-black">SGPA</p>
                                        <p className="text-amber-400 font-black text-xl">{sem.gpa}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-gray-500 group-hover:text-white group-hover:bg-white/10">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
             <Card className="bg-amber-600/5 border-amber-500/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileText className="w-24 h-24 text-amber-500" />
                </div>
                <CardHeader>
                    <CardTitle className="text-white text-md">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 uppercase font-black">Strongest Area</p>
                            <p className="text-white font-bold text-sm">Compiler Design (A+)</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 uppercase font-black">Focus Needed</p>
                            <p className="text-amber-500 font-bold text-sm">DAA (B)</p>
                        </div>
                     </div>
                     <Link href="/student/academics/marks" className="block">
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white uppercase text-[10px] font-black h-11 tracking-wider shadow-lg">
                            Detailed Marks Breakdown <ChevronRight className="w-3.5 h-3.5 ml-2" />
                        </Button>
                     </Link>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-md">Academic Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[11px] text-gray-500 uppercase font-bold">Current Standing</span>
                        <Badge className="bg-emerald-600 font-black text-[9px]">EXCELLENT</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[11px] text-gray-500 uppercase font-bold">Eligibility (FAT)</span>
                        <Badge className="bg-blue-600 font-black text-[9px]">CONFIRMED</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-[11px] text-gray-500 uppercase font-bold">Degree Status</span>
                        <span className="text-white text-[11px] font-bold uppercase">7th Semester</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
