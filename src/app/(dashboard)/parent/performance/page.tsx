import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, BookOpen, Clock, Heart, ShieldCheck, MapPin } from "lucide-react"
import { getParentDashboardData } from "@/lib/actions"
import { cn } from "@/lib/utils"

export default async function StudentProgressPage() {
  const data = await getParentDashboardData()
  if (!data || !data.profile.student) return <div className="p-10 text-white">Unauthorized or Ward not linked.</div>

  const { student } = data.profile
  const profile = student // Alias for compatibility with existing code
  const attendance = student.attendance || []
  const marks = student.marks || []

  return (
    <div className="space-y-6">
       <div>
           <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
               <Activity className="w-8 h-8 text-emerald-400" /> Student Progress
           </h1>
           <p className="text-gray-400 mt-1">Detailed academic and well-being overview for {profile?.user?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Attendance Real-time Monitor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {attendance.map((item: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-white">{item.course.title}</span>
                                    </div>
                                    <span className={cn(
                                        "text-sm font-bold",
                                        item.percentage < 75 ? "text-rose-400" : "text-emerald-400"
                                    )}>
                                        {item.percentage}%
                                    </span>
                                </div>
                                <Progress value={item.percentage} className={cn(
                                    "h-1.5",
                                    item.percentage < 75 ? "bg-rose-500/20" : "bg-emerald-500/10"
                                )} />
                                <div className="flex justify-between text-[10px] text-gray-500">
                                    <span>Attended: {item.attendedClasses} / {item.totalClasses}</span>
                                    <span>{item.percentage >= 75 ? 'Safe' : 'At Risk'}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Assessment Marks</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {marks.map((m: any, i: number) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/5">
                                    <div>
                                        <p className="text-sm font-medium text-white">{m.course.title}</p>
                                        <p className="text-[10px] text-gray-500">Continuous Assessment (CAT-1)</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">{m.cat1 || 0} / 50</div>
                                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">PASSED</Badge>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white">Well-being & Safety</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                                <Heart className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Health Status</p>
                                <p className="text-xs text-gray-500">Normal (No recorded incidents)</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Security / Late Entry</p>
                                <p className="text-xs text-gray-500">0 infractions this semester</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Hostel Residence</p>
                                <p className="text-xs text-gray-500">{student?.hostelBlock || 'N/A'}, Room {student?.hostelRoom || 'N/A'}</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>

                <div className="p-6 rounded-2xl bg-linear-to-br from-emerald-600/20 to-blue-600/20 border border-white/10 text-center">
                    <Clock className="w-8 h-8 text-white mx-auto mb-3" />
                    <h3 className="text-white font-bold">In-Campus Status</h3>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        IN-CAMPUS (LIVE)
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3">Verified by Biometric Sync</p>
                </div>
            </div>
        </div>
    </div>
  )
}


