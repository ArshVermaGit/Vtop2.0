import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  FileText,
  MessageSquare,
  Award,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from "lucide-react"
import { getFacultyDashboardData, getAcademicEvents } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function FacultyDashboard() {
  const faculty = await getFacultyDashboardData()
  const events = await getAcademicEvents()

  if (!faculty) return <div className="p-10 text-white font-black uppercase text-xs">Unauthorized or Faculty Profile not found.</div>

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const currentDay = days[new Date().getDay()]

  const todayClasses = faculty.courses.flatMap(c => 
    c.timeTable?.filter((t: any) => t.day === currentDay) || []
  ).sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))

  const totalProctees = faculty.proctees.length
  const criticalProctees = faculty.proctees.filter((p: any) => 
    (p.attendance?.[0]?.percentage || 100) < 75 || p.cgpa < 7.5
  ).length

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 uppercase font-black text-[9px] mb-2 tracking-widest">Oracle Session Active</Badge>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
              Faculty <span className="text-indigo-500">Oracle</span> Hub
           </h1>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-none mt-1">
             {faculty.designation} • {faculty.school} • Cabin: {faculty.cabin}
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-none">Employee ID</p>
              <p className="text-[11px] text-white font-black uppercase tracking-tight">{faculty.empId}</p>
           </div>
           <Link href="/faculty/messages">
               <Button className="bg-[#0A0A0B] hover:bg-white text-white hover:text-black border border-white/10 rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl">
                  <MessageSquare className="w-4 h-4 mr-2" /> Broadcast Notice
               </Button>
           </Link>
        </div>
      </div>

      {/* KPIS / ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricCard 
            label="Proctees Assigned" 
            value={totalProctees} 
            subtitle="Under Mentorship" 
            icon={<Users className="w-5 h-5 text-indigo-400" />}
            status="ACTIVE"
            color="indigo"
         />
         <MetricCard 
            label="Critical Alerts" 
            value={criticalProctees} 
            subtitle="Low Attendance/GPA" 
            icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
            status="REQUIRES ACTION"
            color="rose"
         />
         <MetricCard 
            label="Courses Taught" 
            value={faculty.courses.length} 
            subtitle="Current Semester" 
            icon={<BookOpen className="w-5 h-5 text-emerald-400" />}
            status="SEAMLESS"
            color="emerald"
         />
         <MetricCard 
            label="Research Index" 
            value="3.2" 
            subtitle="H-Index Score" 
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
            status="EXCELLENT"
            color="purple"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* TODAY'S ENGAGEMENTS */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden backdrop-blur-3xl shadow-2xl">
                <CardHeader className="bg-black/40 border-b border-white/5 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            <CardTitle className="text-white text-lg uppercase font-black italic tracking-tight">Daily Instruction Pipeline</CardTitle>
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Monday, Jan 05</p>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {todayClasses.length > 0 ? todayClasses.map((cls: any, i: number) => (
                           <div key={i} className="p-6 hover:bg-white/[0.02] transition-all group flex items-center justify-between">
                                <div className="flex gap-6 items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                                        <p className="text-[10px] text-gray-500 font-black uppercase leading-none">{cls.startTime.split(':')[0]}</p>
                                        <p className="text-xl font-black text-white italic tracking-tighter">{cls.startTime.split(':')[1]}</p>
                                        <div className="w-full bg-indigo-600/50 h-0.5 mt-1" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-white font-black text-md uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors">Digital Image Processing</h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Slot: {cls.slot} • Venue: {cls.venue}</p>
                                        <div className="flex items-center gap-2 pt-2">
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[7px] font-black uppercase">Theory</Badge>
                                            <Badge className="bg-white/5 text-gray-600 border-none text-[7px] font-black uppercase">52 Enrolled</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                   <Button className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[9px] tracking-widest rounded-lg transition-all shadow-lg shadow-indigo-600/20">
                                      Mark Attendance
                                   </Button>
                                   <Button variant="ghost" className="w-9 h-9 p-0 rounded-lg text-gray-700 hover:text-white hover:bg-white/5 transition-all">
                                      <ArrowRight className="w-4 h-4" />
                                   </Button>
                                </div>
                           </div>
                        )) : (
                            <div className="p-20 text-center space-y-3 opacity-20">
                                <Clock className="w-12 h-12 mx-auto text-white" />
                                <p className="text-[10px] text-white uppercase font-black tracking-widest italic">No classes scheduled for today.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden min-h-[350px]">
                     <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-white text-md uppercase font-black italic flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" /> Proctor Audit Ledger
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-0">
                         {faculty.proctees.slice(0, 4).map((proctee: any) => (
                             <div key={proctee.id} className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black italic">{proctee.user.name[0]}</div>
                                     <div className="space-y-0.5">
                                         <p className="text-white font-bold text-[11px] uppercase truncate max-w-[120px]">{proctee.user.name}</p>
                                         <p className="text-[8px] text-gray-600 font-black uppercase leading-none">{proctee.regNo}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-[10px] text-white font-black italic">{proctee.cgpa.toFixed(2)}</p>
                                     <p className="text-[7px] text-gray-700 font-black uppercase">CGPA</p>
                                 </div>
                             </div>
                         ))}
                         <Button variant="ghost" className="w-full h-12 text-[9px] text-indigo-400 font-black uppercase hover:bg-indigo-600/10 tracking-widest">
                             View Complete Mentor List
                         </Button>
                     </CardContent>
                 </Card>

                 <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden min-h-[350px]">
                     <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-white text-md uppercase font-black italic flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" /> Research & Publications
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-6">
                         <div className="space-y-6">
                            <ResearchStat label="Journals Published" value="14" color="indigo" />
                            <ResearchStat label="Conferences indexed" value="28" color="emerald" />
                            <ResearchStat label="Patents Granted" value="03" color="purple" />
                            <ResearchStat label="Ongoing Projects" value="02" color="amber" />
                            <Button className="w-full mt-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white font-black uppercase text-[9px] tracking-widest h-10 transition-all rounded-xl">
                                Update Research Portfolio
                            </Button>
                         </div>
                     </CardContent>
                 </Card>
            </div>
         </div>

         {/* FACULTY SIDEBAR - ADMIN & QUICK ACTIONS */}
         <div className="space-y-8">
             <Card className="bg-gradient-to-br from-[#121214] to-[#0A0A0B] border-white/10 overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-white/10 rotate-12">
                      <GraduationCap className="w-40 h-40" />
                  </div>
                  <div className="p-6 space-y-6 relative z-10">
                      <h4 className="text-white font-black text-xs uppercase tracking-widest border-b border-white/5 pb-4 italic">Executive Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                          <ToolButton icon={<Award className="w-4 h-4" />} label="Marks Upload" color="indigo" />
                          <ToolButton icon={<FileText className="w-4 h-4" />} label="Counselling" color="amber" />
                          <ToolButton icon={<Users className="w-4 h-4" />} label="Student List" color="emerald" />
                          <ToolButton icon={<Briefcase className="w-4 h-4" />} label="Course CMS" color="purple" />
                      </div>
                      
                      <div className="pt-4 border-t border-white/5 space-y-3">
                          <Link href="/faculty/admin/payroll">
                              <Button variant="ghost" className="w-full justify-between h-12 bg-white/5 hover:bg-white text-gray-500 hover:text-black border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl px-4">
                                 Payroll & Pay-slips <ArrowRight className="w-4 h-4" />
                              </Button>
                          </Link>
                          <Link href="/faculty/admin/leaves">
                              <Button variant="ghost" className="w-full justify-between h-12 bg-white/5 hover:bg-white text-gray-500 hover:text-black border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl px-4">
                                 Leave Management <Calendar className="w-4 h-4" />
                              </Button>
                          </Link>
                      </div>
                  </div>
             </Card>

             <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-white font-black text-xs uppercase tracking-widest border-b border-white/5 pb-4 mb-4 italic">Institutional Pulse</h4>
                <div className="space-y-4">
                    {events.length > 0 ? events.slice(0, 3).map((event: any, i: number) => (
                      <PulseItem 
                        key={i} 
                        label={event.title} 
                        time={`${new Date(event.date).toLocaleDateString()} • ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} 
                        floor={event.location || "TBD"} 
                      />
                    )) : <p className="text-gray-500 text-[10px] uppercase font-bold text-center py-4">No upcoming events</p>}
                </div>
             </Card>
             
             <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10 text-center space-y-2">
                 <ShieldCheck className="w-10 h-10 mx-auto text-indigo-500/40" />
                 <p className="text-[10px] text-gray-600 uppercase font-black leading-tight">Last Security Audit</p>
                 <p className="text-[11px] text-indigo-400 font-black italic">Jan 02, 2026 • 11:20 AM</p>
             </div>
         </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, subtitle, icon, status, color }: any) {
    const colorMap: any = {
      indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
      rose: "text-rose-400 border-rose-500/20 bg-rose-500/5",
      emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    }
    return (
      <Card className="bg-[#0A0A0B]/80 border-white/10 group hover:border-white/20 transition-all backdrop-blur-3xl overflow-hidden relative">
        <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform ${colorMap[color].split(' ')[0]}`}>
          {icon}
        </div>
        <CardContent className="p-6 relative z-10 space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">{label}</p>
          <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{subtitle}</p>
          <div className="pt-4">
             <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${colorMap[color]}`}>{status}</span>
          </div>
        </CardContent>
      </Card>
    )
}

function ResearchStat({ label, value, color }: any) {
    const colorMap: any = {
        indigo: "bg-indigo-500",
        emerald: "bg-emerald-500",
        purple: "bg-purple-500",
        amber: "bg-amber-500",
    }
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${colorMap[color]}`} />
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">{label}</p>
            </div>
            <p className="font-black text-white italic tracking-tighter">{value}</p>
        </div>
    )
}

function ToolButton({ icon, label, color }: any) {
    const colorMap: any = {
        indigo: "hover:bg-indigo-600/20 hover:text-indigo-400 border-indigo-500/20 hover:border-indigo-500/40",
        amber: "hover:bg-amber-600/20 hover:text-amber-400 border-amber-500/20 hover:border-amber-500/40",
        emerald: "hover:bg-emerald-600/20 hover:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40",
        purple: "hover:bg-purple-600/20 hover:text-purple-400 border-purple-500/20 hover:border-purple-500/40",
    }
    return (
        <Button variant="outline" className={`h-16 flex-col gap-1.5 bg-white/5 border text-gray-500 transition-all rounded-xl ${colorMap[color]}`}>
            {icon}
            <span className="text-[8px] font-black uppercase tracking-tight">{label}</span>
        </Button>
    )
}

function PulseItem({ label, time, floor }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all cursor-default">
            <div className="space-y-0.5">
                <p className="text-[10px] text-white font-black uppercase italic tracking-tight">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-[8px] text-gray-600 font-bold uppercase">{time}</p>
                    <span className="text-gray-800">•</span>
                    <p className="text-[8px] text-gray-600 font-bold uppercase">{floor}</p>
                </div>
            </div>
            <ArrowRight className="w-3 h-3 text-gray-800 group-hover:text-white transition-colors" />
        </div>
    )
}
