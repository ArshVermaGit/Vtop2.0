import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, Percent, Activity, Fingerprint, Calendar, BookOpen, User, AlertCircle } from "lucide-react"
import { getAttendance, getAttendanceLogs, getBiometricReports } from "@/lib/actions"
import { Progress } from "@/components/ui/progress"

export default async function StudentAttendancePage() {
  const [attendance, logs, biometric] = await Promise.all([
    getAttendance(),
    getAttendanceLogs(),
    getBiometricReports()
  ])

  const overall = attendance.length > 0 
    ? Math.round(attendance.reduce((acc, a) => acc + a.percentage, 0) / attendance.length) 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Activity className="w-8 h-8 text-blue-400" /> Attendance Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Real-time attendance tracking and biometric logs</p>
        </div>
        <div className="text-right">
             <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Overall Percentage</p>
             <div className="flex items-center gap-4">
                <span className={`text-3xl font-black ${overall >= 75 ? 'text-emerald-400' : 'text-rose-500'}`}>{overall}%</span>
                <Progress value={overall} className="w-24 h-2 bg-white/5" />
             </div>
        </div>
      </div>

      <Tabs defaultValue="subject-wise" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto flex-wrap mb-6">
          <TabsTrigger value="subject-wise" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest">Subject-wise</TabsTrigger>
          <TabsTrigger value="daily-log" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest">Daily Log</TabsTrigger>
          <TabsTrigger value="biometric" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest">Biometric Log</TabsTrigger>
        </TabsList>

        <TabsContent value="subject-wise" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {attendance.map((item) => (
                 <Card key={item.id} className="bg-white/5 border-white/10 overflow-hidden group hover:bg-white/[0.08] transition-all">
                    <div className={`h-1 w-full ${item.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                             <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest">{item.course.code}</Badge>
                             <div className="text-right">
                                <span className={`text-2xl font-black ${item.percentage >= 75 ? 'text-white' : 'text-rose-400'}`}>{Math.round(item.percentage)}%</span>
                             </div>
                        </div>
                        <CardTitle className="text-white text-md mt-2 line-clamp-1">{item.course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                             <span className="text-gray-500 font-bold uppercase">Attended</span>
                             <span className="text-white font-bold">{item.attendedClasses} / {item.totalClasses}</span>
                        </div>
                        <Progress value={item.percentage} className={`h-1.5 bg-black/20`} />
                        
                        <div className="pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                <User className="w-3 h-3" /> {item.course.faculty?.user.name}
                            </div>
                            {item.percentage < 75 && (
                                <Badge className="bg-rose-600/10 text-rose-400 border border-rose-500/20 text-[8px] animate-pulse">DEBARMENT RISK</Badge>
                            )}
                        </div>
                    </CardContent>
                 </Card>
             ))}
        </TabsContent>

        <TabsContent value="daily-log" className="space-y-4">
             <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-white/5">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-black/40">
                      <tr>
                         <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Date</th>
                         <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Course</th>
                         <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Slot</th>
                         <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">Status</th>
                         <th className="p-4 text-[10px] text-gray-500 uppercase font-black tracking-widest text-right">Faculty</th>
                      </tr>
                   </thead>
                   <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                           <td className="p-4">
                                <p className="text-white font-bold text-sm">{new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                <p className="text-[10px] text-gray-600">{new Date(log.date).getFullYear()}</p>
                           </td>
                           <td className="p-4 text-white font-medium text-sm">{log.course.title}</td>
                           <td className="p-4"><Badge variant="outline" className="border-white/10 text-gray-500">{log.slot}</Badge></td>
                           <td className="p-4">
                                <Badge className={
                                    log.status === 'PRESENT' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 
                                    log.status === 'ABSENT' ? 'bg-rose-600/10 text-rose-400 border border-rose-500/20' : 
                                    'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                }>
                                    {log.status === 'PRESENT' ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : 
                                     log.status === 'ABSENT' ? <XCircle className="w-3 h-3 mr-1.5" /> : 
                                     <Clock className="w-3 h-3 mr-1.5" />}
                                    {log.status}
                                </Badge>
                           </td>
                           <td className="p-4 text-right text-xs text-gray-500">{log.faculty.user.name}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
        </TabsContent>

        <TabsContent value="biometric" className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {biometric.map((entry) => (
                    <div key={entry.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-lg">
                        <div className="flex items-center gap-4">
                           <div className="p-3 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
                               <Fingerprint className="w-5 h-5" />
                           </div>
                           <div>
                               <h4 className="text-white font-bold text-sm">Main Campus Gate Entry</h4>
                               <p className="text-[10px] text-gray-500 uppercase font-black">{new Date(entry.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                            <p className="text-emerald-400 font-black text-sm">{entry.status}</p>
                            <p className="text-[10px] text-gray-600 font-bold">DEVICE ID: 082</p>
                        </div>
                    </div>
                ))}
             </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
