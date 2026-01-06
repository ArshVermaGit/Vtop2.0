import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, ShieldCheck, Search, Download, ExternalLink, Info, AlertTriangle } from "lucide-react"
import { getExamSchedules, getSeatAllocations, getHallTicketEligibility } from "@/lib/actions"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ExamDashboardPage() {
  const [schedules, allocations, eligibility] = await Promise.all([
    getExamSchedules(),
    getSeatAllocations(),
    getHallTicketEligibility()
  ])

  const groupedExams = {
    'CAT-1': schedules.filter(s => s.type === 'CAT-1'),
    'CAT-2': schedules.filter(s => s.type === 'CAT-2'),
    'FAT': schedules.filter(s => s.type === 'FAT'),
    'QUIZ': schedules.filter(s => s.type === 'QUIZ'),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-indigo-500" /> Examination Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Winter Semester 2026-27 • Assessment Schedule & Credentials</p>
        </div>
        <div className="flex items-center gap-3">
             <Link href="/student/academics/exams/hall-ticket">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10">
                    <Download className="w-4 h-4 mr-2" /> Digital Hall Ticket
                </Button>
             </Link>
             <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-1">ACTIVE ASSESSMENTS</Badge>
        </div>
      </div>

      {!eligibility.eligible && (
        <div className="p-4 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-start gap-4 shadow-2xl">
            <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
            <div className="space-y-1">
                <h4 className="text-rose-400 font-bold text-sm uppercase tracking-wider">Hall Ticket Blocked</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                    You are not eligible to download the hall ticket due to <span className="font-bold text-rose-500">{eligibility.blockers?.join(', ') || 'policy violations'}</span>. 
                    Please contact the academic office or clear pending dues.
                </p>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Tabs defaultValue="CAT-1" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto flex-wrap mb-6">
              {['CAT-1', 'CAT-2', 'FAT', 'QUIZ'].map((type) => (
                <TabsTrigger key={type} value={type} className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-2 text-xs font-bold uppercase tracking-widest">
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedExams).map(([type, exams]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                 {exams.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10 dashed">
                        No examination scheduled for {type} at this moment.
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {exams.map((exam: any) => {
                            const allocation = allocations.find(a => a.examScheduleId === exam.id)
                            return (
                                <Card key={exam.id} className="bg-white/5 border-white/10 overflow-hidden group hover:border-indigo-500/30 transition-all">
                                    <div className="p-5 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center text-center">
                                                <span className="text-[10px] text-gray-500 font-black uppercase mb-0.5">{format(new Date(exam.examDate), 'MMM')}</span>
                                                <span className="text-xl font-black text-white">{format(new Date(exam.examDate), 'dd')}</span>
                                            </div>
                                            <div>
                                                <Badge variant="outline" className="border-white/10 text-indigo-400 text-[9px] font-bold uppercase mb-1">{exam.courseCode}</Badge>
                                                <h3 className="text-white font-bold text-md leading-tight group-hover:text-indigo-400 transition-colors">{exam.courseTitle}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                                        <Clock className="w-3 h-3" /> {exam.slot}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                                        <MapPin className="w-3 h-3" /> {exam.venue}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-center min-w-[120px]">
                                            {allocation ? (
                                                <div className="text-right">
                                                    <p className="text-[9px] text-gray-500 uppercase font-black">Seat Allocation</p>
                                                    <p className="text-emerald-400 font-black text-lg">{allocation.roomNo} <span className="text-gray-600 text-xs">/</span > {allocation.seatNo}</p>
                                                </div>
                                            ) : (
                                                <Badge className="bg-amber-600/10 text-amber-500 border border-amber-500/10">ALLOTTING...</Badge>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                 )}
              </TabsContent>
            ))}
           </Tabs>
        </div>

        <div className="space-y-6">
            <Card className="bg-indigo-600/5 border-indigo-500/10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <ShieldCheck className="w-24 h-24 text-indigo-500" />
                </div>
                <CardHeader>
                    <CardTitle className="text-white text-md">Exam Policy & Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                     <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-gray-400 leading-relaxed italic">Digital Hall Ticket and valid University ID card are mandatory for entry into the exam hall.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-gray-400 leading-relaxed italic">Reporting time is 30 minutes before the scheduled start time.</p>
                        </div>
                     </div>
                     <Link href="/student/academics/exams/hall-ticket" className="block">
                        <Button variant="outline" className="w-full border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/10 uppercase text-[10px] font-black h-11 tracking-wider">
                            View Credentials <ExternalLink className="w-3.5 h-3.5 ml-2" />
                        </Button>
                     </Link>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-white text-md">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                        <div>
                            <p className="text-white text-xs font-bold">CAT-1 Re-Exam</p>
                            <p className="text-[9px] text-gray-500">Apply by Feb 15</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-indigo-400 text-[10px] font-black uppercase">Apply</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                        <div>
                            <p className="text-white text-xs font-bold">Grade Withdrawal</p>
                            <p className="text-[9px] text-gray-500">Apply by Mar 02</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-indigo-400 text-[10px] font-black uppercase">Apply</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
