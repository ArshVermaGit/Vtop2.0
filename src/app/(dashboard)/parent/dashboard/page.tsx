import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  Bell,
  Clock,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Info
} from "lucide-react"
import { getParentDashboardData } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend: string;
  color: 'emerald' | 'indigo' | 'rose' | 'amber';
}

interface WardInfoRowProps {
  label: string;
  value: string;
}

interface ComplianceRowProps {
  label: string;
  status: string;
  color: 'emerald' | 'indigo';
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: 'indigo' | 'amber' | 'emerald' | 'purple';
}

export default async function ParentDashboard() {
  const data = await getParentDashboardData()
  if (!data) return <div className="p-10 text-white font-black uppercase text-xs">Unauthorized or Profile not linked.</div>

  const { profile, announcements } = data
  const student = profile.student

  if (!student) return <div className="p-10 text-white font-black uppercase text-xs">Ward profile not linked.</div>

  // Aggregated Stats with proper typing
  const avgAttendance = student.attendance.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / (student.attendance.length || 1)
  const pendingFees = student.payments.filter((p) => p.status === 'PENDING').reduce((acc, curr) => acc + (curr.amount || 0), 0)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 uppercase font-black text-[9px] mb-2 tracking-widest">Parent Portal Active</Badge>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
              Guardian <span className="text-indigo-500">Command</span> Center
           </h1>
           <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-tight">Monitoring Ward: {student.user.name} ({student.regNo})</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-none">Last Synced</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase">{new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
           </div>
           <Button className="bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest transition-all">
              <MessageSquare className="w-4 h-4 mr-2" /> Message Proctor
           </Button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsCard 
            title="Avg Attendance" 
            value={`${avgAttendance.toFixed(1)}%`} 
            subtitle="Current Semester" 
            icon={<CheckCircle className="w-6 h-6" />}
            trend={avgAttendance >= 75 ? "MEETS CRITERIA" : "ATTENTION REQUIRED"}
            color={avgAttendance >= 75 ? "emerald" : "rose"}
         />
         <StatsCard 
            title="Ward GPA" 
            value={(student.cgpa || 0).toFixed(2)} 
            subtitle="Cumulative Grade" 
            icon={<GraduationCap className="w-6 h-6" />}
            trend={(student.cgpa || 0) >= 8.5 ? "OUTSTANDING" : (student.cgpa || 0) >= 7.5 ? "CONSISTENT" : "IMPROVEMENT NEEDED"}
            color="indigo"
         />
         <StatsCard 
            title="Pending Dues" 
            value={`₹${(pendingFees / 1000).toFixed(1)}k`} 
            subtitle="Academic & Hostel" 
            icon={<CreditCard className="w-6 h-6" />}
            trend={pendingFees === 0 ? "ALL CLEAR" : "DUE SOON"}
            color={pendingFees === 0 ? "emerald" : "rose"}
         />
         <StatsCard 
            title="Exam Status" 
            value="ACTIVE" 
            subtitle="Current Schedule" 
            icon={<Calendar className="w-6 h-6" />}
            trend="READY FOR CAT"
            color="amber"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* ANNOUNCEMENTS & ALERTS */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden backdrop-blur-3xl">
                <CardHeader className="bg-black/40 border-b border-white/5 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-indigo-500" />
                            <CardTitle className="text-white text-lg uppercase font-black italic tracking-tight">Institutional Feed for Parents</CardTitle>
                        </div>
                        <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 uppercase font-black text-[9px]">{announcements.length} Feed Items</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {announcements.length > 0 ? announcements.map((ann) => (
                            <div key={ann.id} className="p-6 hover:bg-white/[0.02] transition-all group cursor-pointer flex gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ann.priority === 'HIGH' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/10'} border`}>
                                   {ann.priority === 'HIGH' ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <Info className="w-5 h-5 text-gray-500" />}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-black text-sm uppercase italic tracking-tight transition-colors ${ann.priority === 'HIGH' ? 'text-rose-400' : 'text-white group-hover:text-indigo-400'}`}>{ann.title}</h4>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{new Date(ann.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed font-bold">{ann.content}</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <p className="text-[9px] text-gray-700 uppercase font-black flex items-center gap-1"><Clock className="w-3 h-3" /> Published Recently</p>
                                        <span className="text-gray-800">•</span>
                                        <button className="text-[9px] text-indigo-400/50 hover:text-indigo-400 font-black uppercase transition-colors">Acknowledge</button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-20 text-center opacity-20">
                                <MessageSquare className="w-12 h-12 mx-auto text-white mb-4" />
                                <p className="text-[10px] text-white uppercase font-black tracking-widest italic">No announcements found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden backdrop-blur-3xl min-h-[300px] flex flex-col">
                     <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-white text-md uppercase font-black italic flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" /> Academic Trajectory
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="flex-1 p-6 flex items-center justify-center text-center">
                         <div className="space-y-2 opacity-20">
                            <div className="w-32 h-32 border-4 border-dashed border-white/20 rounded-full mx-auto flex items-center justify-center">
                                <TrendingUp className="w-12 h-12" />
                            </div>
                            <p className="text-[10px] text-white uppercase font-black">Visual Progress Map Coming Soon</p>
                         </div>
                     </CardContent>
                 </Card>

                  <Card className="bg-[#0A0A0B]/80 border-white/10 overflow-hidden backdrop-blur-3xl min-h-[300px] flex flex-col">
                     <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-white text-md uppercase font-black italic flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" /> Compliance & Safety
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-6 space-y-6">
                         <div className="space-y-4">
                            <ComplianceRow label="Hostel Curfew" status="RECORDED" color="emerald" />
                            <ComplianceRow label="Disciplinary Record" status="NO ENTRIES" color="emerald" />
                            <ComplianceRow label="Leave Authorization" status="SYNCED" color="indigo" />
                            <ComplianceRow label="Biometric Status" status="ACTIVE" color="indigo" />
                         </div>
                     </CardContent>
                  </Card>
            </div>
         </div>

         {/* WARD OVERVIEW SIDEBAR */}
         <div className="space-y-8">
            <Card className="bg-gradient-to-br from-[#121214] to-[#0A0A0B] border-white/10 overflow-hidden shadow-2xl">
                 <div className="h-24 bg-indigo-600/20 border-b border-white/5 relative overflow-hidden">
                     <div className="absolute inset-0 bg-blue-500/10 blur-3xl" />
                 </div>
                 <div className="p-6 -mt-16 relative">
                     <div className="w-20 h-20 rounded-3xl bg-indigo-900 border-4 border-black flex items-center justify-center text-white mb-4 shadow-2xl overflow-hidden">
                        {student.photoUrl ? <img src={student.photoUrl} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-white font-black text-xl tracking-tight uppercase italic">{student.user.name}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">{student.regNo} • {student.program}</p>
                     </div>

                     <div className="mt-8 space-y-4">
                        <WardInfoRow label="School" value={student.school} />
                        <WardInfoRow label="Proctor" value={student.proctor?.user?.name || 'Assigned Soon'} />
                        <WardInfoRow label="Hostel" value={`${student.hostelBlock || 'N/A'} - ${student.hostelRoom || 'N/A'}`} />
                        <WardInfoRow label="Batch" value={student.batch || 'N/A'} />
                     </div>

                     <Link href="/parent/ward-details">
                        <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest h-12 shadow-xl shadow-indigo-600/20 transition-all rounded-xl">
                            Full Ward Audit <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                     </Link>
                 </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
                <h4 className="text-white font-black text-xs uppercase tracking-widest border-b border-white/5 pb-4 mb-4 italic">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/parent/payments" className="contents">
                        <ActionButton icon={<CreditCard className="w-4 h-4" />} label="Pay Fees" color="indigo" />
                    </Link>
                    <Link href="/parent/schedule" className="contents">
                        <ActionButton icon={<Calendar className="w-4 h-4" />} label="Exam View" color="amber" />
                    </Link>
                    <Link href="/parent/attendance" className="contents">
                        <ActionButton icon={<CheckCircle className="w-4 h-4" />} label="Attendance" color="emerald" />
                    </Link>
                    <Link href="/parent/performance" className="contents">
                        <ActionButton icon={<GraduationCap className="w-4 h-4" />} label="Grades" color="purple" />
                    </Link>
                </div>
            </Card>
         </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, subtitle, icon, trend, color }: StatsCardProps) {
  const colorMap = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    rose: "text-rose-400 border-rose-500/20 bg-rose-500/5",
    amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  }
  
  return (
    <Card className="bg-[#0A0A0B]/80 border-white/10 group hover:border-white/20 transition-all backdrop-blur-3xl overflow-hidden relative">
      <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform ${colorMap[color].split(' ')[0]}`}>
        {icon}
      </div>
      <CardContent className="p-6 relative z-10 space-y-1">
        <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">{title}</p>
        <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
        <p className="text-[9px] text-gray-500 font-bold uppercase">{subtitle}</p>
        <div className="pt-4 flex items-center justify-between">
           <p className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${colorMap[color]}`}>{trend}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function WardInfoRow({ label, value }: WardInfoRowProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-[8px] text-gray-600 uppercase font-black tracking-wider leading-none">{label}</p>
            <p className="text-[11px] text-gray-300 font-bold uppercase leading-tight truncate">{value}</p>
        </div>
    )
}

function ComplianceRow({ label, status, color }: ComplianceRowProps) {
    const colorMap = {
        emerald: "bg-emerald-500 border-emerald-500/50",
        indigo: "bg-indigo-500 border-indigo-500/50",
    }
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">{label}</p>
            <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${colorMap[color].split(' ')[0]}`} />
                <p className={`text-[9px] font-black uppercase tracking-widest ${color === 'emerald' ? 'text-emerald-400' : 'text-indigo-400'}`}>{status}</p>
            </div>
        </div>
    )
}

function ActionButton({ icon, label, color }: ActionButtonProps) {
    const colorMap = {
        indigo: "hover:bg-indigo-600/20 hover:text-indigo-400 border-indigo-500/20 hover:border-indigo-500/40",
        amber: "hover:bg-amber-600/20 hover:text-amber-400 border-amber-500/20 hover:border-amber-500/40",
        emerald: "hover:bg-emerald-600/20 hover:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40",
        purple: "hover:bg-purple-600/20 hover:text-purple-400 border-purple-500/20 hover:border-purple-500/40",
    }
    return (
        <Button variant="outline" className={`h-16 w-full flex-col gap-1.5 bg-white/5 border text-gray-500 transition-all rounded-xl ${colorMap[color]}`}>
            {icon}
            <span className="text-[8px] font-black uppercase tracking-tight">{label}</span>
        </Button>
    )
}
